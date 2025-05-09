/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { IUserDetail } from '../interfaces/user.interfaces';

// Trạng thái & hành động của store
interface UserState {
    user: IUserDetail;
    setUser: (user: IUserDetail) => void;
    setAddRewardPoints: (points?: number) => void;
    setAddBalance: (balance: number) => void;
    setSubtractBalance: (balance: number) => void;
    setSubtractRewardPoints: (points?: number) => void;
    setAddTicket: (tickets?: number) => void;
     setSubtractTicket: (tickets?: number) => void;
    setUserRewardPoints: (points: number) => void;
}

// Hàm lấy user từ localStorage
const getStoredUser = (): IUserDetail => {
    try {
        const stored = localStorage.getItem('user');
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (err) {
        console.error('Lỗi khi parse localStorage:', err);
    }

    return {
        _id: '',
        user_name: '',
        user_email: '',
        user_spin_turns: 0,
        user_reward_points: 0,
        user_balance:0,
        createdAt: '',
    };
};

// Tạo Zustand store
const useUserStore = create<UserState>((set, get) => ({
    user: getStoredUser(),

    setUser: (user) => {
        localStorage.setItem('user', JSON.stringify(user));
        set({ user });
    },

    setAddRewardPoints: (points = 5000) => {
        const { user } = get();
        const updated = {
            ...user,
            user_reward_points: (user.user_reward_points || 0) + points,
        };
        localStorage.setItem('user', JSON.stringify(updated));
        set({ user: updated });
    },
    setAddBalance: (balance:number) => {
        const { user } = get();
        const updated = {
            ...user,
            user_balance: (user.user_balance || 0) + balance,
        };
        localStorage.setItem('user', JSON.stringify(updated));
        set({ user: updated });
    },

    setSubtractBalance: (balance:number) => {
        const { user } = get();
        const updated = {
            ...user,
            user_balance:  user.user_balance > balance?user.user_balance - balance:0,
        };
        localStorage.setItem('user', JSON.stringify(updated));
        set({ user: updated });
    },

    setSubtractRewardPoints: (points = 5000) => {
        const { user } = get();
        const newPoints = Math.max((user.user_reward_points || 0) - points, 0);
        const updated = { ...user, user_reward_points: newPoints };
        localStorage.setItem('user', JSON.stringify(updated));
        set({ user: updated });
    },

    setAddTicket: (tickets = 1) => {
        const { user } = get();
        const updated = {
            ...user,
            user_spin_turns: (user.user_spin_turns || 0) + tickets,
        };
        localStorage.setItem('user', JSON.stringify(updated));
        set({ user: updated });
    },
     setSubtractTicket: (tickets = 1) => {
        const { user } = get();
        const updated = {
            ...user,
            user_spin_turns: (user.user_spin_turns || 0) - tickets,
        };
        localStorage.setItem('user', JSON.stringify(updated));
        set({ user: updated });
    },

    setUserRewardPoints: (points) => {
        const { user } = get();
        const updated = { ...user, user_reward_points: points };
        localStorage.setItem('user', JSON.stringify(updated));
        set({ user: updated });
    },
}));

export default useUserStore;
