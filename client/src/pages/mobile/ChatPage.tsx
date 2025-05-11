/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import ChatBoxAIModal from '../../components/chatboxAI/ChatBoxAIModal';
import ChatModal from '../../components/chat/chatModal';
import useUserStore from '../../store/userStore';
import useAuthStore from '../../store/authStore';
import { useActionStore } from '../../store/actionStore';
import { apiCreateConversation } from '../../services/conversation';
import { apiGetPrompt } from '../../services/chatbot.service';

const ChatPage: React.FC = () => {
    const [selectedOption, setSelectedOption] = useState<'ai' | 'human'>('ai');
    const [prompt, setPrompt] = useState<string>('');
    const [conversationId, setConversationId] = useState<string>('');
    const { user } = useUserStore();
    const { isUserLoggedIn } = useAuthStore();
    const { setOpenFeatureAuth, setIsLoading, setIsOpenChat } = useActionStore();

    // Fetch prompt when user ID or selected option changes
    useEffect(() => {
        if (selectedOption !== 'ai') return;
        const fetchPrompt = async () => {
            const res = await apiGetPrompt(user._id);
            setPrompt(res.context || '');
        };
        fetchPrompt();
    }, [user?._id, selectedOption]);
    // Fetch unread messages
    useEffect(() => {
        if (selectedOption !== 'human') return;
        const fetchCreateConversation = async () => {
            setIsLoading(true);
            const res = await apiCreateConversation();
            setIsLoading(false);
            if (res?.success && res?.data?._id) {
                setConversationId(res.data._id);
                setIsOpenChat(true);
            }
        };
        fetchCreateConversation();
    }, [selectedOption]);

    // Handle option change
    const handleOptionChange = (option: 'ai' | 'human') => {
        if (option === 'human' && !isUserLoggedIn) {
            setOpenFeatureAuth(true);
            return;
        }
        setSelectedOption(option);
    };
    return (
        <div className="fixed inset-0 w-full h-screen bg-gradient-to-br bg-white p-4 flex flex-col items-center justify-start space-y-6 z-[900] text-white">
            <div className="w-full flex justify-center">
                <h2 className="text-xl font-semibold text-primary">Chọn Trợ lý Trò chuyện</h2>
            </div>

            <div className="flex gap-4">
                <button
                    className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                        selectedOption === 'ai' ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600'
                    } text-white font-medium shadow-md`}
                    onClick={() => handleOptionChange('ai')}>
                    Trợ lý AI
                </button>
                <button
                    className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                        selectedOption === 'human' ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600'
                    } text-white font-medium shadow-md`}
                    onClick={() => handleOptionChange('human')}>
                    Trợ lý cá nhân
                </button>
            </div>

            <div className="w-full flex-1 overflow-y-auto px-4">
                {selectedOption === 'ai' ? <ChatBoxAIModal isOpenBox={true} context={prompt} /> : <ChatModal conversationId={conversationId} />}
            </div>
        </div>
    );
};

export default ChatPage;
