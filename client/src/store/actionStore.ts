import { create } from 'zustand';

// Define the state interface
interface ActionState {
    openFeatureAuth: boolean;
    mobile_ui: boolean;
    isLoading: boolean;
    featureAuth: number; // 0 register, 1 login, 2 forgot
    loadDataConversation: boolean;
    searchImage: string;
    isOpenChat: boolean;
    // Action methods
    setOpenFeatureAuth: (value: boolean) => void;
    setIsLoading: (value: boolean) => void;
    setMobileUi: (value: boolean) => void;
    setIsOpenChat: (value: boolean) => void;
    setFeatureAuth: (value: number) => void;
    setSearchImage: (value: string) => void;
}

// Create the Zustand store
export const useActionStore = create<ActionState>((set) => ({
    // Initial state
    openFeatureAuth: false,
    mobile_ui: false,
    isLoading: false,
    featureAuth: 0,
    socketRef: null,
    notifications: [],
    conversations: [],
    isOpenChat: false,
    loadDataConversation: false,
    searchImage: '',
    // Actions
    setOpenFeatureAuth: (value) => set({ openFeatureAuth: value }),
    setIsLoading: (value) => set({ isLoading: value }),
    setMobileUi: (value) => set({ mobile_ui: value }),
    setIsOpenChat: (value) => set({ isOpenChat: value }),
    setFeatureAuth: (value) => set({ featureAuth: value }),
    setSearchImage: (value) => set({ searchImage: value }),
    setLoadDataConversation: () => set((state) => ({ loadDataConversation: !state.loadDataConversation })),
}));
