/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import ChatBotAIModal from './ChatBotAIModal';
import { apiGetPrompt } from '../../services/chatbot.service';
import useUserStore from '../../store/userStore';
import { showNotification } from '../common/showNotification';

const ChatBoxAI: React.FC = () => {
    const [isOpenBox, setIsOpenBox] = useState<boolean>(false);
    const [prompt, setPrompt] = useState<string>('');
    const { user } = useUserStore();
    useEffect(() => {
        const fetchApi = async () => {
            const res = await apiGetPrompt(user ? user._id : '');
            setPrompt(res.context);
        };
        fetchApi();
    }, [user._id]);

    return (
        // fixed bottom-1 right-5
        <div className="tablet:hidden">
            <div
                onClick={() => {
                    if (!prompt) {
                        showNotification('⏳ Mình đang xử lý, chờ một chút nhé!');
                    } else {
                        setIsOpenBox(true);
                    }
                }}
                className="flex flex-col text-blue-600 items-center cursor-pointer justify-center  h-12  rounded-md blue-600 text-sm   transition duration-200">
                <img src="https://photo.salekit.com/uploads/fchat_5b4872d13803896dd77125af/logo1.png" className="w-12" />
                Trợ lý
            </div>
            <ChatBotAIModal isOpenBox={isOpenBox} setIsOpenBox={setIsOpenBox} context={prompt} />
        </div>
    );
};

export default ChatBoxAI;
