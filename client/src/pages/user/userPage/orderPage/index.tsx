/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { IOrder } from '../../../../interfaces/order.interfaces';
import { apiCancelOrder, apiGetAllOrdersByUser, apiReorder } from '../../../../services/order.service';
import { OrderItem, showNotification, TableSkeleton } from '../../../../components';
import NotExit from '../../../../components/common/NotExit';
import { useActionStore } from '../../../../store/actionStore';
import useUserStore from '../../../../store/userStore';

const OrderPage: React.FC = () => {
    const SELL_TAB = [
        { tab: '', title: 'Tất cả' },
        { tab: 'pending', title: 'Chờ xác nhận' },
        { tab: 'confirm', title: 'Vận chuyển' },
        { tab: 'shipped', title: 'Đang giao hàng' },
        { tab: 'delivered', title: 'Thành công' },
        { tab: 'cancelled', title: 'Đã hủy' },
    ];

    const [orders, setOrders] = useState<IOrder[]>([]);
    const [displayTab, setDisplayTab] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const { setIsLoading } = useActionStore();
    const { setAddBalance } = useUserStore();
    // Hàm fetch API đã được khai báo bên ngoài useEffect
    const fetchOrders = async () => {
        setLoading(true);
        const res = await apiGetAllOrdersByUser(displayTab);
        if (res.success) setOrders(res.data);
        setLoading(false);
    };

    useEffect(() => {
        fetchOrders();
    }, [displayTab]);
    const handleBuy = async (id: string) => {
        setIsLoading(true);
        if (confirm('Bạn có muốn mua lại đơn hàng này không?')) {
            const res = await apiReorder(id);
            setOrders((prev) => prev.filter((order) => order._id !== id));
            showNotification(res.message, res.success);
        }
        setIsLoading(false);
    };
    const handleCancelOrder = async (order:IOrder) => {
        setIsLoading(true);
        if (confirm('Bạn có muốn hủy đơn hàng này không?')) {
            const res = await apiCancelOrder(order._id);
            setOrders((prev) => prev.filter((order) => order._id !== order._id));
            showNotification(res.message, res.success);
            if(!res.success)return;
            console.log("sđs",order.order_total_price+order.order_shipping_price-order.order_total_apply_discount)
            setAddBalance(order.order_total_price+order.order_shipping_price-order.order_total_apply_discount)
        }
        setIsLoading(false);
    };

    if (loading) return <TableSkeleton />;

    return (
        <>
            <div className="fixed-mobile w-full dark:border-white/[0.05] dark:bg-white/[0.03] h-full overflow-y-scroll tablet:overflow-y-scroll">
                <div className="py-4 px-4 tablet:px-6 laptop:px-8 bg-white dark:bg-white/[0.03] border-b dark:border-white/[0.05]">
                    <h1 className="text-lg font-semibold text-gray-800 dark:text-white">Đơn hàng của tôi</h1>
                </div>
                <div className="tablet:flex tablet:bg-white laptop:w-full sticky top-0 grid grid-cols-6 dark:border-white/[0.05] dark:bg-white/[0.03] bg-white rounded-sm overflow-hidden">
                    {SELL_TAB.map((e, idx) => (
                        <div
                            key={idx}
                            className={`flex tablet:w-4/12 laptop:w-full justify-center text-sm items-center py-2 border-b-[2px] cursor-pointer
                    ${displayTab === e.tab ? 'text-primary border-primary' : 'text-secondary border-transparent'}`}
                            onClick={() => setDisplayTab(e.tab)}>
                            {e.title}
                        </div>
                    ))}
                </div>
                {orders?.length > 0 ? (
                    <div className="flex flex-col gap-5 w-full  py-5">
                        {orders.map((item) => (
                            <OrderItem
                                key={item._id}
                                order={item}
                                viewDetail
                                view={displayTab === ''}
                                handleBuy={() => handleBuy(item._id)}
                                handleCancelOrder={() => handleCancelOrder(item)}
                            />
                        ))}
                    </div>
                ) : (
                    <NotExit />
                )}
            </div>
        </>
    );
};

export default OrderPage;
