import React from 'react';
import { PAYMENT_METHOD } from '../../../utils/const';
import { formatMoney } from '../../../utils/formatMoney';
import useUserStore from '../../../store/userStore';

interface OrderSummaryProps {
    totalProductPrice: number;
    shippingFee: number;
    voucherDiscount: number;
    totalPayment: number;
    selectedPaymentMethod: string;
    deliveryMethod: string;
    paymentMethod: string;
    onPlaceOrder: () => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
    totalProductPrice,
    shippingFee,
    voucherDiscount,
    totalPayment,
    selectedPaymentMethod,
    deliveryMethod,
    paymentMethod,
    onPlaceOrder,
}) => {
    const { user } = useUserStore();

    const coinUsed = selectedPaymentMethod === "COIN" ? Math.min(user?.user_balance || 0, totalPayment) : 0;
    const finalPayment = selectedPaymentMethod === "COIN" ? Math.max(totalPayment - coinUsed, 0) : totalPayment;

    return (
        <div className="w-full mx-auto bg-white border rounded-md shadow-sm text-sm">
            <div className="px-4 py-4 border-b">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-800 font-medium">Phương thức thanh toán</span>
                </div>
                {selectedPaymentMethod !== "COIN" ? (
                    <span className="text-gray-800">
                        {PAYMENT_METHOD.method.find((m) => m.code === selectedPaymentMethod)?.label || 'Chưa chọn'}
                    </span>
                ) : (
                    <div className="flex items-center space-x-4 border p-4 rounded-md shadow-sm">
                        <img
                            src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/paymentfe/cb78f1ca161d1694.png"
                            alt="Coin"
                            className="w-12 h-12 rounded-full"
                        />
                        <div className="flex flex-col">
                            <span className="text-gray-700 font-medium">Số dư trong ví</span>
                            <span className="text-gray-600 text-sm">{formatMoney(user.user_balance)}</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="px-4 py-4 bg-[#fefdf9] border-b">
                <div className="flex justify-between mb-2">
                    <span>Tổng tiền hàng</span>
                    <span className="text-gray-800">{formatMoney(totalProductPrice)}</span>
                </div>
                <div className="flex justify-between mb-2">
                    <span>Tổng tiền phí vận chuyển</span>
                    <span className="text-gray-800">{formatMoney(shippingFee)}</span>
                </div>
                {voucherDiscount > 0 && (
                    <div className="flex justify-between mb-2">
                        <span>Giảm giá voucher</span>
                        <span className="text-gray-800">-{formatMoney(voucherDiscount)}</span>
                    </div>
                )}
                {selectedPaymentMethod === "COIN" && coinUsed > 0 && (
                    <div className="flex justify-between mb-2 text-gray-700">
                        <span>Trừ từ số dư</span>
                        <span className="text-green-600">- {formatMoney(coinUsed)}</span>
                    </div>
                )}
                <div className="flex justify-between font-semibold text-lg text-red-600">
                    <span>Tổng thanh toán</span>
                    <span>{formatMoney(finalPayment)}</span>
                </div>
            </div>

            <div className="flex justify-end p-4">
                <button
                    onClick={onPlaceOrder}
                    className="bg-[#ee4d2d] text-white px-6 py-2 rounded hover:opacity-90 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    disabled={!deliveryMethod || !paymentMethod}
                >
                    Đặt hàng
                </button>
            </div>
        </div>
    );
};

export default OrderSummary;
