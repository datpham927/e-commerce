/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { memo, useEffect, useRef, useState } from 'react';
import SendIcon from '@mui/icons-material/Send';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import useUserStore from '../../../store/userStore';
import { apiGetMessagesByConversation, apiMarkMessagesAsSeenByUser, apiSendMessageByUSer } from '../../../services/message.service';
import { IMessage } from '../../../interfaces/messages.interfaces';
import ChatMessage from '../../ChatMessage';
import { useActionStore } from '../../../store/actionStore';
import { useNavigate } from 'react-router';
import { apiUploadImage } from '../../../services/uploadPicture.service';
import useSocketStore from '../../../store/socketStore';
import useAuthStore from '../../../store/authStore';
import ReactLoading from 'react-loading';

const ChatModal: React.FC<{ conversationId: string; setUnreadMessages?: (count: any) => void }> = ({ conversationId, setUnreadMessages }) => {
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [isOpenBox, setIsOpenBox] = useState<boolean>(false);
    const [value, setValue] = useState<string>('');
    const [isScrolling, setIsScrolling] = useState<boolean>(false);
    const { user } = useUserStore();
    const { isOpenChat, setIsOpenChat, mobile_ui, setIsLoading } = useActionStore();
    const navigate = useNavigate();
    const { socket, isConnected, connect } = useSocketStore();
    const { isUserLoggedIn } = useAuthStore();

    useEffect(() => {
        if (isOpenChat) {
            setIsOpenBox(true);
        } else {
            setTimeout(() => setIsOpenBox(false), 299);
        }
    }, [isOpenChat]);

    useEffect(() => {
        if (!isConnected) connect();
    }, [isConnected, connect]);

    useEffect(() => {
        if (!isUserLoggedIn) {
            setMessages([]);
            setIsOpenChat(false);
        }
    }, [isUserLoggedIn]);

    useEffect(() => {
        if (!isConnected || !isUserLoggedIn || !socket) return;
        const handleGetMessageByAdmin = (data: IMessage) => {
            setMessages((prev) => [...prev, data]);
        };
        socket.on('getMessage', handleGetMessageByAdmin);
        return () => {
            socket.off('getMessage', handleGetMessageByAdmin);
        };
    }, [isConnected, isUserLoggedIn, socket]);

    useEffect(() => {
        if (!conversationId || !isOpenBox) return;
        const fetchApi = async () => {
            const res = await apiGetMessagesByConversation(conversationId);
            await apiMarkMessagesAsSeenByUser(conversationId);
            setUnreadMessages?.(0);
            setMessages(
                res.data && res.data.length > 0
                    ? res.data
                    : [
                          {
                              sender: {
                                  admin_name: 'robot',
                                  admin_avatar_url: 'https://photo.salekit.com/uploads/fchat_5b4872d13803896dd77125af/logo1.png',
                                  _id: '',
                              },
                              senderRole: 'admin',
                              text: 'Chờ xíu nha, mình đang liên kết với bạn hỗ trợ siêu đáng yêu nè!😜',
                              seen: true,
                              createdAt: new Date().toISOString(),
                          },
                      ],
            );
        };
        fetchApi();
    }, [conversationId, isOpenBox]);

    const scroll = useRef<any>(null);
    useEffect(() => {
        if (!isOpenBox || !scroll.current) return;
        setIsScrolling(true);
        scroll.current.scrollIntoView({
            behavior: 'instant',
            block: 'end',
        });
        setIsScrolling(false);
    }, [messages, isOpenBox]);

    const handleOnClick = async () => {
        if (value) {
            const message = await apiSendMessageByUSer({
                conversationId: conversationId,
                text: value,
            });
            setValue('');
            if (message.success) {
                setMessages((prev) => [...prev, { ...message.data, sender: user }]);
                socket.emit('sendMessageForAdminOnline', {
                    ...message.data,
                    sender: user,
                });
                setValue('');
            }
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setIsLoading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', import.meta.env.VITE_REACT_UPLOAD_PRESET as string);
        const response = await apiUploadImage(formData);
        const uploadedUrl = response.url;
        const message = await apiSendMessageByUSer({
            conversationId: conversationId,
            image: uploadedUrl,
        });
        setIsLoading(false);
        if (message.success) {
            setMessages((prev) => [...prev, { ...message.data, sender: user }]);
            socket.emit('sendMessageForAdminOnline', {
                ...message.data,
                sender: user,
            });
            setValue('');
        }
    };

    if (!isOpenBox) return <></>;

    return (
        <div
            className={`tablet:w-full tablet:h-[75vh]  laptop:absolute   bottom-0 right-0 w-auto h-[500px] bg-white shadow-search rounded-md duration-1000 origin-bottom-right z-[1000] ${
                isOpenChat ? 'laptop:animate-active-openChat' : 'laptop:animate-active-openChatOff'
            }`}>
            <div className="flex tablet:w-full h-full laptop:w-[400px] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="tablet:hidden sticky flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-800 xl:px-6">
                    <div className="flex w-full items-center gap-3">
                        <div className="relative h-12 w-full max-w-[48px] rounded-full">
                            <img
                                src="https://photo.salekit.com/uploads/fchat_5b4872d13803896dd77125af/logo1.png"
                                alt="profile"
                                className="h-full w-full overflow-hidden rounded-full object-cover object-center"
                            />
                            <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full border-[1.5px] border-white dark:border-gray-900 bg-success-500"></span>
                        </div>
                        <h5 className="text-sm font-medium text-gray-500 dark:text-gray-400">Hỏi Trợ lý cá nhân</h5>
                    </div>
                    <div className=" flex items-center gap-3">
                        <div className="flex gap-2">
                            <div
                                className="text-secondary cursor-pointer"
                                onClick={() => {
                                    if (mobile_ui) {
                                        navigate('/');
                                        return;
                                    }
                                    setIsOpenChat(!isOpenChat);
                                }}>
                                <ExpandMoreIcon fontSize="large" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative custom-scrollbar max-h-full flex-1 space-y-6 overflow-auto p-5 xl:space-y-8 xl:p-6">
                    {isScrolling && (
                        <div className="absolute inset-0 bg-white flex items-center justify-center">
                            <div className="w-full flex justify-center h-full items-center">
                                <ReactLoading type="cylon" color="rgb(0, 136, 72)" />
                            </div>
                        </div>
                    )}
                    {messages?.map((message, index) => (
                        <div ref={scroll} key={index}>
                            <ChatMessage message={message} isSentByUser={message?.sender._id === user?._id} />
                        </div>
                    ))}
                </div>

                <div className="sticky bottom-0 border-t border-gray-200 p-3 dark:border-gray-800">
                    <div className="flex items-center justify-between">
                        <div className="w-full">
                            <div className="absolute left-1 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white/90 sm:left-3">
                                <svg className="fill-current" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM3.5 12C3.5 7.30558 7.30558 3.5 12 3.5C16.6944 3.5 20.5 7.30558 20.5 12C20.5 16.6944 16.6944 20.5 12 20.5C7.30558 20.5 3.5 16.6944 3.5 12ZM10.0001 9.23256C10.0001 8.5422 9.44042 7.98256 8.75007 7.98256C8.05971 7.98256 7.50007 8.5422 7.50007 9.23256V9.23266C7.50007 9.92301 8.05971 10.4827 8.75007 10.4827C9.44042 10.4827 10.0001 9.92301 10.0001 9.23266V9.23256ZM15.2499 7.98256C15.9403 7.98256 16.4999 8.23256V9.23266C16.4999 9.92301 15.9403 10.4827 15.2499 10.4827C14.5596 10.4827 13.9999 9.92301 13.9999 9.23266V9.23256C13.9999 8.5422 14.5596 7.98256 15.2499 7.98256ZM9.23014 13.7116C8.97215 13.3876 8.5003 13.334 8.17625 13.592C7.8522 13.85 7.79865 14.3219 8.05665 14.6459C8.97846 15.8037 10.4026 16.5481 12 16.5481C SPACEBAR 13.5975 16.5481 15.0216 15.8037 15.9434 14.6459C16.2014 14.3219 16.1479 13.85 15.8238 13.592C15.4998 13.334 15.0279 13.3876 14.7699 13.7116C14.1205 14.5274 13.1213 15.0481 12 15.0481C10.8788 15.0481 9.87961 14.5274 9.23014 13.7116Z"
                                        fill=""
                                    />
                                </svg>
                            </div>
                            <input
                                type="text"
                                onChange={(e) => setValue(e?.target?.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        handleOnClick();
                                    }
                                }}
                                placeholder="Nhập tin nhắn"
                                value={value}
                                className="h-9 w-full border-none bg-transparent pl-12 pr-5 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:border-0 focus:ring-0 dark:text-white/90"
                            />
                        </div>
                        <div className="flex items-center">
                            <div className="mr-2 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white/90">
                                <label htmlFor="comment_input" className="cursor-pointer">
                                    <input id="comment_input" type="file" multiple hidden onChange={handleImageUpload} />
                                    <svg className="fill-current" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M12.9522 14.4422C12.9522 14.452 12.9524 14.4618 12.9527 14.4714V16.1442C12.9527 16.6699 12.5265 17.0961 12.0008 17.0961C11.475 17.0961 11.0488 16.6699 11.0488 16.1442V6.15388C11.0488 5.73966 10.7131 5.40388 10.2988 5.40388C9.88463 5.40388 9.54885 5.73966 9.54885 6.15388V16.1442C9.54885 17.4984 10.6466 18.5961 12.0008 18.5961C13.355 18.5961 14.4527 17.4983 14.4527 16.1442V6.15388C14.4527 6.14308 14.4525 6.13235 14.452 6.12166C14.4347 3.84237 12.5817 2 10.2983 2C8.00416 2 6.14441 3.85976 6.14441 6.15388V14.4422C6.14441 14.4492 6.1445 14.4561 6.14469 14.463V16.1442C6.14469 19.3783 8.76643 22 12.0005 22C15.2346 22 17.8563 19.3783 17.8563 16.1442V9.55775C17.8563 9.14354 17.5205 8.80775 17.1063 8.80775C16.6921 8.80775 16.3563 9.14354 16.3563 9.55775V16.1442C16.3563 18.5498 14.4062 20.5 12.0005 20.5C9.59485 20.5 7.64469 18.5498 7.64469 16.1442V9.55775C7.64469 9.55083 7.6446 9.54393 7.64441 9.53706L7.64441 6.15388C7.64441 4.68818 8.83259 3.5 10.2983 3.5C11.764 3.5 12.9522 4.68818 12.9522 6.15388L12.9522 14.4422Z"
                                        />
                                    </svg>
                                </label>
                            </div>
                            <button
                                onClick={handleOnClick}
                                className=" ml-3 flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500 text-white hover:bg-brand-600 xl:ml-5">
                                <SendIcon />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(ChatModal);
