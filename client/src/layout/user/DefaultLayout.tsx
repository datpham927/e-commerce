/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Outlet } from 'react-router';
import Header from './Header';
import Footer from './Footer';
import { Auth } from '../../feature';
import useFetchUser from '../../hooks/useFetchUser';
import Loading from '../../components/common/Loading';
import Chat from '../../components/chat';
import ChatBoxAI from '../../components/chatboxAI';
import ToastComponent from '../../components/toastComponent';
import { BottomNavigate } from '../../components/mobile/BottomNavigate';
const DefaultLayout = () => {
    useFetchUser();
    return (
        <>
            <div className="flex flex-col h-full mx-auto  bg-background_primary">
                <Header />
                <main className="flex flex-col tablet:pb-20 tablet:bg-white  bg-background_primary  h-full w-full max-w-[1200px] tablet:px-0  mx-auto  ">
                    <Outlet />
                </main>
                <Footer />
                <Auth />
                <Loading />
                <div className="tablet:hidden fixed bottom-4 right-5 bg-blue-600 rounded-lg shadow-lg p-2 flex flex-col items-center justify-center space-y-2  z-[900] ">
                    <ChatBoxAI />
                    <Chat />
                </div>
            </div>
            <BottomNavigate />
            <ToastComponent />
        </>
    );
};

export default DefaultLayout;
