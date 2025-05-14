import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { IOrder } from '../../../interfaces/order.interfaces';
import { getOrder } from '../../../services/order.service';
import { OrderItem, SkeletonViewOrder } from '../../../components';
import { statusOrder } from '../../../utils/statusOrder';
import { formatShippingDate } from '../../../utils/format/formatShippingDate';
import { formatMoney } from '../../../utils/formatMoney';
import { PATH } from '../../../utils/const';

const OrderDetail: React.FC = () => {
    const param = useParams();
    const [order, setOrder] = useState<IOrder>();

    useEffect(() => {
        const fetchApiDetailOrder = async () => {
            const res = await getOrder(param?.oid);
            if (res.success) setOrder(res?.data);
        };
        fetchApiDetailOrder();
    }, [param.oid]);

    if (!order) return <SkeletonViewOrder />;

    // Tính toán số tiền còn lại cần trả
    const amountDueRemaining = order.order_amount_due;

    return (
        <div className="w-full p-4 max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-secondary">
                    Chi tiết đơn hàng <span className="uppercase text-primary">#{order.order_code}</span>
                </h1>
                <p className="text-sm mt-1">
                    Trạng thái: <span className="text-primary font-medium">{statusOrder(order)?.title}</span>
                </p>
                <p className="text-sm text-gray-600">Ngày đặt hàng: {formatShippingDate(order.createdAt)}</p>
            </div>

            {/* Info Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Địa chỉ người nhận */}
                <div className="bg-white shadow rounded-xl p-4">
                    <h2 className="text-sm font-semibold text-secondary mb-2 uppercase">Địa chỉ người nhận</h2>
                    <p className="text-base font-medium">{order.order_shipping_address.fullName}</p>
                    <p className="text-sm text-gray-600 mt-1">
                        Địa chỉ: <span className="text-primary">{order.order_shipping_address.detailAddress}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                        Điện thoại: <span className="text-primary">{order.order_shipping_address.phone}</span>
                    </p>
                </div>

                {/* Hình thức giao hàng */}
                <div className="bg-white shadow rounded-xl p-4">
                    <h2 className="text-sm font-semibold text-secondary mb-2 uppercase">Hình thức giao hàng</h2>
                    <p className="text-sm text-gray-600">
                        Giao hàng từ: <span className="text-primary">{formatShippingDate(order.order_date_shipping.from)}</span> đến{' '}
                        <span className="text-primary">{formatShippingDate(order.order_date_shipping.to)}</span>
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                        Phí vận chuyển: <span className="text-red-500 font-semibold">{formatMoney(Number(order.order_shipping_price))}</span>
                    </p>
                </div>

                {/* Hình thức thanh toán */}
                <div className="bg-white shadow rounded-xl p-4">
                    <h2 className="text-sm font-semibold text-secondary mb-2 uppercase">Hình thức thanh toán</h2>
                    <p className="text-sm text-gray-600">
                        Phương thức: <span className="text-primary">{order.order_payment_method}</span>
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                        Số tiền cần trả: <span className="text-primary font-semibold">{formatMoney(order.order_amount_due)}</span>
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                        Số tiền đã trả: <span className="text-green-500 font-semibold">{formatMoney(order.order_amount_paid)}</span>
                    </p>
                    {amountDueRemaining > 0 && (
                        <p className="text-sm text-gray-600 mt-1">
                            Số tiền còn lại (trả bằng tiền mặt): <span className="text-red-500 font-semibold">{formatMoney(amountDueRemaining)}</span>
                        </p>
                    )}
                </div>
            </div>

            {/* Sản phẩm */}
            <div className="mt-8">
                <OrderItem order={order} view={true} />
            </div>

            {/* Back link */}
            <div className="mt-6">
                <Link className="text-sm text-primary hover:underline flex items-center gap-1" to={PATH.MANAGE_ORDER}>
                    <span>«</span> Quay lại danh sách đơn hàng
                </Link>
            </div>
        </div>
    );
};

export default OrderDetail;
