/* eslint-disable react-hooks/exhaustive-deps */
import { BrowserRouter } from 'react-router-dom';
import RouterPage from './routes/RouterPage';
import { useEffect } from 'react';
import useSocketStore from './store/socketStore';
import useUserStore from './store/userStore';
import { useActionStore } from './store/actionStore';

export default function App() {
    const { socket, isConnected, connect } = useSocketStore();
    const { user } = useUserStore();
    const { setMobileUi } = useActionStore();
    useEffect(() => {
        setMobileUi(window.innerWidth < 1024);
    }, []);
    useEffect(() => {
        const handleResize = () => {
            setMobileUi(window.innerWidth < 1024);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    // Kết nối socket khi ứng dụng tải
    useEffect(() => {
        if (!isConnected) connect();
    }, [isConnected, connect]);

    // Gửi sự kiện addUser hoặc addAdmin nếu có ID hợp lệ
    useEffect(() => {
        if (!isConnected || !socket) return;
        if (user?._id) {
            socket.emit('addUser', user._id);
        }
    }, [isConnected, user?._id, socket]);

    return (
        <BrowserRouter>
            <RouterPage />
        </BrowserRouter>
    );
}
