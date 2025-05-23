/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef } from 'react';
import { ReceiptContent } from '../../../components/ReceiptContent';
import { apiCreateOfflineOrders } from '../../../services/order.service';
import { showNotification } from '../../../components';
import { IProductInCart } from '../../../interfaces/cart.interfaces';
import { apiGetProductById } from '../../../services/product.service';
import { IProductDetail } from '../../../interfaces/product.interfaces';

interface ConfirmationModalProps {
    open: boolean;
    cart: IProductInCart[];
    paymentMethod: string;
    cashReceived: number | '';
    calculateSubtotal: number;
    calculateDiscountFromProducts: number;
    calculateTotal: number;
    calculateChange: number;
    voucherId: string;
    appliedDiscount: number;
    handleCloseModal: () => void;
    handlePrintSuccess: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    open,
    cart,
    paymentMethod,
    cashReceived,
    calculateSubtotal,
    calculateDiscountFromProducts,
    calculateTotal,
    calculateChange,
    appliedDiscount,
    handleCloseModal,
    voucherId,
    handlePrintSuccess,
}) => {
    const printRef = useRef<HTMLDivElement>(null);

    if (!open) return null;

    const handleConfirmAndPrint = async () => {
        // Kiểm tra tồn kho trước khi tạo đơn
        for (const item of cart) {
            // Đảm bảo lấy đúng ID sản phẩm
            const productId = typeof item.productId === 'string' ? item.productId : item.productId._id;

            // Gọi API lấy thông tin sản phẩm
            const res = await apiGetProductById(productId);

            // Kiểm tra xem API có trả về dữ liệu thành công không
            if (!res || !res.success || !res.data) {
                showNotification('Không thể kiểm tra tồn kho sản phẩm.', false);
                return;
            }

            const product: IProductDetail = res.data;

            // Kiểm tra số lượng tồn kho có đủ không
            if (item.quantity > product.product_quantity) {
                showNotification(`❌ Sản phẩm "${product.product_name}" chỉ còn lại ${product.product_quantity} trong kho.`, false);
                return;
            }
        }

        // Nếu đủ tồn kho, tiến hành tạo đơn hàng
        const data = {
            order_products: cart,
            order_payment_method: paymentMethod,
            voucherId,
        };

        const res = await apiCreateOfflineOrders(data);
        showNotification(res.message, res.success);
        if (!res.success) return;

        const printContent = printRef.current?.innerHTML;
        if (printContent) {
            const newWindow = window.open('', '_blank');
            if (newWindow) {
                newWindow.document.write(`
                    <html>
                        <head>
                            <title>In hóa đơn</title>
                            <style>
                                @media print {
                                    .print-hidden {
                                        display: none !important;
                                    }
                                    .receipt-content {
                                        max-height: none !important;
                                        overflow-y: visible !important;
                                        border: none !important;
                                    }
                                    body {
                                        margin: 0;
                                        padding: 0;
                                        font-family: Arial, sans-serif;
                                    }
                                }
                                .receipt-content {
                                    padding: 20px;
                                    font-size: 14px;
                                }
                                table {
                                    width: 100%;
                                    border-collapse: collapse;
                                    margin: 15px 0;
                                }
                                th, td {
                                    border: 1px solid #ddd;
                                    padding: 8px;
                                    text-align: left;
                                }
                                th {
                                    background-color: #f2f2f2;
                                }
                                .text-center {
                                    text-align: center;
                                }
                                .mb-4 {
                                    margin-bottom: 16px;
                                }
                                .space-y-1 > * + * {
                                    margin-top: 4px;
                                }
                            </style>
                        </head>
                        <body>
                            <div class="receipt-content">
                                ${printContent}
                            </div>
                            <script>
                                window.onload = function() {
                                    window.print();
                                    window.onafterprint = function() {
                                        if (window.opener && window.opener.handlePrintSuccess) {
                                            window.opener.handlePrintSuccess();
                                        }
                                        window.close();
                                    };
                                };
                            </script>
                        </body>
                    </html>
                `);
                newWindow.document.close();
            }
        }
    };

    // Đảm bảo handlePrintSuccess có thể được truy cập từ tab mới
    (window as any).handlePrintSuccess = handlePrintSuccess;

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 font-sans text-sm">
            <div className="bg-white rounded-lg p-6 w-[600px] shadow-lg">
                <div
                    ref={printRef}
                    className="max-h-[400px] overflow-y-auto p-4 my-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 border-gray-200 rounded-md">
                    <ReceiptContent
                        cart={cart}
                        paymentMethod={paymentMethod}
                        cashReceived={cashReceived}
                        calculateSubtotal={calculateSubtotal}
                        calculateDiscountFromProducts={calculateDiscountFromProducts}
                        calculateTotal={calculateTotal}
                        calculateChange={calculateChange}
                        appliedDiscount={appliedDiscount}
                    />
                </div>

                <div className="print-hidden flex justify-end gap-3 mt-4">
                    <button onClick={handleCloseModal} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
                        Hủy
                    </button>
                    <button onClick={handleConfirmAndPrint} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                        Xác nhận và in hóa đơn
                    </button>
                </div>
            </div>
        </div>
    );
};
