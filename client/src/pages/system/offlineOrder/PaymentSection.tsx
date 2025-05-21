import React from 'react';
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';
import { formatMoney } from '../../../utils/formatMoney';

interface PaymentSectionProps {
    paymentMethod: string;
    setPaymentMethod: (method: string) => void;
    discountCode: string;
    setDiscountCode: (code: string) => void;
    appliedDiscount: number;
    cashReceived: number | '';
    setCashReceived: (amount: number | '') => void;
    handleApplyDiscountCode: () => void;
    calculateSubtotal: number;
    calculateDiscountFromProducts: number;
    calculateTotal: number;
    calculateChange: number;
    handleConfirmPayment: () => void;
}

export const PaymentSection: React.FC<PaymentSectionProps> = ({
    paymentMethod,
    setPaymentMethod,
    discountCode,
    setDiscountCode,
    appliedDiscount,
    cashReceived,
    setCashReceived,
    handleApplyDiscountCode,
    calculateSubtotal,
    calculateDiscountFromProducts,
    calculateTotal,
    calculateChange,
    handleConfirmPayment,
}) => {
    if (calculateSubtotal === 0) return null;

    return (
        <div className="mt-6 p-6 rounded-xl bg-white shadow-md">
            <h2 className="text-xl font-semibold mb-4">Thông tin thanh toán</h2>
            <div className="space-y-6">
                <div>
                    <FormControl component="fieldset">
                        <FormLabel component="legend" className="text-gray-600">
                            Phương thức thanh toán:
                        </FormLabel>
                        <RadioGroup
                            row
                            value={paymentMethod}
                            onChange={(e) => {
                                setPaymentMethod(e.target.value);
                                setCashReceived('');
                            }}>
                            <FormControlLabel value="ONLINE" control={<Radio />} label="Chuyển khoản" />
                            <FormControlLabel value="CASH" control={<Radio />} label="Tiền mặt" />
                        </RadioGroup>
                    </FormControl>
                    {paymentMethod === 'CASH' && (
                        <div className="mt-2 flex gap-2">
                            <input
                                type="number"
                                value={cashReceived}
                                onChange={(e) => setCashReceived(e.target.value === '' ? '' : Number(e.target.value))}
                                placeholder="Nhập số tiền người đưa"
                                className="border rounded-lg p-2 w-full max-w-xs"
                            />
                            <span className="self-center text-gray-600">VND</span>
                        </div>
                    )}
                </div>
                <div className="mt-2 flex gap-2">
                    <input
                        type="text"
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value)}
                        placeholder="Nhập mã giảm giá"
                        className="border rounded-lg p-2 w-full max-w-xs"
                    />
                    <button onClick={handleApplyDiscountCode} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition">
                        Áp dụng
                    </button>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Giá gốc:</span>
                    <span className="font-semibold">{formatMoney(calculateSubtotal)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Giảm giá:</span>
                    <span className="font-semibold">-{formatMoney(calculateDiscountFromProducts)}</span>
                </div>
                {appliedDiscount > 0 && (
                    <div className="flex justify-between">
                        <span className="text-gray-600">Voucher</span>
                        <span className="font-semibold">-{formatMoney(appliedDiscount)}</span>
                    </div>
                )}
                <div className="flex justify-between text-lg font-bold">
                    <span>Thanh toán:</span>
                    <span>{formatMoney(calculateTotal)}</span>
                </div>

                {paymentMethod === 'CASH' && cashReceived !== '' && (
                    <div className="flex justify-between text-lg">
                        <span className="text-gray-600">Số dư trả lại:</span>
                        <span className="font-semibold text-green-600">{formatMoney(calculateChange)}</span>
                    </div>
                )}
                <div className="flex justify-end">
                    <button onClick={handleConfirmPayment} className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition">
                        Xác nhận thanh toán
                    </button>
                </div>
            </div>
        </div>
    );
};
