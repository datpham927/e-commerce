import { Skeleton } from '@mui/material';

const DashboardSkeleton = () => {
    return (
        <div className="space-y-4">
            {/* Tiêu đề Dashboard */}
            <Skeleton variant="text" width={150} height={30} />
            {/* Hàng thống kê 1 */}
            <div className="grid grid-cols-3  mobile:grid-cols-1 gap-4">
                {[...Array(9)].map((_, index) => (
                    <div key={index} className="p-6 bg-white rounded-md shadow-md space-y-2">
                        <Skeleton variant="text" width="60%" />
                        <Skeleton variant="text" width="40%" height={24} />
                    </div>
                ))}
            </div>

            {/* Biểu đồ Doanh thu theo ngày */}
            <div className="mt-8 bg-white rounded-md shadow-md p-6">
                <Skeleton variant="text" width="40%" height={28} />
                <Skeleton variant="rectangular" height={200} className="mt-4" />
            </div>
        </div>
    );
};

export default DashboardSkeleton;
