const OnlineOrder = require('../models/OnlineOrder');
const Notification = require('../models/notification.model');
const User = require('../models/user.model'); // Để lấy danh sách admin

const autoCancelLateOrders = async () => {
    console.log('⏰ [Cron] Đang kiểm tra đơn hàng cần tự động hủy...');
    try {
        const orders = await OnlineOrder.find({
            order_status: 'shipped',
            'order_date_shipping.to': { $exists: true, $ne: null },
        })
        .populate('order_products.productId') // Để có ảnh và tên sản phẩm
        .lean();

        const now = new Date();
        const expiredOrders = orders.filter(order => {
            const shippingTo = new Date(order.order_date_shipping?.to);
            return shippingTo < now;
        });

        if (expiredOrders.length === 0) {
            console.log('✅ [Cron] Không có đơn hàng nào quá hạn cần hủy.');
            return;
        }

        const expiredOrderIds = expiredOrders.map(order => order._id);
        await OnlineOrder.updateMany(
            { _id: { $in: expiredOrderIds } },
            { $set: { order_status: 'cancelled' } }
        );

        // Gửi thông báo đến người dùng
        const userNotifications = expiredOrders.map(order => {
            const firstProduct = order.order_products?.[0]?.productId;
            return {
                notification_user: order.order_user,
                notification_title: '🚫 Một đơn hàng của bạn đã bị hủy',
                notification_subtitle: `Đơn hàng có sản phẩm "${firstProduct?.product_name || '...'}" đã bị hủy do quá hạn giao hàng.`,
                notification_imageUrl: firstProduct?.product_thumb || '',
                notification_link: '/nguoi-dung/don-hang',
                notification_type: 'user',
            };
        });

        // Gửi thông báo đến admin
        const adminUsers = await User.find({ user_role: 'ADMIN', user_isBlocked: false }, '_id').lean();
        const adminNotifications = adminUsers.map(admin => ({
            notification_title: '🚨 Đơn hàng quá hạn đã bị hủy!',
            notification_subtitle: `Hệ thống vừa tự động hủy ${expiredOrderIds.length} đơn hàng vì quá hạn giao hàng.`,
            notification_imageUrl: 'https://cdn-icons-png.flaticon.com/512/5957/5957885.png',
            notification_link: '/quan-ly/don-hang',
            notification_type: 'admin',
        }));

        await Notification.insertMany([...userNotifications, ...adminNotifications]);

        console.log(`✅ [Cron] Đã hủy ${expiredOrderIds.length} đơn hàng và gửi thông báo đến user + admin.`);
    } catch (err) {
        console.error('❌ [Cron] Lỗi khi hủy đơn hàng quá hạn:', err);
    }
};

module.exports = autoCancelLateOrders;
