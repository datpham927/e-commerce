const Notification = require('../models/notification.model');
const OnlineOrder = require('../models/OnlineOrder.model');
const User = require('../models/user.model');

const autoCancelLateOrders = async () => {
    console.log('⏰ [Cron] Checking for orders to auto-cancel...');
    try {
        // Find shipped orders with a shipping deadline
        const orders = await OnlineOrder.find({
            order_status: 'shipped',
            'order_date_shipping.to': { $exists: true, $ne: null },
        })
            .populate('order_products.productId')
            .lean();

        const now = new Date();
        const expiredOrders = orders.filter(order => {
            const shippingTo = new Date(order.order_date_shipping?.to);
            return shippingTo < now;
        });

        if (expiredOrders.length === 0) {
            console.log('✅ [Cron] No overdue orders to cancel.');
            return;
        }

        const expiredOrderIds = expiredOrders.map(order => order._id);

        // Update status of expired orders to cancelled
        await OnlineOrder.updateMany(
            { _id: { $in: expiredOrderIds } },
            { $set: { order_status: 'cancelled' } }
        );

        const userNotifications = [];
        const adminNotifications = [];

        expiredOrders.forEach(order => {
            const firstProduct = order.order_products?.[0]?.productId;
            userNotifications.push({
                notification_user: order.order_user,
                notification_title: '🚫 Một đơn hàng của bạn đã bị hủy',
                notification_subtitle: `Đơn hàng #"${order?.order_code}" đã bị hủy do quá hạn giao hàng.`,
                notification_imageUrl: firstProduct?.product_thumb || '',
                notification_link: '/nguoi-dung/don-hang',
                notification_type: 'user',
            });
                adminNotifications.push({
                    notification_title: '🚨 Đơn hàng quá hạn đã bị hủy!',
                    notification_subtitle: `Hệ thống vừa tự động hủy đơn hàng #"${order?.order_code}" vì quá hạn giao hàng.`,
                    notification_imageUrl: 'https://cdn-icons-png.flaticon.com/512/5957/5957885.png',
                    notification_link: '/quan-ly/don-hang',
                    notification_type: 'admin',
                });
        });
        const notifications = [...userNotifications, ...adminNotifications];
        // Insert all notifications
        console.log({notifications})
        await Notification.insertMany(notifications);
        console.log(`✅ [Cron] Cancelled ${expiredOrderIds.length} orders `);
    } catch (err) {
        console.error('❌ [Cron] Error cancelling overdue orders:', err);
    }
};

module.exports = autoCancelLateOrders;
