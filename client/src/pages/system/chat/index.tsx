/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import PageBreadcrumb from '../../../components/common/PageBreadCrumb';
import PageMeta from '../../../components/common/PageMeta';
import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';

import { getAllConversations, getAllConversationsByAdmin } from '../../../services/conversation';
import { apiMarkMessagesAsSeenByAdmin } from '../../../services/message.service';

import useSocketStore from '../../../store/socketStore';
import useAuthStore from '../../../store/authStore';

import { IConversation } from '../../../interfaces/conversation.interfaces';
import { IMessage } from '../../../interfaces/messages.interfaces';
import NotExit from '../../../components/common/NotExit';
import useAdminStore from '../../../store/adminStore';

interface UserOnline {
    userId: string;
    socketId: string;
}

const ChatManage: React.FC = () => {
    const [conversations, setConversations] = useState<IConversation[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<IConversation>();
    const [userOnline, setUserOnline] = useState<UserOnline[]>([]);
    const { socket, connect, isConnected } = useSocketStore();
    const { isAdminLoggedIn } = useAuthStore();
    const { admin } = useAdminStore();

    // Fetch initial conversations
    useEffect(() => {
        const fetchConversations = async () => {
            const res = admin.admin_type === 'admin' ? await getAllConversations() : await getAllConversationsByAdmin();
            if (res.success) {
                setConversations(res.data);
            }
        };
        fetchConversations();
    }, []);

    // Connect socket if not already connected
    useEffect(() => {
        if (!isConnected) {
            connect();
        }
    }, [isConnected, connect]);

    // Select a conversation and mark as seen
    const handleSelectChat = async (conversation: IConversation) => {
        await apiMarkMessagesAsSeenByAdmin(conversation._id);

        setConversations((prev) => prev.map((item) => (item._id === conversation._id ? { ...item, seen: true } : item)));

        setSelectedConversation(conversation);
    };

    // Listen for online users
    useEffect(() => {
        if (!socket || !isConnected || !isAdminLoggedIn) return;

        const handleGetUserOnline = (users: UserOnline[]) => {
            setUserOnline(users);
        };

        socket.on('getUserOnline', handleGetUserOnline);

        return () => {
            socket.off('getUserOnline', handleGetUserOnline);
        };
    }, [socket, isConnected, isAdminLoggedIn]);

    // Listen for new messages
    useEffect(() => {
        if (!socket || !isConnected || !isAdminLoggedIn) return;
        const handleNewMessage = (data: IMessage) => {
            const isCurrent = selectedConversation?._id === data.conversationId;

            // Nếu đang trong hội thoại đang chọn → bỏ qua, không cần đánh dấu chưa đọc
            if (isCurrent) return;

            setConversations((prev) => prev.map((item) => (item._id === data.conversationId && item.seen ? { ...item, seen: false } : item)));
        };

        socket.on('getMessageByAdmin', handleNewMessage);

        return () => {
            socket.off('getMessageByAdmin', handleNewMessage);
        };
    }, [socket, isConnected, isAdminLoggedIn, selectedConversation]);

    return (
        <div className="mx-auto md:p-6">
            <PageMeta title="Quản lý nhắn tin" />
            <PageBreadcrumb pageTitle="Nhắn tin" />
            <div className="h-[calc(100vh-186px)] overflow-hidden sm:h-[calc(100vh-174px)]">
                <div className="flex h-full flex-col gap-6 xl:flex-row xl:gap-5">
                    {conversations.length > 0 ? (
                        <>
                            {' '}
                            <Sidebar
                                conversations={conversations}
                                onSelectChat={handleSelectChat}
                                selectedConversation={selectedConversation}
                                userOnline={userOnline}
                            />
                            <ChatWindow selectedConversation={selectedConversation} userOnline={userOnline} />
                        </>
                    ) : (
                        <NotExit label="Chưa có tin nhắn nào" />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatManage;
