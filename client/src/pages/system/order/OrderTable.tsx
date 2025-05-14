/* eslint-disable @typescript-eslint/no-explicit-any */
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../../../components/ui/table';
import { IOrder } from '../../../interfaces/order.interfaces';
import { formatMoney } from '../../../utils/formatMoney';
import { Link } from 'react-router';
import { statusOrder } from '../../../utils/statusOrder';

interface OrderListProps {
    orders: IOrder[];
    onChangeStatus: (id: string | any) => void;
    tab: string;
}

const OrderTable: React.FC<OrderListProps> = ({ orders, tab, onChangeStatus }) => {
    return (
        <div className="overflow-hidden rounded-xl my-4 border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
                <Table>
                    {/* Table Header */}
                    <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                        <TableRow>
                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-sm dark:text-gray-400">
                                STT
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-sm dark:text-gray-400">
                                Mã đơn hàng
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-center w-[110px] text-gray-500 text-sm dark:text-gray-400">
                                Trạng thái
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium w-[300px] text-gray-500 text-center text-sm dark:text-gray-400">
                                Tên hàng/Số lượng
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-center text-gray-500 text-sm dark:text-gray-400">
                                Khách hàng phải trả
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium min-w-[110px] text-center text-gray-500 text-sm dark:text-gray-400">
                                Thao tác
                            </TableCell>
                        </TableRow>
                    </TableHeader>

                    {/* Table Body */}
                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                        {orders?.map((order, index) => (
                            <TableRow key={order?._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                <TableCell className="px-5 text-gray-70 dark:text-gray-300">
                                    <span className="truncate-trailing text-[rgb(128,128,137)] line-clamp-2 text-theme-sm dark:text-white/90">{index + 1}</span>
                                </TableCell>
                                <TableCell className="px-5 py-3">
                                    <span className="truncate-trailing text-[rgb(128,128,137)] line-clamp-1 text-theme-sm dark:text-white/90">
                                        #{order?.order_code}
                                    </span>
                                </TableCell>
                                <TableCell className="px-5 py-3 text-center dark:text-gray-300">
                                    <span className="truncate-trailing text-[rgb(128,128,137)] line-clamp-2 text-theme-sm dark:text-white/90">
                                        {statusOrder(order).title}
                                    </span>
                                </TableCell>
                                <TableCell className="px-5 py-3 dark:text-gray-300">
                                    <div className="truncate-trailing text-[rgb(128,128,137)] line-clamp-3 text-theme-sm dark:text-white/90 space-y-1">
                                        {order?.order_products?.length > 0 ? (
                                            order.order_products.map((p) => (
                                                <p key={p._id}>
                                                    {p.productId?.product_name || 'Tên sản phẩm không có'} <span className="text-red-500">x{p.quantity}</span>
                                                </p>
                                            ))
                                        ) : (
                                            <p className="italic text-gray-400">Không có sản phẩm</p>
                                        )}
                                    </div>
                                </TableCell>

                                <TableCell className="px-5 py-3 text-center dark:text-gray-300">
                                    <span className="truncate-trailing text-[rgb(128,128,137)] line-clamp-1 text-theme-sm dark:text-white/90">
                                        {order.order_payment_method == 'VNPAY' ? 'Đã thanh toán' : formatMoney(order.order_amount_due)}
                                    </span>
                                </TableCell>
                                <TableCell className="text-center space-y-1">
                                    {['pending', 'confirm', 'shipped']?.includes(tab) && (
                                        <p className="text-[13px] text-primary underline cursor-pointer" onClick={() => onChangeStatus(order._id)}>
                                            Xác nhận
                                        </p>
                                    )}
                                    <Link to={`/quan-ly/don-hang-chi-tiet/${order._id}`} className="text-[13px] text-primary underline cursor-pointer block">
                                        Xem chi tiết
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default OrderTable;
