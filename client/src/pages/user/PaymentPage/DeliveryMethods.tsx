import React from 'react';
import { IShipping } from '../../../interfaces/shipping.interfaces';
import { formatMoney } from '../../../utils/formatMoney';

interface DeliveryMethodsProps {
    shippings: IShipping[];
    selectedMethod: string;
    onMethodChange: (method: string) => void;
}

const DeliveryMethods: React.FC<DeliveryMethodsProps> = ({ shippings, selectedMethod, onMethodChange }) => {
    // Tìm công ty giao hàng được chọn
    const selectedShipping = shippings.find(shipping => shipping._id === selectedMethod);

    return (
        <div className="mb-8 w-full">
            <label htmlFor="delivery-method-select" className="block mb-2 text-gray-900 font-medium">
                Chọn hình thức giao hàng
            </label>
            <select
                id="delivery-method-select"
                value={selectedMethod}
                onChange={(e) => onMethodChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="">Chọn một công ty giao hàng...</option>
                {shippings.map((shipping) => (
                    <option key={shipping._id} value={shipping._id}>
                        {shipping.sc_name} - {formatMoney(shipping.sc_shipping_price)}
                    </option>
                ))}
            </select>

            {/* Hiển thị thông tin chi tiết công ty khi có lựa chọn */}
            {selectedShipping && (
                <div className="mt-6 bg-white p-4 border rounded-md shadow-md">
                    <h3 className="text-xl font-semibold text-gray-800">Thông tin công ty giao hàng</h3>
                    <div className="mt-2">
                        <p><strong>Tên công ty:</strong> {selectedShipping.sc_name}</p>
                        <p><strong>Số điện thoại:</strong> {selectedShipping.sc_phone}</p>
                        <p><strong>Email:</strong> {selectedShipping.sc_email}</p>
                        <p>
                            <strong>Thời gian vận chuyển:</strong> {selectedShipping.sc_delivery_time.from} -{' '}
                            {selectedShipping.sc_delivery_time.to} ngày
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeliveryMethods;
