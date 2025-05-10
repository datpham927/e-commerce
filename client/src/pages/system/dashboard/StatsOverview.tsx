import { DashboardStats } from '../../../interfaces/dashboard.interface';

interface StatsOverviewProps {
  stats: DashboardStats;
  onProductClick: () => void;
  onUserClick: () => void;
  onOrderClick: () => void;
  onOrderoffClick: () => void;
  onReviewClick: () => void;
  onRevenueMouseEnter: () => void;
  onRevenueMouseLeave: () => void;
  showTooltip: boolean;
  revenuePerMonth: { _id: string; total: number }[];
}
  
const statLabels = {
  totalProducts: 'Tổng sản phẩm',
  totalUsers: 'Tổng người dùng',
  totalOrders: 'Tổng đơn hàng',
  totalPendingOrders: 'Đơn hàng chờ xử lý',
  totalDeliveredOrders: 'Đơn hàng đã giao',
  totalRevenue: 'Tổng doanh thu tháng này',
  totalReviews: 'Tổng đánh giá',
  totalApprovedReviews: '',
  totalPendingReviews: '',
  expiredProducts: 'Sản phẩm hết hạn',
  lessThanOneMonthProducts: 'Sản phẩm cận hạn',
  moreThanOneMonthProducts: 'Sản phẩm còn hạn >1 tháng',
  totalOfflineOrders: 'Đơn hàng offline',
  totalOfflineRevenue: '',
};

export default function StatsOverview({
  stats,
  onProductClick,
  onUserClick,
  onOrderClick,
  onOrderoffClick,
  onReviewClick,
  onRevenueMouseEnter,
  onRevenueMouseLeave,
  showTooltip,
  revenuePerMonth,
}: StatsOverviewProps) {
  const thisMonth = revenuePerMonth?.[revenuePerMonth.length - 1]?.total || 0;
  const lastMonth = revenuePerMonth?.[revenuePerMonth.length - 2]?.total || 0;
  const diff = thisMonth - lastMonth;
  const percentage =
    lastMonth === 0 ? 100 : Math.abs((diff / lastMonth) * 100).toFixed(1);
  const isIncrease = diff >= 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
      {([
        {
          key: 'totalProducts',
          label: statLabels.totalProducts,
          value: stats.totalProducts,
          onClick: onProductClick,
          detail: [
            {
              icon: '❌',
              label: 'Hết hạn',
              value: stats.expiredProducts,
              color: 'text-red-600',
            },
            {
              icon: '⏳',
              label: 'Cận hạn',
              value: stats.lessThanOneMonthProducts,
              color: 'text-yellow-500',
            },
            {
              icon: '✅',
              label: 'Còn hạn >1 tháng',
              value: stats.moreThanOneMonthProducts,
              color: 'text-green-500',
            },
          ],
        },
        {
          key: 'totalUsers',
          label: statLabels.totalUsers,
          value: stats.totalUsers,
          onClick: onUserClick,
        },
        {
          key: 'totalOrders',
          label: statLabels.totalOrders,
          value: stats.totalPendingOrders + stats.totalDeliveredOrders,
          onClick: onOrderClick,
          detail: [
            {
              icon: '📦',
              label: 'Chờ xử lý',
              value: stats.totalPendingOrders,
              color: 'text-yellow-500',
            },
            {
              icon: '✅',
              label: 'Đã giao',
              value: stats.totalDeliveredOrders,
              color: 'text-green-600',
            },
          ],
        },
        {
          key: 'totalRevenue',
          label: statLabels.totalRevenue,
          value: stats.totalRevenue + stats.totalOfflineRevenue, // ✅ Cộng online + offline
          onMouseEnter: onRevenueMouseEnter,
          onMouseLeave: onRevenueMouseLeave,
        },
        {
          key: 'totalReviews',
          label: statLabels.totalReviews,
          value: stats.totalApprovedReviews + stats.totalPendingReviews,
          onClick: onReviewClick,
          detail: [
            {
              icon: '✅',
              label: 'Đã duyệt',
              value: stats.totalApprovedReviews,
              color: 'text-green-500',
            },
            {
              icon: '⏳',
              label: 'Chờ duyệt',
              value: stats.totalPendingReviews,
              color: 'text-yellow-500',
            },
          ],
        },
        {
          key: 'totalOfflineOrders',
          label: statLabels.totalOfflineOrders,
          value: stats.totalOfflineOrders,
          onClick: onOrderoffClick,
        },
      ] as any[]).map(
        (
          { key, label, value, onClick, detail, onMouseEnter, onMouseLeave },
          index
        ) => (
          <div
            key={index}
            className="relative group p-6 bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 cursor-pointer overflow-hidden"
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          >
            <div className="text-sm text-gray-100">{label}</div>
            <div className="text-3xl font-bold text-white">
              {value.toLocaleString()}
              {key === 'totalRevenue' && ' VND'}
            </div>

            {key === 'totalRevenue' && (
              <div className="mt-2 text-sm font-medium flex items-center space-x-1 text-white">
                <span
                  className={`flex items-center ${isIncrease ? 'text-green-300' : 'text-red-300'}`}
                >
                  {isIncrease ? '▲' : '▼'} {percentage}%
                </span>
                <span className="text-gray-200">(so với tháng trước)</span>
              </div>
            )}

            {(detail || (key === 'totalRevenue' && showTooltip)) && (
              <div className="absolute inset-0 w-full h-full bg-black/50 backdrop-blur-md text-white flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-auto">
                <div className="space-y-2 px-4 py-2 text-sm w-full">
                  {detail && (
                    <div className="space-y-1">
                      {detail.map((item: any, idx: number) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <span className={item.color}>{item.icon}</span>
                          <span>{item.label}:</span>
                          <span className="font-semibold">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {key === 'totalRevenue' && showTooltip && (
                    <div className="space-y-1 text-sm mt-2">
                      <div className="font-semibold">Chi tiết doanh thu tháng này:</div>
                      <div className="flex items-center justify-between">
                        <span>Online:</span>
                        <span className="font-semibold">{stats.totalRevenue.toLocaleString()} VND</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Bán tại quầy:</span>
                        <span className="font-semibold">{stats.totalOfflineRevenue.toLocaleString()} VND</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
}
