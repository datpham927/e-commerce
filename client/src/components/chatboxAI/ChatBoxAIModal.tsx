import React, { memo, useEffect, useRef, useState } from 'react';
import SendIcon from '@mui/icons-material/Send';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { generateGeminiResponse } from '../../services/gemini.service';
import ReactLoading from 'react-loading';
import parse from 'html-react-parser';

interface ChatMessage {
    id: string;
    role: 'user' | 'bot';
    content: string;
}

interface ChatBoxAIModalProps {
    context: string;
    isOpenBox: boolean;
    setIsOpenBox?: (open: boolean) => void;
}

const ChatBoxAIModal: React.FC<ChatBoxAIModalProps> = ({ context, isOpenBox, setIsOpenBox }) => {
    const [prompt, setPrompt] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: crypto.randomUUID(),
            role: 'bot',
            content: `👋 Chào bạn nha! Mình là ChatBoxAI – trợ lý vui tính của cửa hàng thực phẩm 🛒 Bạn cần gì giúp đỡ, cứ thoải mái hỏi mình nhé! 😆`,
        },
    ]);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Scroll xuống cuối khi có tin nhắn mới
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Điều khiển hiển thị box chat
    useEffect(() => {
        if (isOpenBox) setIsVisible(true);
        else setTimeout(() => setIsVisible(false), 299); // sync với animation
    }, [isOpenBox]);

    const sendMessage = async () => {
        if (!prompt.trim() || isLoading) return;

        const userMessage: ChatMessage = {
            id: crypto.randomUUID(),
            role: 'user',
            content: prompt.trim(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setPrompt('');
        setIsLoading(true);

        try {
            const promptWithContext = `${context}\n\nCâu hỏi: ${prompt.trim()}`;
            const reply = await generateGeminiResponse(promptWithContext);
            const botMessage: ChatMessage = {
                id: crypto.randomUUID(),
                role: 'bot',
                content: reply,
            };
            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error(error);
            setMessages((prev) => [
                ...prev,
                {
                    id: crypto.randomUUID(),
                    role: 'bot',
                    content: 'Xin lỗi, tôi gặp sự cố khi xử lý yêu cầu. Vui lòng thử lại sau.',
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sendMessage();
    };

    if (!isVisible) return null;
    console.log({ context });
    return (
        <div
            className={`tablet:w-full tablet:h-[75vh] laptop:absolute bottom-0 right-0 w-auto laptop:h-[500px] bg-white shadow-search rounded-md duration-1000 origin-bottom-right z-[1000] ${
                isOpenBox ? 'laptop:animate-active-openChat' : 'laptop:animate-active-openChatOff'
            }`}>
            <div className=" flex h-full laptop:w-[400px] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800">
                {/* Header */}
                <div className="tablet:hidden flex items-center justify-between border-b px-5 py-4">
                    <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 rounded-full">
                            <img
                                src="https://photo.salekit.com/uploads/fchat_5b4872d13803896dd77125af/logo1.png"
                                alt="AI"
                                className="h-full w-full rounded-full object-cover"
                            />
                            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-success-500"></span>
                        </div>
                        <h5 className="text-sm font-medium text-gray-500">Trợ lý AI</h5>
                    </div>
                    <button onClick={() => setIsOpenBox?.(false)} className="text-secondary tablet:hidden">
                        <ExpandMoreIcon fontSize="large" />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-auto p-5 space-y-6 relative custom-scrollbar">
                    {!context && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
                            <ReactLoading type="cylon" color="rgb(0, 136, 72)" />
                        </div>
                    )}
                    {messages.map((msg, idx) => (
                        <div
                            key={msg.id}
                            ref={idx === messages.length - 1 ? scrollRef : null}
                            className={`flex w-full max-w-[400px] gap-3 mb-4 ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}>
                            {msg.role === 'bot' && (
                                <img
                                    src="https://photo.salekit.com/uploads/fchat_5b4872d13803896dd77125af/logo1.png"
                                    alt="Bot"
                                    className="h-8 w-8 rounded-full object-cover"
                                />
                            )}
                            <div className={`flex max-w-[300px] flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                <div
                                    className={`rounded-2xl px-4 py-2 text-sm shadow-sm ${
                                        msg.role === 'user'
                                            ? 'bg-gradient-to-br from-brand-500 to-brand-600 text-white rounded-tr-none'
                                            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-white/90 rounded-tl-none'
                                    }`}>
                                    {msg.role === 'user' ? <p>{msg.content}</p> : parse(msg.content)}
                                </div>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-white/80">
                            <img
                                src="https://photo.salekit.com/uploads/fchat_5b4872d13803896dd77125af/logo1.png"
                                alt="Bot"
                                className="h-8 w-8 rounded-full object-cover"
                            />
                            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-3 rounded-full shadow-md">
                                <p className="text-xs text-gray-500 dark:text-white">Đang nhập</p>
                                <ReactLoading type="bubbles" color="#4CAF50" height={20} width={20} />
                            </div>
                        </div>
                    )}
                </div>

                {/* Input */}
                <div className="p-3 border-t dark:border-gray-800">
                    <form onSubmit={handleSubmit} className="relative flex items-center">
                        <input
                            type="text"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    sendMessage();
                                }
                            }}
                            placeholder="Nhập tin nhắn"
                            disabled={isLoading}
                            className="h-9 w-full pl-10 pr-10 text-sm border rounded-full px-4 py-2 border-gray-300 focus:outline-none"
                        />
                        <span className="absolute left-3 text-gray-400">
                            <svg className="fill-current" width="20" height="20" viewBox="0 0 24 24">
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM8.75 7.98A1.25 1.25 0 1 0 10 9.23a1.25 1.25 0 0 0-1.25-1.25zm6.5 0a1.25 1.25 0 1 1-1.25 1.25c0-.69.56-1.25 1.25-1.25zM8.18 13.59a.75.75 0 0 1 1.05.14 3.79 3.79 0 0 0 6.54 0 .75.75 0 0 1 1.2.91 5.29 5.29 0 0 1-8.94 0 .75.75 0 0 1 .14-1.05z"
                                />
                            </svg>
                        </span>
                        <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-brand-600" disabled={isLoading}>
                            <SendIcon />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default memo(ChatBoxAIModal);
