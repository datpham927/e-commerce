export interface IUserProfile {
    _id: string;
    user_name: string;
    user_email: string;
    user_password?: string;
    user_address?: {
        village: string;
        district: string;
        city: string;
        detail: string;
    };
    user_mobile?: string;
    user_avatar_url?: string;
    user_isBlocked?: boolean;
}
export interface IUserDetail extends IUserProfile {
    user_reward_points: number;
    user_spin_turns: number;
    user_passwordChangedAt?: Date;
    createdAt: string;
    user_balance: number;
}
