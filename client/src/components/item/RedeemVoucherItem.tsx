/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { formatMoney } from '../../utils/formatMoney';
import { formatDate } from '../../utils/format/formatDate';
import { IVoucher } from '../../interfaces/voucher.interfaces';
import PaidIcon from '@mui/icons-material/Paid';

interface RedeemVoucherItemProps {
    voucher: IVoucher;
    handleRedeemVoucher: (voucher: IVoucher) => void;
    userPoints: number;
    userOwnedVouchers: string[] | any; // thêm vào đây
}

const RedeemVoucherItem: React.FC<RedeemVoucherItemProps> = ({ voucher, handleRedeemVoucher, userPoints, userOwnedVouchers }) => {
    const isExpired = new Date(voucher.voucher_end_date) < new Date();
    const notEnoughPoints = (voucher.voucher_required_points || 0) > userPoints;
    const isOwned = userOwnedVouchers.includes(voucher._id || '');
    const isDisabled = isExpired || notEnoughPoints || isOwned;

    return (
        <div
            className={`relative flex rounded-2xl overflow-hidden border bg-white shadow-sm transition-transform duration-300 ${
                !isExpired ? 'hover:scale-105 hover:shadow-md' : ''
            }`}>
            {/* Left Section */}
            <div className="border-l-4 border-dashed border-green-500 p-2 rounded-l-md">
                <img src={voucher.voucher_thumb} className="w-32 rounded-md" />
            </div>

            {/* Right Section */}
            <div className="flex-1 p-4 flex flex-col justify-between">
                {/* Voucher Info */}
                <div>
                    <h3 className="text-base md:text-lg font-semibold text-gray-800 leading-6">
                        {voucher.voucher_name} - Giảm {formatMoney(voucher.voucher_max_price ?? voucher.voucher_value)}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">Đơn tối thiểu {formatMoney(voucher.voucher_min_order_value)}</p>

                    <p className={`text-sm font-semibold mt-1 ${isExpired ? 'text-red-500' : 'text-green-600'}`}>
                        Hiệu lực đến: {formatDate(voucher.voucher_end_date)}
                    </p>
                </div>

                {/* Redeem Button */}
                <div className="flex justify-end mt-4">
                    <button
                        onClick={() => handleRedeemVoucher(voucher)}
                        disabled={isDisabled}
                        className={`flex items-center justify-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                            isDisabled
                                ? isOwned
                                    ? 'bg-gradient-to-r from-green-400 to-green-600 text-white cursor-not-allowed hover:brightness-105'
                                    : notEnoughPoints
                                    ? 'bg-gradient-to-r from-slate-400 to-gray-500 text-white cursor-not-allowed hover:brightness-105'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-gradient-to-r from-pink-500 to-yellow-500 text-white hover:brightness-110'
                        }`}>
                        <span>{isOwned ? 'Đã sở hữu' : notEnoughPoints ? 'Không đủ điểm' : 'Đổi ngay'}</span>
                        {!isOwned && (
                            <div className="flex items-center gap-1 text-amber-300 font-semibold">
                                {voucher.voucher_required_points?.toLocaleString('vi-VN')}
                                <PaidIcon fontSize="small" />
                            </div>
                        )}
                    </button>
                </div>
            </div>

            {/* Expired or Owned Badge */}
            {isExpired && <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">Hết hạn</span>}
            {isOwned && !isExpired && (
                <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">Đã sở hữu</span>
            )}
        </div>
    );
};

export default RedeemVoucherItem;
