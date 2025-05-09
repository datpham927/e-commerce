/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { formatMoney } from '../../utils/formatMoney';
import { statusOrder } from '../../utils/statusOrder';
import { IOrder } from '../../interfaces/order.interfaces';
import { formatShippingDate } from '../../utils/format/formatShippingDate';
import ButtonOutline from '../buttonOutline';
import { useNavigate } from 'react-router';

interface OrderItemProps {
    order: IOrder;
    view?: boolean;
    viewDetail?: boolean;
    handleCancelOrder?: (orderId: string) => void;
    handleBuy?: (orderId: string) => void;
}

const OrderItem: React.FC<OrderItemProps> = ({ order, viewDetail = false, view = false, handleCancelOrder, handleBuy }) => {
    const shippingFrom = formatShippingDate(order?.order_date_shipping?.from || 0);
    const shippingTo = formatShippingDate(order?.order_date_shipping?.to || 0);
    const status = statusOrder(order);
    const navigate = useNavigate();
    return (
        <div className="flex flex-col py-3 px-4 bg-white rounded-md overflow-hidden">
            {/* Trạng thái và ngày giao hàng */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1">
                    <AccessTimeIcon style={{ fontSize: 15, color: 'rgb(0, 136, 72)' }} />
                    <p className="text-sm text-gray-600">
                        Ngày giao hàng dự kiến:
                        <span className="font-medium text-primary mx-1">{shippingFrom}</span>
                        đến
                        <span className="font-medium text-primary mx-1">{shippingTo}</span>
                    </p>
                </div>
                <div className="flex items-center gap-1">
                    {status?.icon}
                    <p className="text-sm">{status?.title}</p>
                </div>
            </div>

            {/* Danh sách sản phẩm */}
            <div className="my-6">
                {order?.order_products?.map((product, index) => (
                    <div key={`${product.productId?._id}-${index}`} className="flex w-full border-b border-bgSecondary py-3 px-4">
                        <div className="w-[70px] h-[70px] mr-3 p-1 border border-bgSecondary rounded-md overflow-hidden">
                            <img className="w-full h-full object-cover" src={product?.productId?.product_thumb} alt={product?.productId?.product_name} />
                        </div>
                        <div className="flex-1 flex flex-col gap-1 truncate">
                            <h2 className="text-sm">{product?.productId?.product_name}</h2>
                            <p className="text-sm text-secondary">Giao đến: {order?.order_shipping_address?.detailAddress}</p>
                            <div className="flex items-center gap-1 text-sm text-secondary">
                                <CloseIcon style={{ fontSize: 12, color: 'rgb(128, 128, 137)' }} />
                                <span>{product?.quantity}</span>
                            </div>
                        </div>
                        <div className="hidden tablet:flex justify-end flex-1 text-primary">{formatMoney(product?.price)}</div>
                    </div>
                ))}
            </div>

            {/* Tổng tiền và phí vận chuyển */}
            <div className="flex flex-col gap-2 w-full">
                <div className="flex justify-end text-xl text-secondary gap-1">
                    Tổng tiền:
                    <span className="text-red_custom text-end min-w-[100px]">{formatMoney(order?.order_total_price+order.order_shipping_price-order.order_total_apply_discount)}</span>
                </div>
            </div>

            <div className="flex justify-end mt-2 gap-2">
  {!view && order?.order_status !== 'delivered' && (
    <>
      {order?.order_status === 'cancelled' ? (
        <ButtonOutline onClick={() => handleBuy?.(order?._id)}>Mua lại đơn hàng</ButtonOutline>
      ) : (
        order?.order_status === 'pending' && (
          <ButtonOutline onClick={() => handleCancelOrder?.(order?._id)}>Hủy đơn hàng</ButtonOutline>
        )
      )}
    </>
  )}
  {viewDetail && <ButtonOutline onClick={() => navigate(`/nguoi-dung/chi-tiet-don-hang/${order?._id}`)}>Xem chi tiết</ButtonOutline>}
</div>

        </div>
    );
};

export default OrderItem;
