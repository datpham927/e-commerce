// components/TableSkeleton.js
import { Skeleton } from '@mui/material';

const TableSkeleton = ({ columns = 6, rows = 6 }) => {
    // Tạo mảng cho các cột header (dựa trên số lượng cột từ prop)
    const columnHeaders = Array(columns).fill(0);
    // Tạo mảng cho các hàng placeholder dựa trên số lượng rows từ prop
    const skeletonRows = Array(rows).fill(0);
    return (
        <div className="space-y-4 w-full">
            <Skeleton variant="text" width={150} height={30} />
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Skeleton cho header của bảng */}
                <div className={`grid grid-cols-${columns} gap-4 p-4 bg-gray-50 border-b`}>
                    {columnHeaders.map((_, index) => (
                        <Skeleton key={index} variant="text" width="80%" height={20} className="mx-auto" />
                    ))}
                </div>

                {/* Skeleton cho các hàng trong bảng */}
                {skeletonRows.map((_, rowIndex) => (
                    <div key={rowIndex} className={`grid grid-cols-${columns} gap-4 p-4 border-b`}>
                        {columnHeaders.map((_, colIndex) => {
                            // Tùy chỉnh cho cột đầu tiên (giả sử là QR Code) và cột cuối (giả sử là Thao tác)
                            if (colIndex === 0) {
                                return <Skeleton key={colIndex} variant="rectangular" width={40} height={40} className="mx-auto" />;
                            } else if (colIndex === columns - 1) {
                                return (
                                    <div key={colIndex} className="flex justify-center gap-2">
                                        <Skeleton variant="rectangular" width={24} height={24} className="rounded" />
                                        <Skeleton variant="rectangular" width={24} height={24} className="rounded" />
                                    </div>
                                );
                            } else {
                                return <Skeleton key={colIndex} variant="text" width="50%" height={20} className="mx-auto" />;
                            }
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TableSkeleton;
