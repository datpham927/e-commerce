import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../../../components/ui/table';
import { IBanner } from '../../../interfaces/banner.interfaces';
import { formatDate } from '../../../utils/format/formatDate';

interface BannerListProps {
    banners: IBanner[];
    onEdit: (banner: IBanner) => void;
    onDelete: (id: any) => void;
}

const BannerTable: React.FC<BannerListProps> = ({ banners, onEdit, onDelete }) => {
    return (
        <div className="overflow-hidden rounded-xl my-6 border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800">
            <div className="w-full overflow-x-auto">
                <Table>
                    <TableHeader className="bg-gray-100 dark:bg-gray-700">
                        <TableRow>
                            <TableCell isHeader className="px-6 py-4 font-semibold text-gray-700 dark:text-white">Tiêu đề</TableCell>
                            <TableCell isHeader className="px-6 py-4 font-semibold text-gray-700 dark:text-white">Hình ảnh</TableCell>
                            <TableCell isHeader className="px-6 py-4 font-semibold text-gray-700 text-center dark:text-white">Liên kết</TableCell>
                            <TableCell isHeader className="px-6 py-4 font-semibold text-gray-700 text-center dark:text-white">Bắt đầu</TableCell>
                            <TableCell isHeader className="px-6 py-4 font-semibold text-gray-700 text-center dark:text-white">Kết thúc</TableCell>
                            <TableCell isHeader className="px-6 py-4 font-semibold text-gray-700 text-center dark:text-white">Thao tác</TableCell>
                        </TableRow>
                    </TableHeader>

                    <TableBody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {banners?.map((banner) => (
                            <TableRow key={banner._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                                <TableCell className="px-6 py-4 text-gray-800 dark:text-gray-100 font-medium">
                                    {banner.banner_title}
                                </TableCell>
                                <TableCell className="px-6 py-4">
                                    <div className="w-40 h-20 overflow-hidden rounded-md border border-gray-300 dark:border-gray-600 shadow-sm">
                                        <img
                                            src={banner.banner_imageUrl}
                                            alt={banner.banner_title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </TableCell>
                                <TableCell className="px-6 py-4 text-center">
                                    <a
                                        href={banner.banner_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 hover:underline truncate block max-w-[180px] mx-auto dark:text-blue-400"
                                    >
                                        {banner.banner_link}
                                    </a>
                                </TableCell>
                                <TableCell className="px-6 py-4 text-center text-gray-700 dark:text-gray-200">
                                    {formatDate(banner.banner_startDate)}
                                </TableCell>
                                <TableCell className="px-6 py-4 text-center text-gray-700 dark:text-gray-200">
                                    {formatDate(banner.banner_endDate)}
                                </TableCell>
                                <TableCell className="px-6 py-4 text-center">
                                    <div className="flex justify-center gap-3">
                                        <button
                                            onClick={() => onEdit(banner)}
                                            className="text-indigo-600 hover:text-indigo-800 hover:scale-110 transition-transform"
                                            title="Chỉnh sửa"
                                        >
                                            <EditIcon />
                                        </button>
                                        <button
                                            onClick={() => onDelete(banner._id)}
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

export default BannerTable;
