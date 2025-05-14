const Product = require('../models/product.model');
const User = require('../models/user.model');
const Review = require('../models/reviews.model');
const OnlineOrder = require('../models/OnlineOrder.model');
const OfflineOrder = require('../models/OfflineOrder.model');

class DashboardService {
    static async getStats(startDate, endDate) {
        try {
            const totalProducts = await Product.countDocuments();
            const totalUsers = await User.countDocuments();
            const totalOrders = await OnlineOrder.countDocuments();
            const totalPendingOrders = await OnlineOrder.countDocuments({ order_status: 'pending' });
            const totalDeliveredOrders = await OnlineOrder.countDocuments({ order_status: 'delivered' });
            const totalReviews = await Review.countDocuments();
            const totalApprovedReviews = await Review.countDocuments({ isApproved: true });
            const totalPendingReviews = await Review.countDocuments({ isApproved: false });

            const pendingReviews = await Review.find({ isApproved: false })
                .select('review_user review_comment review_rating review_productId createdAt')
                .populate('review_user', 'user_name user_email')
                .populate('review_productId', 'product_name');

            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

            const totalRevenueData = await OnlineOrder.aggregate([
                {
                    $match: {
                        order_status: 'delivered',
                        createdAt: { $gte: startOfMonth, $lte: endOfMonth },
                    },
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: '$order_total_price' },
                    },
                },
            ]);
            const totalRevenue = totalRevenueData[0]?.total || 0;

            // ✅ Tổng số đơn hàng và doanh thu offline
            const totalOfflineOrders = await OfflineOrder.countDocuments();

            const totalOfflineRevenueData = await OfflineOrder.aggregate([
                {
                    $match: {
                        createdAt: { $gte: startOfMonth, $lte: endOfMonth },
                    },
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: '$order_total_price' },
                    },
                },
            ]);
            const totalOfflineRevenue = totalOfflineRevenueData[0]?.total || 0;
            let filterStartDate = startDate ? new Date(startDate) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            let filterEndDate = endDate ? new Date(endDate) : new Date();
            filterStartDate.setUTCHours(0, 0, 0, 0);
            filterEndDate.setUTCHours(23, 59, 59, 999);
            const revenuePerDayData = await OnlineOrder.aggregate([
                {
                    $match: {
                        order_status: 'delivered',
                        createdAt: { $gte: filterStartDate, $lte: filterEndDate },
                    },
                },
                {
                    $group: {
                        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                        total: { $sum: '$order_total_price' },
                    },
                },
                { $sort: { _id: 1 } },
            ]);

            const offlineRevenuePerDayData = await OfflineOrder.aggregate([
                {
                    $match: {
                        createdAt: { $gte: filterStartDate, $lte: filterEndDate },
                    },
                },
                {
                    $group: {
                        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                        total: { $sum: '$order_total_price' },
                    },
                },
                { $sort: { _id: 1 } },
            ]);

            const allDates = [];
            let currentDate = new Date(filterStartDate);
            while (currentDate <= filterEndDate) {
                allDates.push(currentDate.toISOString().split('T')[0]);
                currentDate.setDate(currentDate.getDate() + 1);
            }

            const revenueMap = new Map(revenuePerDayData.map((item) => [item._id, item.total]));
            const revenuePerDay = allDates.map((date) => ({
                _id: date,
                total: revenueMap.get(date) || 0,
            }));

            const offlineMap = new Map(offlineRevenuePerDayData.map((item) => [item._id, item.total]));
            const offlineRevenuePerDay = allDates.map((date) => ({
                _id: date,
                total: offlineMap.get(date) || 0,
            }));

            const topSellingProducts = await Product.find().sort({ product_sold: -1 }).limit(5).select('product_name product_sold');

            const revenuePerMonthData = await OnlineOrder.aggregate([
                {
                    $match: { order_status: 'delivered' },
                },
                {
                    $group: {
                        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
                        total: { $sum: '$order_total_price' },
                    },
                },
                { $sort: { _id: 1 } },
            ]);

            const offlineRevenuePerMonth = await OfflineOrder.aggregate([
                {
                    $match: {},
                },
                {
                    $group: {
                        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
                        total: { $sum: '$order_total_price' },
                    },
                },
                { $sort: { _id: 1 } },
            ]);

            const oneMonthLater = new Date();
            oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);

            const expiredProductsCount = await Product.countDocuments({ product_expiry_date: { $lt: new Date() } });
            const lessThanOneMonthProductsCount = await Product.countDocuments({
                product_expiry_date: { $gte: new Date(), $lt: oneMonthLater },
            });
            const moreThanOneMonthProductsCount = await Product.countDocuments({
                product_expiry_date: { $gte: oneMonthLater },
            });

            return {
                stats: {
                    totalProducts,
                    totalUsers,
                    totalOrders,
                    totalPendingOrders,
                    totalDeliveredOrders,
                    totalRevenue,
                    totalReviews,
                    totalApprovedReviews,
                    totalPendingReviews,
                    expiredProducts: expiredProductsCount,
                    lessThanOneMonthProducts: lessThanOneMonthProductsCount,
                    moreThanOneMonthProducts: moreThanOneMonthProductsCount,

                    // ✅ Thống kê gọn gàng cho đơn hàng offline
                    totalOfflineOrders,
                    totalOfflineRevenue,
                },
                revenuePerDay,
                revenuePerMonth: revenuePerMonthData,
                pendingReviews,
                topSellingProducts,
                offlineRevenuePerDay,
                offlineRevenuePerMonth,
            };
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu Dashboard:', error);
            throw new Error('Không thể lấy dữ liệu Dashboard');
        }
    }
    static async getNewUsers() {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        return await User.find({
            createdAt: { $gte: oneWeekAgo },
        })
            .sort({ createdAt: -1 })
            .select('user_name user_email user_mobile createdAt');
    }

    static async getPotentialCustomers() {
        const orderUsers = await OnlineOrder.distinct('order_user');

        // Tính tổng số đơn hàng 'delivered' của mỗi người dùng và giữ lại các trường cần thiết
        return await User.aggregate([
            {
                $match: {
                    _id: { $in: orderUsers },
                },
            },
            {
                $lookup: {
                    from: 'onlineorders', // Tên collection của đơn hàng
                    localField: '_id',
                    foreignField: 'order_user',
                    as: 'orders',
                },
            },
            {
                $unwind: '$orders', // Unwind mảng đơn hàng để dễ dàng lọc trạng thái
            },
            {
                $match: {
                    'orders.order_status': 'delivered', // Chỉ lấy đơn hàng có trạng thái 'delivered'
                },
            },
            {
                $group: {
                    _id: '$_id', // Nhóm lại theo _id của người dùng
                    user_name: { $first: '$user_name' },
                    user_email: { $first: '$user_email' },
                    user_mobile: { $first: '$user_mobile' },
                    totalOrders: { $sum: 1 }, // Tính tổng số đơn hàng đã 'delivered'
                },
            },
            {
                $project: {
                    user_name: 1,
                    user_email: 1,
                    user_mobile: 1,
                    totalOrders: 1, // Trả về tổng số đơn hàng
                },
            },
        ]);
    }
    static async getProductStats() {
        // Thực hiện các truy vấn song song
        const [soldProducts, totalCustomers, totalProducts, totalVisits] = await Promise.all([
            Product.aggregate([{ $group: { _id: null, totalSold: { $sum: '$product_sold' } } }]),
            User.countDocuments({ user_isBlocked: false }),
            Product.countDocuments(),
            Product.aggregate([{ $group: { _id: null, totalVisits: { $sum: '$product_views' } } }]),
        ]);

        // Trích xuất kết quả với giá trị mặc định
        return {
            sold: soldProducts[0]?.totalSold || 0,
            customers: totalCustomers || 0,
            products: totalProducts || 0,
            visits: totalVisits[0]?.totalVisits || 0,
        };
    }
}

module.exports = DashboardService;
