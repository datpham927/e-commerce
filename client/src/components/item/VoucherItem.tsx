/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { formatMoney } from '../../utils/formatMoney';
import { formatDate } from '../../utils/format/formatDate';
import { IVoucher } from '../../interfaces/voucher.interfaces';

// Định nghĩa kiểu cho props của component VoucherItem
interface VoucherProps {
    voucher: IVoucher;
    onSave?: (voucher: IVoucher) => void;
    userOwnedVouchers: string[] | any;
}

const VoucherItem: React.FC<VoucherProps> = ({ voucher, onSave, userOwnedVouchers }) => {
    const isOwned = userOwnedVouchers.includes(voucher._id || '');

    // Hàm xử lý sự kiện click nút "Đổi"
    const handleSave = () => {
        if (onSave && !isOwned) {
            onSave(voucher);
        }
    };
    // Tính giá trị giảm giá tối đa
    return (
        <div className="flex items-stretch border border-gray-200 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow duration-200 w-full max-w-md mx-auto min-h-24">
            {/* Phần bên trái: Logo và danh mục */}
            <div className="border-l-4 border-dashed border-green-500 p-2 rounded-l-md">
                <img src={voucher.voucher_thumb} className="w-20 rounded-sm" />
            </div>

            {/* Phần giữa: Thông tin voucher */}
            <div className="flex-1 p-3 w-1/2 flex flex-col justify-center">
                <span className="block text-base font-bold text-gray-800">
                    {voucher.voucher_name} - Giảm
                    {voucher.voucher_method == 'fixed'
                        ? ` ${formatMoney(voucher.voucher_value)}`
                        : ` ${voucher.voucher_value} % tối đa ${formatMoney(voucher.voucher_max_price)}`}
                </span>
                <span className="block text-xs text-gray-600 mt-1">Đơn tối thiểu {formatMoney(voucher.voucher_min_order_value ?? 0)}</span>
                <span className="block text-xs text-gray-600 mt-1">Có hiệu lực đến {formatDate(voucher.voucher_end_date ?? 0)}</span>
            </div>

            {/* Phần bên phải: Nút hành động */}
            <div className="p-3 w-1/4 flex items-center justify-center">
                <button
                    type="button"
                    onClick={handleSave}
                    disabled={isOwned}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 whitespace-nowrap ${
                        isOwned
                            ? 'bg-gradient-to-r from-slate-400 to-gray-500 text-white cursor-not-allowed hover:brightness-105'
                            : 'bg-gradient-to-r from-pink-500 to-yellow-500 text-white hover:brightness-110'
                    }`}>
                    <span>{isOwned ? 'Đã sở hữu' : 'Lưu ngay'}</span>
                </button>
            </div>
        </div>
    );
};

export default VoucherItem;
