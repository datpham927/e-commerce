import React from 'react';
import { IShipping } from '../../../interfaces/shipping.interfaces';
import { formatMoney } from '../../../utils/formatMoney';

interface DeliveryMethodsProps {
    shippings: IShipping[];
    selectedMethod: string;
    onMethodChange: (method: string) => void;
}

const DeliveryMethods: React.FC<DeliveryMethodsProps> = ({ shippings, selectedMethod, onMethodChange }) => {
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
                        {shipping.sc_name} - {formatMoney(shipping.sc_shipping_price)} - {shipping.sc_delivery_time.from} - {shipping.sc_delivery_time.to} ngày
                    </option>
                ))}
            </select>
        </div>
    );
};

export default DeliveryMethods;
