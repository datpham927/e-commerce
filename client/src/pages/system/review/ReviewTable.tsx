import DoneIcon from '@mui/icons-material/Done';
import DeleteIcon from '@mui/icons-material/Delete';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../../../components/ui/table';
import { IReview } from '../../../interfaces/review.interfaces';

interface ReviewListProps {
    Reviews: IReview[];
    onDelete: (id: string | any) => void;
    onApprove: (id: string | any) => void;
}

const ReviewTable: React.FC<ReviewListProps> = ({ Reviews, onDelete, onApprove }) => {
    return (
        <div className="overflow-hidden rounded-xl my-6 border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800">
            <div className="w-full overflow-x-auto">
                <Table>
                    <TableHeader className="bg-gray-100 dark:bg-gray-700">
                        <TableRow>
                            <TableCell isHeader className="px-6 py-4 font-semibold text-gray-700 dark:text-white text-center">Người dùng</TableCell>
                            <TableCell isHeader className="px-6 py-4 font-semibold text-gray-700 dark:text-white text-center">Bình luận</TableCell>
                            <TableCell isHeader className="px-6 py-4 font-semibold text-gray-700 dark:text-white text-center">Hình ảnh</TableCell>
                            <TableCell isHeader className="px-6 py-4 font-semibold text-gray-700 dark:text-white text-center">Trạng thái</TableCell>
                            <TableCell isHeader className="px-6 py-4 font-semibold text-gray-700 dark:text-white text-center">Thao tác</TableCell>
                        </TableRow>
                    </TableHeader>

                    <TableBody className="divide-y divide-gray-200 dark:divide-gray-600">
                        {Reviews?.map((review) => (
                            <TableRow key={review?._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                                <TableCell className="px-6 py-4 text-center text-gray-900 dark:text-gray-100 font-medium">
                                    {review?.review_user?.user_name || 'Ẩn danh'}
                                </TableCell>

                                <TableCell className="px-6 py-4 text-center text-gray-700 dark:text-gray-300 max-w-[300px]">
                                    <span className="block truncate">{review?.review_comment}</span>
                                </TableCell>

                                <TableCell className="px-6 py-4 text-center">
                                    {review?.review_images?.length > 0 ? (
                                        <div className="flex gap-2 justify-center flex-wrap">
                                            {review?.review_images.map((img, index) => (
                                                <div
                                                    key={index}
                                                    className="w-16 h-16 border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden shadow-sm"
                                                >
                                                    <img src={img} alt="Hình ảnh đánh giá" className="w-full h-full object-cover" />
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <span className="text-sm text-gray-500 dark:text-gray-400 italic">Không có ảnh</span>
                                    )}
                                </TableCell>

                                <TableCell className="px-6 py-4 text-center">
                                    {review?.isApproved ? (
                                        <span className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium dark:bg-green-700/30 dark:text-green-300">
                                            Đã duyệt
                                        </span>
                                    ) : (
                                        <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-medium dark:bg-yellow-700/30 dark:text-yellow-300">
                                            Chưa duyệt
                                        </span>
                                    )}
                                </TableCell>

                                <TableCell className="px-6 py-4 text-center">
                                    <div className="flex justify-center gap-3">
                                        {!review?.isApproved && (
                                            <button
                                                onClick={() => onApprove(review._id)}
                                                className="text-indigo-600 hover:text-indigo-800 hover:scale-110 transition-transform"
                                                title="Duyệt"
                                            >
                                                <DoneIcon />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => onDelete(review._id)}
                                            className="text-red-500 hover:text-red-700 hover:scale-110 transition-transform"
                                            title="Xóa"
                                        >
                                            <DeleteIcon />
                                        </button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default ReviewTable;
