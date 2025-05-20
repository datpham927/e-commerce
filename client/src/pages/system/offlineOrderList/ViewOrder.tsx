import React from 'react';
import { IOrder } from '../../../interfaces/order.interfaces';
import { formatMoney } from '../../../utils/formatMoney';
import { logo } from '../../../assets';
import { Modal } from '../../../components/ui/modal';

// Định nghĩa interface cho props của ViewOrder
interface ViewOrderProps {
    order: IOrder;
    isOpen: boolean;
    closeModal: () => void;
}

// Component hiển thị chi tiết hóa đơn
export const ViewOrder: React.FC<ViewOrderProps> = ({ order, isOpen, closeModal }) => {
    // Hàm render thông tin header của hóa đơn
    const renderHeader = () => (
        <div className="text-center mb-6">
            <img src={logo} alt="logo" className="w-20 mx-auto mb-3" />
            <h2 className="text-2xl font-bold uppercase text-gray-800">Bánh Hóa Xanh</h2>
            <p className="text-sm text-gray-600">Địa chỉ: Ngũ Hành Sơn, Đà Nẵng</p>
            <p className="text-sm text-gray-600">Nhân viên: {order?.order_staff?.admin_name || 'Không xác định'}</p>
            <p className="text-sm text-gray-600">Số điện thoại: {order?.order_staff?.admin_mobile || 'Không có'}</p>
            <p className="text-sm text-gray-600">Thời gian tạo: {new Date(order.createdAt).toLocaleString()}</p>
        </div>
    );

    // Hàm render thông tin thanh toán
    const renderPaymentInfo = () => (
        <div className="mb-6 space-y-2">
            <p className="text-sm text-gray-700">
                <span className="font-semibold text-gray-900">Thanh toán:</span> {order.order_payment_method === 'CASH' ? 'Tiền mặt' : 'Chuyển khoản'}
            </p>
            <p className="text-sm text-gray-700">
                <span className="font-semibold text-gray-900">Voucher đã áp dụng:</span> Không sử dụng
            </p>
        </div>
    );

    // Hàm render danh sách sản phẩm
    const renderProductList = () => (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm text-gray-700">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="border border-gray-200 px-4 py-2 text-left font-semibold text-gray-800">Tên sản phẩm</th>
                        <th className="border border-gray-200 px-4 py-2 text-left font-semibold text-gray-800">Giá gốc</th>
                        <th className="border border-gray-200 px-4 py-2 text-left font-semibold text-gray-800">Số lượng</th>
                        <th className="border border-gray-200 px-4 py-2 text-left font-semibold text-gray-800">Giảm giá</th>
                        <th className="border border-gray-200 px-4 py-2 text-left font-semibold text-gray-800">Thành tiền</th>
                    </tr>
                </thead>
                <tbody>
                    {order.order_products.map((item) => (
                        <tr key={item._id} className="hover:bg-gray-50">
                            <td className="border border-gray-200 px-4 py-2">{item.productId.product_name || 'Không tên'}</td>
                            <td className="border border-gray-200 px-4 py-2">{formatMoney(item.price)}</td>
                            <td className="border border-gray-200 px-4 py-2">{item.quantity}</td>
                            <td className="border border-gray-200 px-4 py-2">{item.discount}%</td>
                            <td className="border border-gray-200 px-4 py-2">{formatMoney(item.price * item.quantity * (1 - item.discount / 100))}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    // Hàm render thông tin tổng tiền
    const renderSummary = () => {
        const totalAmount = order.order_products.reduce((total, item) => {
            return total + item.price * item.quantity * (1 - item.discount / 100);
        }, 0);

        return (
            <div className="flex justify-between mt-6">
                <div className="space-y-2">
                    <p className="text-sm text-gray-700">
                        <span className="font-semibold text-gray-900">Thành tiền:</span> {formatMoney(totalAmount)}
                    </p>
                    <p className="text-sm text-gray-700">
                        <span className="font-semibold text-gray-900">Phương thức mua hàng:</span>{' '}
                        {order.order_payment_method === 'CASH' ? 'Trực tiếp' : 'Chuyển khoản'}
                    </p>
                </div>
            </div>
        );
    };

    return (
        <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[600px] m-4">
            <div className="relative w-full max-w-[600px] max-h-[500px] overflow-y-auto p-8 bg-white rounded-3xl shadow-lg dark:bg-gray-900 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                {/* Header hóa đơn */}
                {renderHeader()}

                {/* Tiêu đề hóa đơn */}
                <h3 className="text-center text-lg font-semibold text-gray-800 my-6">Hóa đơn mua hàng</h3>

                {/* Thông tin thanh toán */}
                {renderPaymentInfo()}

                {/* Danh sách sản phẩm */}
                {renderProductList()}

                {/* Thông tin tổng tiền */}
                {renderSummary()}
            </div>
        </Modal>
    );
};
