/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useNavigate } from 'react-router';
import { formatMoney } from '../../utils/formatMoney';
import { statusOrder } from '../../utils/statusOrder';
import { formatShippingDate } from '../../utils/format/formatShippingDate';
import { IOrder } from '../../interfaces/order.interfaces';
import { IUserProfile } from '../../interfaces/user.interfaces';
import useUserStore from '../../store/userStore';
import ButtonOutline from '../buttonOutline';
import FormEditAddress from '../form/FormEditAddress';

interface OrderItemProps {
    order: IOrder;
    view?: boolean;
    isUpdateAddress?: boolean;
    viewDetail?: boolean;
    handleCancelOrder?: (orderId: string) => void;
    handleBuyBack?: (orderId: string) => void;
}

const OrderItem: React.FC<OrderItemProps> = ({ order, view = false, isUpdateAddress = false, viewDetail = false, handleCancelOrder, handleBuyBack }) => {
    const { user } = useUserStore();
    const [payload, setPayload] = useState<IUserProfile>(user);
    const [isOpenEditAddress, setIsOpenEditAddress] = useState(false);
    const navigate = useNavigate();
    const shippingFrom = formatShippingDate(order?.order_date_shipping?.from || 0);
    const shippingTo = formatShippingDate(order?.order_date_shipping?.to || 0);
    const status = statusOrder(order);
    // Địa chỉ đang sử dụng (nếu người dùng đã chỉnh sửa, dùng địa chỉ mới)
    const currentAddress = payload.user_address?.detail
        ? {
              detailAddress: payload.user_address.detail,
              city: payload.user_address.city,
              district: payload.user_address.district,
          }
        : order.order_shipping_address;

    return (
        <div className="flex flex-col py-4 px-5 bg-white rounded-md shadow-sm overflow-hidden">
            {/* Trạng thái đơn hàng và thời gian giao hàng */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1">
                    <AccessTimeIcon style={{ fontSize: 15, color: 'rgb(0, 136, 72)' }} />
                    <p className="text-sm text-gray-600">
                        Giao hàng dự kiến từ&nbsp;
                        <span className="font-medium text-primary">{shippingFrom}</span>
                        &nbsp;đến&nbsp;
                        <span className="font-medium text-primary">{shippingTo}</span>
                    </p>
                </div>
                <div className="flex items-center gap-1">
                    {status?.icon}
                    <p className="text-sm font-medium text-gray-700">{status?.title}</p>
                </div>
            </div>

            {/* Danh sách sản phẩm */}
            <div className="my-6">
                {order?.order_products?.map((product, index) => {
                    const discountedPrice = product.price * (1 - product.discount / 100);
                    return (
                        <div key={`${product.productId?._id}-${index}`} className="flex w-full border-b border-gray-100 py-3 px-4">
                            <div className="w-[70px] h-[70px] mr-3 p-1 border border-gray-200 rounded-md overflow-hidden">
                                <img className="w-full h-full object-cover" src={product?.productId?.product_thumb} alt={product?.productId?.product_name} />
                            </div>
                            <div className="flex-1 flex flex-col gap-1 truncate">
                                <h2 className="text-sm font-medium text-gray-800">{product?.productId?.product_name}</h2>
                                <p className="text-sm text-gray-500">Giao đến: {currentAddress.detailAddress}</p>
                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                    <CloseIcon style={{ fontSize: 12, color: '#808089' }} />
                                    <span>{product?.quantity}</span>
                                </div>
                                <div className="text-sm text-gray-500">{formatMoney(discountedPrice)}</div>
                            </div>
                            <div className="hidden tablet:flex justify-end flex-1 text-primary font-semibold">{formatMoney(product?.price)}</div>
                        </div>
                    );
                })}
            </div>

            {/* Thông tin thanh toán */}
            <div className="flex flex-col gap-2 w-full">
                <div className="flex justify-end text-sm text-gray-600">
                    Phí vận chuyển:
                    <span className="text-red-500 font-semibold ml-2">{formatMoney(Number(order.order_shipping_price))}</span>
                </div>
                <div className="flex justify-end text-sm text-gray-600">
                    Số tiền còn lại (thanh toán khi nhận hàng):
                    <span className="text-red-500 font-semibold ml-2">{formatMoney(order.order_amount_due-order.order_amount_paid)}</span>
                </div>
            </div>

            {/* Hành động: Hủy / Mua lại / Xem chi tiết / Cập nhật địa chỉ */}
            <div className="flex justify-end mt-3 gap-2">
                {isUpdateAddress && <ButtonOutline onClick={() => setIsOpenEditAddress(true)}>Cập nhật địa chỉ</ButtonOutline>}
                {!view && order?.order_status !== 'delivered' && (
                    <>
                        {order?.order_status === 'cancelled' ? (
                            <ButtonOutline onClick={() => handleBuyBack?.(order._id)}>Mua lại</ButtonOutline>
                        ) : (
                            order?.order_status === 'pending' && <ButtonOutline onClick={() => handleCancelOrder?.(order._id)}>Hủy đơn</ButtonOutline>
                        )}
                    </>
                )}
                {viewDetail && <ButtonOutline onClick={() => navigate(`/nguoi-dung/chi-tiet-don-hang/${order?._id}`)}>Xem chi tiết</ButtonOutline>}
            </div>

            {/* Modal cập nhật địa chỉ */}
            {!view && isOpenEditAddress && <FormEditAddress payload={payload} isEdit={true} setPayload={setPayload} setIsOpen={setIsOpenEditAddress} />}
        </div>
    );
};

export default OrderItem;
