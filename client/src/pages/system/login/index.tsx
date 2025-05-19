/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { apiLoginAdmin } from '../../../services/auth.admin.service';
import { PATH } from '../../../utils/const';
import useAuthStore from '../../../store/authStore';

interface LoginForm {
    email: string;
    password: string;
}
const AdminLogin = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginForm>();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const { loginAdmin } = useAuthStore();

    const fireConfetti = () => {
        confetti({
            particleCount: 200,
            spread: 110,
            origin: { y: 0.8 },
            colors: ['#FFC700', '#FF0000', '#00FF00', '#0000FF'],
        });
    };

    const onSubmit = async (data: LoginForm) => {
        setLoading(true);
        setErrorMessage('');
        const res = await apiLoginAdmin(data);
        if (res.success) {
            localStorage.setItem('ad_token', JSON.stringify(res.data.access_token));
            loginAdmin();
            fireConfetti();
            navigate(PATH.ADMIN_DASHBOARD);
        } else {
            setErrorMessage(res.message || 'Đăng nhập thất bại');
        }
        setLoading(false);
    };

    return (
        <motion.section
            className="relative flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 via-blue-200 to-blue-300 dark:bg-gray-900"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}>
            <motion.div
                className="relative w-full max-w-md p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}>
                <motion.h2 className="mb-4 text-2xl font-bold text-center text-gray-900 dark:text-white">Đăng nhập Admin</motion.h2>
                {errorMessage && <p className="mb-2 text-sm text-red-500">{errorMessage}</p>}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-white">
                            Email
                        </label>
                        <input
                            {...register('email', { required: 'Vui lòng nhập email!' })}
                            type="email"
                            id="email"
                            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                            placeholder="admin@example.com"
                        />
                        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-white">
                            Mật khẩu
                        </label>
                        <input
                            {...register('password', { required: 'Vui lòng nhập mật khẩu!' })}
                            type="password"
                            id="password"
                            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                            placeholder="••••••••"
                        />
                        {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex justify-center w-full p-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none">
                        {loading ? <div className="animate-spin h-5 w-5 border-b-2 border-white"></div> : 'Đăng nhập'}
                    </button>
                </form>
            </motion.div>
        </motion.section>
    );
};

export default AdminLogin;
