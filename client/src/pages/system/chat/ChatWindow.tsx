/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from 'react';
import { IConversation } from '../../../interfaces/conversation.interfaces';
import { IMessage } from '../../../interfaces/messages.interfaces';
import { notificationAudio, userAvatar } from '../../../assets';
import { apiGetMessagesByConversation, apiSendMessageByAdmin } from '../../../services/message.service';
import { apiUploadImage } from '../../../services/uploadPicture.service';

import ChatMessage from '../../../components/ChatMessage';
import { useActionStore } from '../../../store/actionStore';
import useSocketStore from '../../../store/socketStore';
import useAuthStore from '../../../store/authStore';
import useAdminStore from '../../../store/adminStore';

import ReactLoading from 'react-loading';
import SendIcon from '@mui/icons-material/Send';

interface UserOnline {
    userId: string;
    socketId: string;
}

interface ChatWindowProps {
    selectedConversation: IConversation | any;
    userOnline: UserOnline[];
}

const ChatWindow: React.FC<ChatWindowProps> = ({ selectedConversation, userOnline }) => {
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [value, setValue] = useState<string>('');
    const [isScrolling, setIsScrolling] = useState<boolean>(false);

    const { setIsLoading } = useActionStore();
    const { socket, connect, isConnected } = useSocketStore();
    const { isAdminLoggedIn } = useAuthStore();
    const { admin } = useAdminStore();

    const scrollRef = useRef<HTMLDivElement>(null);

    // Socket connection
    useEffect(() => {
        if (!isConnected) connect();
    }, [isConnected, connect]);

    // Listen to new messages from socket
    useEffect(() => {
        if (!socket || !isConnected || !isAdminLoggedIn) return;

        const handleIncomingMessage = (message: IMessage) => {
            setMessages((prev) => [...prev, message]);
            const audio = new Audio(notificationAudio);
            audio.play();
        };

        socket.on('getMessageByAdmin', handleIncomingMessage);
        return () => socket.off('getMessageByAdmin', handleIncomingMessage);
    }, [socket, isConnected, isAdminLoggedIn]);

    // Load conversation messages
    useEffect(() => {
        if (!selectedConversation?._id) return;
        let timeoutId: NodeJS.Timeout;
        const fetchMessages = async () => {
            setIsScrolling(true);
            try {
                const res = await apiGetMessagesByConversation(selectedConversation._id);
                if (res.success) {
                    setMessages(res.data);
                }
            } finally {
                timeoutId = setTimeout(() => setIsScrolling(false), 1000);
            }
        };
        fetchMessages();
        return () => {
            clearTimeout(timeoutId);
        };
    }, [selectedConversation]);

    // Auto scroll to bottom when new message
    useEffect(() => {
        if (scrollRef.current) {
            setIsScrolling(true);
            scrollRef.current.scrollIntoView({ behavior: 'instant', block: 'end' });
            const timeout = setTimeout(() => setIsScrolling(false), 1000);
            return () => clearTimeout(timeout);
        }
    }, [messages]);

    const handleSendMessage = async () => {
        if (!value.trim()) return;
        const res = await apiSendMessageByAdmin({
            conversationId: selectedConversation._id,
            text: value,
        });
        setValue('');
        if (res.success) {
            setMessages((prev) => [...prev, res.data]);
            socket.emit('sendMessage', {
                ...res.data,
                sender: admin,
                receiver: selectedConversation.user._id,
            });
        }
    };

    const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsLoading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', import.meta.env.VITE_REACT_UPLOAD_PRESET as string);

        const resUpload = await apiUploadImage(formData);
        const resSend = await apiSendMessageByAdmin({
            conversationId: selectedConversation._id,
            image: resUpload.url,
        });
        setIsLoading(false);

        if (resSend.success) {
            setMessages((prev) => [...prev, resSend.data]);
            socket.emit('sendMessage', {
                ...resSend.data,
                sender: admin,
                receiver: selectedConversation.user._id,
            });
        }
    };

    if (!selectedConversation) {
        return (
            <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <p className="text-gray-500 dark:text-gray-400">Chọn một cuộc trò chuyện để bắt đầu nhắn tin</p>
            </div>
        );
    }

    const isUserOnline = userOnline.some((u) => u.userId === selectedConversation.user?._id);

    return (
        <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] xl:w-2/3">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-800 xl:px-6">
                <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 rounded-full">
                        <img src={selectedConversation.user.user_avatar_url || userAvatar} alt="avatar" className="h-full w-full rounded-full object-cover" />
                        {isUserOnline && (
                            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-gray-900 bg-green-500"></span>
                        )}
                    </div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{selectedConversation.user.user_name}</span>
                </div>
                <div className="flex gap-3">
                    {/* Action buttons */}
                    <button className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">📞</button>
                    <button className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">🎥</button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 relative overflow-auto p-4 space-y-4 custom-scrollbar">
                {isScrolling && (
                    <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 flex items-center justify-center z-10">
                        <ReactLoading type="cylon" color="#008848" />
                    </div>
                )}
                {messages.map((message, index) => (
                    <div key={index} ref={scrollRef}>
                        <ChatMessage message={message} isSentByUser={message.senderRole === 'Admin'} />
                    </div>
                ))}
            </div>

            {/* Message Input */}
            {admin.admin_type !== 'admin' && (
                <div className="border-t border-gray-200 p-3 dark:border-gray-800">
                    <div className="flex items-center gap-2">
                        <input
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            type="text"
                            placeholder="Nhập tin nhắn..."
                            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-green-500 dark:bg-gray-800 dark:text-white"
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        />
                        <label className="cursor-pointer text-green-600">
                            📎
                            <input type="file" accept="image/*" hidden onChange={handleUploadImage} />
                        </label>
                        <button onClick={handleSendMessage} className="text-white bg-green-600 p-2 rounded-full hover:bg-green-700">
                            <SendIcon />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatWindow;
