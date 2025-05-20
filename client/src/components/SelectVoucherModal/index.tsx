import React, { useMemo, useState } from 'react';
import Overlay from '../common/Overlay';
import useUserVoucherStore from '../../store/userVoucherStore';
import { formatMoney } from '../../utils/formatMoney';
import { IVoucher } from '../../interfaces/voucher.interfaces';
import { calculateVoucherStatus } from '../../utils/calculateVoucherStatus';
import { showNotification } from '../common/showNotification';
import { getVoucherByCode } from '../../services/voucher.service';
import { useCartStore } from '../../store/cartStore';

interface SelectVoucherModalProps {
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setVoucher: (voucher: IVoucher) => void;
}

const SelectVoucherModal: React.FC<SelectVoucherModalProps> = ({ setIsOpen, setVoucher }) => {
    const { userVouchers } = useUserVoucherStore();
    const [selectedVoucher, setSelectedVoucher] = useState<IVoucher>();
    const [discountCode, setDiscountCode] = useState<string>('');
    const { selectedProducts } = useCartStore();

    const priceMemo = useMemo(() => {
        const result = selectedProducts.reduce((total, e) => {
            return total + e.product_discounted_price * e.quantity;
        }, 0);
        return result;
    }, [selectedProducts]);
    const handleClose = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen?.(false);
    };

    const handleApply = async () => {
        if (selectedVoucher) {
            showNotification('Bạn đã chọn voucher');
            return;
        }

        if (!discountCode) {
            showNotification('Vui lòng nhập mã giảm giá!', false);
            return;
        }

        const res = await getVoucherByCode(discountCode);

        if (!res?.success) {
            showNotification(res?.message || 'Không tìm thấy voucher', false);
            return;
        }

        const voucher: IVoucher = res.data;
        const now = new Date();
        const expiryDate = new Date(voucher.voucher_end_date);

        if (expiryDate < now) {
            showNotification('Voucher đã hết hạn, vui lòng chọn mã khác!', false);
            return;
        }
        if (priceMemo < voucher.voucher_min_order_value) {
            showNotification(`Đơn hàng chưa đạt ${formatMoney(voucher.voucher_min_order_value)} để áp dụng voucher này!`, false);
            return;
        }

        showNotification(res.message, true);
        setVoucher(voucher);
        setIsOpen?.(false);
    };

    const handleSelectVoucher = (voucher: IVoucher) => {
        setSelectedVoucher(voucher);
    };

    const handleConfirm = () => {
        if (selectedVoucher) {
            setVoucher(selectedVoucher);
            setIsOpen?.(false);
        }
    };

    return (
        <Overlay className="z-[1000]" onClick={handleClose}>
            <div className="bg-white max-h-[550px] w-full max-w-2xl mx-auto p-6 rounded-lg shadow-md overflow-hidden" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-xl font-bold text-center text-gray-800 mb-6">Chọn Voucher</h2>

                {/* Ô nhập mã voucher */}
                <div className="flex mb-6">
                    <input
                        type="text"
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value)}
                        placeholder="Nhập mã voucher của Shop"
                        className="flex-1 p-3 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <button onClick={handleApply} className="px-4 bg-gray-200 text-gray-700 rounded-r-md hover:bg-gray-300 transition">
                        Áp dụng
                    </button>
                </div>

                {/* Danh sách voucher */}
                <div className="space-y-4 max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                    {userVouchers.map((voucher: IVoucher) => {
                        const isVoucherValid = priceMemo > voucher.voucher_min_order_value;
                        const isVoucherExpired = new Date(voucher.voucher_end_date) < new Date();

                        const isDisabled = !isVoucherValid || isVoucherExpired;

                        return (
                            <div
                                key={voucher._id}
                                className={`flex justify-between items-center p-4 border border-gray-200 rounded-md hover:shadow-md transition ${
                                    isDisabled ? 'opacity-50 cursor-not-allowed' : ''
                                }`}>
                                <div className="flex items-start gap-4">
                                    <div className="border-l-4 border-green-500 pl-3">
                                        <img src={voucher.voucher_thumb} alt="Voucher" className="w-20 h-20 object-cover rounded" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-base font-semibold">
                                            {voucher.voucher_name}
                                            <span className="block text-sm text-red-500">Đơn tối thiểu {formatMoney(voucher.voucher_min_order_value)}</span>
                                        </p>
                                        {voucher.voucher_description && <p className="text-sm text-gray-600">{voucher.voucher_description}</p>}
                                        <p className="text-xs text-gray-500">{calculateVoucherStatus(voucher)}</p>

                                        {!isVoucherValid && <p className="text-xs text-red-500">Đơn hàng chưa đạt giá trị tối thiểu</p>}
                                        {isVoucherExpired && <p className="text-xs text-red-500">Voucher đã hết hạn</p>}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">x1</span>
                                    <label className="relative flex items-center">
                                        <input
                                            type="radio"
                                            name="voucher-selection"
                                            value={voucher._id}
                                            checked={selectedVoucher?._id === voucher._id}
                                            onChange={() => !isDisabled && handleSelectVoucher(voucher)}
                                            disabled={isDisabled}
                                            className={`appearance-none w-6 h-6 border-2 border-gray-300 rounded-full focus:outline-none ${
                                                !isDisabled ? 'checked:border-red-500 checked:bg-red-500' : 'cursor-not-allowed'
                                            }`}
                                        />
                                        {selectedVoucher?._id === voucher._id && (
                                            <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-sm font-bold">
                                                ✔
                                            </span>
                                        )}
                                    </label>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Nút xác nhận */}
                <div className="flex justify-end gap-4 mt-6">
                    <button onClick={handleClose} className="px-6 py-2 border border-gray-300 rounded text-gray-800 hover:bg-gray-100 transition">
                        Trở lại
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={!selectedVoucher}
                        className={`px-6 py-2 rounded text-white transition ${
                            selectedVoucher ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-300 cursor-not-allowed'
                        }`}>
                        OK
                    </button>
                </div>
            </div>
        </Overlay>
    );
};

export default SelectVoucherModal;
