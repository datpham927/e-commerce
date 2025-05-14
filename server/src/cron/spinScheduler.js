const cron = require('node-cron');
const userModel = require('../models/user.model');
const notificationModel = require('../models/notification.model');
const autoCancelLateOrders = require('./autoCancelLateOrders');

// 🎯 Cron #1: Cộng lượt quay mỗi ngày lúc 00:00
cron.schedule('0 0 * * *', async () => {
    console.log('⏰ [Cron] Bắt đầu cộng 3 lượt quay cho tất cả user...');

    try {
        await userModel.updateMany(
            {},
            {
                $inc: { user_spin_turns: 3 },
                $set: { user_lastSpinIncrement: new Date() },
            },
        );

        const users = await userModel.find({}, '_id').lean();
        if (!users.length) throw new Error('Không có người dùng nào!');

        const data = {
            notification_title: '🎉 Bạn nhận được 3 lượt quay miễn phí mỗi ngày!',
            notification_subtitle: '🌀 Vào Vòng quay may mắn để săn quà hấp dẫn!',
            notification_imageUrl: 'https://bizweb.dktcdn.net/thumb/grande/100/004/714/articles/vong-quay-may-man-cu-quay-la-trung-thuong.jpg?v=1532916523767',
            notification_link: '/nguoi-dung/thong-tin-tai-khoan',
        };

        const notifications = users.map(user => ({
            notification_user: user._id,
            ...data,
        }));

        await notificationModel.insertMany(notifications);

        console.log('✅ [Cron] Đã cộng lượt quay + gửi thông báo.');
    } catch (error) {
        console.error('❌ [Cron] Lỗi khi cộng lượt quay:', error);
    }
});

// 🎯 Cron #2: Tự hủy đơn hàng quá hạn mỗi ngày lúc 1h sáng
cron.schedule('* * * * *', autoCancelLateOrders); // Chạy mỗi phút để test

