/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DeliveryAddress from '../../../components/deliveryAddress';
import { useCartStore } from '../../../store/cartStore';
import { useActionStore } from '../../../store/actionStore';
import { useOrderStore } from '../../../store/orderStore';
import { PATH } from '../../../utils/const';
import { sendNotificationToAdmin } from '../../../services/notification.service';
import { showNotification } from '../../../components/common/showNotification';
import { ENV } from '../../../config/ENV';
import useUserStore from '../../../store/userStore';
import { IShipping } from '../../../interfaces/shipping.interfaces';
import { IVoucher } from '../../../interfaces/voucher.interfaces';
import { apiCreateOrders } from '../../../services/order.service';
import { INotification } from '../../../interfaces/notification.interfaces';
import { sortObject } from '../../../utils/sortObject';
import { calculateVnpSecureHash } from '../../../utils/calculateVnpSecureHash';
import { apiGetAllShippingCompanies } from '../../../services/shippingCompany.service';
import DeliveryMethods from './DeliveryMethods';
import VoucherSelection from './VoucherSelection';
import PaymentMethods from './PaymentMethods';
import OrderSummary from './OrderSummary';
import Header from './Header';
import ProductList from './ProductList';
import useSocketStore from '../../../store/socketStore';

const PaymentPage: React.FC = () => {
    const navigate = useNavigate();
    const { selectedProducts, setRemoveProductInCart } = useCartStore();
    const { user,setSubtractBalance } = useUserStore();
    const { setIsLoading } = useActionStore();
    const { setOrder } = useOrderStore();

    const [shippings, setShippings] = useState<IShipping[]>([]);
    const [selectedVoucher, setSelectedVoucher] = useState<IVoucher | null>(null);
    const [deliveryMethod, setDeliveryMethod] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('CASH');
    const { socket } = useSocketStore();

    // Tính toán giá tiền
    const totalProductPrice = selectedProducts.reduce((total, product) => total + product.product_discounted_price * (product.quantity || 1), 0);

    const selectedShipping = shippings.find((s) => s._id === deliveryMethod);
    const shippingFee = selectedShipping?.sc_shipping_price || 0;

    const voucherDiscount = selectedVoucher
        ? selectedVoucher.voucher_method === 'percent'
            ? Math.min((totalProductPrice * selectedVoucher.voucher_value) / 100, selectedVoucher.voucher_max_price || Infinity)
            : selectedVoucher.voucher_value
        : 0;

    const totalPayment = totalProductPrice + shippingFee - voucherDiscount;
    const { isConnected, connect } = useSocketStore();

    useEffect(() => {
        if (!isConnected) connect();
    }, [isConnected, connect]);

    // Lấy danh sách đơn vị giao hàng
    useEffect(() => {
        const fetchShippingCompanies = async () => {
            const res = await apiGetAllShippingCompanies();
            if (res.success && res.data.length > 0) {
                setShippings(res.data);
                setDeliveryMethod(res.data[0]._id);
            } else {
                showNotification('Không tìm thấy phương thức giao hàng', false);
            }
        };
        fetchShippingCompanies();
    }, []);

    // Chuyển về trang chủ nếu không có sản phẩm
    useEffect(() => {
        if (selectedProducts.length === 0) {
            navigate(PATH.HOME);
        }
    }, [selectedProducts, navigate]);

    const createOrderData = () => ({
        order_shipping_company: selectedShipping?._id,
        order_shipping_address: {
            fullName: user?.user_name,
            detailAddress: user?.user_address?.detail,
            village: user?.user_address?.village,
            district: user?.user_address?.district,
            city: user?.user_address?.city,
            phone: user?.user_mobile,
        },
        order_payment_method: paymentMethod,
        order_products: selectedProducts.map((p) => ({ productId: p.productId, quantity: p.quantity })),
        ...(selectedVoucher?._id && { order_voucherId: selectedVoucher._id }),
    });

    const handlePlaceOrder = async () => {
        // Kiểm tra người dùng đã chọn phương thức thanh toán và giao hàng chưa
        if (!paymentMethod || !deliveryMethod) {
            showNotification('Vui lòng chọn phương thức thanh toán và giao hàng', false);
            return;
        }
    
        // Tạo dữ liệu đơn hàng
        const data = createOrderData();
    
        if (paymentMethod === 'CASH') {
            // Xử lý thanh toán bằng tiền mặt
            setIsLoading(true);
            const res = await apiCreateOrders(data);
            setIsLoading(false);
            showNotification(res.message, res.success);
    
            // Nếu tạo đơn hàng không thành công, dừng lại
            if (!res.success) return;
    
            // Gửi thông báo cho admin về đơn hàng mới
            const notification: INotification = {
                notification_title: '🛒 Đơn hàng mới vừa được tạo!',
                notification_subtitle: '📦 Một khách hàng vừa đặt hàng. ✅ Kiểm tra và xử lý ngay để đảm bảo giao hàng đúng hẹn!',
                notification_imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuxPDt8O4FtLGH2odJdU8Udg6KJpdvQ1fGMw&s',
                notification_link: '/quan-ly/don-hang',
            };
    
            const response = await sendNotificationToAdmin(notification);
            socket.emit('sendNotificationForAdminOnline', {
                ...response.data,
            });
    
            // Xóa sản phẩm khỏi giỏ hàng
            await Promise.all(selectedProducts.map((product) => setRemoveProductInCart(product.productId)));
    
            // Điều hướng tới trang đơn hàng
            navigate(PATH.PAGE_ORDER);
        } 
        else if (paymentMethod === 'COIN') {
            // Xử lý thanh toán bằng coin
            const userBalance = user?.user_balance || 0;
            
            // Kiểm tra xem số dư người dùng có đủ để thanh toán bằng coin không
            if (userBalance < totalPayment) {
                showNotification('Số dư của bạn không đủ để thanh toán bằng COIN.', false);
                return;
            }
    
            // Giảm số dư người dùng bằng số tiền thanh toán
            setIsLoading(true);
            const res = await apiCreateOrders(data);
            setIsLoading(false);
            showNotification(res.message, res.success);
            // Nếu tạo đơn hàng không thành công, dừng lại
            if (!res.success) return;
            setSubtractBalance(totalPayment)
            // Trừ số dư người dùng khi thanh toán thành công
            await Promise.all(selectedProducts.map((product) => setRemoveProductInCart(product.productId)));
    
            // Điều hướng đến trang đơn hàng
            navigate(PATH.PAGE_ORDER);
        } 
        else {
            // Xử lý thanh toán qua VNPay
            setOrder(data);
            handleVNPayPayment();
        }
    };
    

    const handleVNPayPayment = () => {
        const { vnp_TmnCode, vnp_HashSecret, vnp_Url, BASE_URL } = ENV;
        const returnUrl = `${BASE_URL}${PATH.PAGE_PAYMENT_CONFIRM}`;

        if (!vnp_HashSecret || !vnp_Url || !vnp_TmnCode || !returnUrl) {
            alert('Không thể thực hiện thanh toán, thiếu thông tin cấu hình.');
            return;
        }

        const createDate = new Date().toISOString().slice(0, 19).replace(/[-:T]/g, '');
        const orderId =
            new Date().getHours().toString().padStart(2, '0') + new Date().getMinutes().toString().padStart(2, '0') + Math.floor(Math.random() * 10000);

        const paymentData: any = {
            vnp_Amount: totalPayment * 100,
            vnp_Command: 'pay',
            vnp_CreateDate: createDate,
            vnp_CurrCode: 'VND',
            vnp_IpAddr: '127.0.0.1',
            vnp_Locale: 'vn',
            vnp_OrderInfo: 'p',
            vnp_OrderType: '250000',
            vnp_ReturnUrl: returnUrl,
            vnp_TxnRef: orderId,
            vnp_Version: '2.1.0',
            vnp_TmnCode: vnp_TmnCode,
        };

        const sortedParams = sortObject(paymentData)
            .map((key) => `${key}=${encodeURIComponent(paymentData[key])}`)
            .join('&');

        const vnp_SecureHash = calculateVnpSecureHash(sortedParams, vnp_HashSecret);
        const paymentUrl = `${vnp_Url}?${sortedParams}&vnp_SecureHash=${vnp_SecureHash}`;

        alert(`Thanh toán qua VNPay với số tiền: ${totalPayment} VND`);
        window.location.href = paymentUrl;
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-100 gap-4 mt-2">
            <Header />
            <div className="flex flex-col rounded-sm overflow-hidden">
                <div className="airmail-border"></div>
                <div className="w-full bg-white p-6 shadow-sm">
                    <DeliveryAddress />
                    <ProductList products={selectedProducts} />
                    <DeliveryMethods shippings={shippings} selectedMethod={deliveryMethod} onMethodChange={setDeliveryMethod} />
                    <VoucherSelection selectedVoucher={selectedVoucher} setSelectedVoucher={setSelectedVoucher} />
                    <PaymentMethods totalPayment={totalPayment} selectedMethod={paymentMethod} onMethodChange={setPaymentMethod} />
                    <OrderSummary
                        totalProductPrice={totalProductPrice}
                        shippingFee={shippingFee}
                        voucherDiscount={voucherDiscount}
                        totalPayment={totalPayment}
                        selectedPaymentMethod={paymentMethod}
                        deliveryMethod={deliveryMethod}
                        paymentMethod={paymentMethod}
                        onPlaceOrder={handlePlaceOrder}
                    />
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
