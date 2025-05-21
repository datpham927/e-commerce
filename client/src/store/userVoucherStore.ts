/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { IVoucher } from '../interfaces/voucher.interfaces';

interface UserVoucherState {
    userVouchers: IVoucher[];
    setUserVouchers: (vouchers: IVoucher[]) => void;
    setRemoveUserVoucherById: (voucherId: string) => void;
}

const LOCAL_STORAGE_KEY = 'userVouchers';

const loadUserVoucherFromStorage = (): IVoucher[] => {
    try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Error loading purchased vouchers from localStorage:', error);
        return [];
    }
};

const saveToLocalStorage = (vouchers: IVoucher[]) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(vouchers));
};

const useUserVoucherStore = create<UserVoucherState>((set) => ({
    userVouchers: loadUserVoucherFromStorage(),

    setUserVouchers: (vouchers) => {
        saveToLocalStorage(vouchers);
        set({ userVouchers: vouchers });
    },
    setRemoveUserVoucherById: (voucherId: string) => {
        set((state) => {
            const newVouchers = state.userVouchers.filter((e) => e._id !== voucherId);
            saveToLocalStorage(newVouchers);
            return { userVouchers: newVouchers };
        });
    },
}));

export default useUserVoucherStore;
