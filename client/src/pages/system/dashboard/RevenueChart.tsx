import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface RevenueItem {
  _id: string;
  total: number;
}

interface RevenueChartProps {
  viewType: 'day' | 'month';
  onViewChange: (type: 'day' | 'month') => void;
  revenuePerDay: RevenueItem[];
  revenuePerMonth: RevenueItem[];
  offlineRevenuePerDay?: RevenueItem[];
  offlineRevenuePerMonth?: RevenueItem[];
}

export default function RevenueChart({
  viewType,
  onViewChange,
  revenuePerDay,
  revenuePerMonth,
  offlineRevenuePerDay = [],
  offlineRevenuePerMonth = [],
}: RevenueChartProps) {
  // Hàm gộp dữ liệu để tính tổng doanh thu = online + offline
  const mergeData = (
    onlineData: RevenueItem[],
    offlineData: RevenueItem[]
  ): { _id: string; online: number; offline: number; total: number }[] => {
    const mergedMap = new Map<string, { _id: string; online: number; offline: number; total: number }>();

    // Thêm dữ liệu online vào map
    onlineData.forEach(item => {
      mergedMap.set(item._id, {
        _id: item._id,
        online: item.total,
        offline: 0,
        total: item.total, // Tạm thời chỉ có online
      });
    });

    // Thêm dữ liệu offline vào map và tính tổng
    offlineData.forEach(item => {
      const existingItem = mergedMap.get(item._id);
      if (existingItem) {
        existingItem.offline = item.total;
        existingItem.total += item.total; // Cộng offline vào tổng
      } else {
        mergedMap.set(item._id, {
          _id: item._id,
          online: 0,
          offline: item.total,
          total: item.total, // Chỉ có offline
        });
      }
    });

    // Trả về danh sách đã sắp xếp theo ngày/tháng
    return Array.from(mergedMap.values()).sort((a, b) => a._id.localeCompare(b._id));
  };

  // Chọn dữ liệu theo viewType (theo ngày hoặc theo tháng)
  const chartData =
    viewType === 'day'
      ? mergeData(revenuePerDay, offlineRevenuePerDay)
      : mergeData(revenuePerMonth, offlineRevenuePerMonth);

  return (
    <div className="mt-10 bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Thống kê doanh thu</h2>
        <div className="space-x-2">
          {/* Button lựa chọn xem theo ngày hoặc theo tháng */}
          <button
            className={`px-4 py-1 rounded ${viewType === 'day' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => onViewChange('day')}
          >
            Theo ngày
          </button>
          <button
            className={`px-4 py-1 rounded ${viewType === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => onViewChange('month')}
          >
            Theo tháng
          </button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 50, bottom: 30 }} // Điều chỉnh khoảng cách thêm cho phần dưới và bên trái
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="_id"
            padding={{ left: 50, right: 50 }} // Tăng thêm padding bên trái và phải để tránh che
            tick={{ fontSize: 12 }} // Giảm kích thước chữ để có nhiều không gian hơn
          />
          <YAxis />
          <Tooltip />
          <Legend />
          {/* Vẽ các đường cho doanh thu tổng, online và offline */}
          <Line
            type="monotone"
            dataKey="total"
            stroke="#8884d8"
            name="Tổng doanh thu"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="online"
            stroke="#82ca9d"
            name="Doanh thu online"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="offline"
            stroke="#ffc658"
            name="Doanh thu tại quầy"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
