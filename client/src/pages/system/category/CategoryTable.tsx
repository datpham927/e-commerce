import { ICategory } from '../../../interfaces/category.interfaces';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { TableRow, Table, TableBody, TableCell, TableHeader } from '../../../components/ui/table';

interface CategoryListProps {
    categories: ICategory[];
    onEdit: (category: ICategory) => void;
    onDelete: (id: string) => void;
}

const CategoryTable: React.FC<CategoryListProps> = ({ categories, onEdit, onDelete }) => {
    return (
        <div className="overflow-hidden rounded-xl my-6 border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800">
            <div className="w-full overflow-x-auto">
                <Table className="min-w-full">
                    {/* Header */}
                    <TableHeader className="bg-gray-100 dark:bg-gray-700">
                        <TableRow>
                            <TableCell isHeader className="px-6 py-4 text-sm font-semibold text-gray-700 dark:text-white">
                                Mã danh mục
                            </TableCell>
                            <TableCell isHeader className="px-6 py-4 text-sm font-semibold text-gray-700 dark:text-white">
                                Tên danh mục
                            </TableCell>
                            <TableCell isHeader className="px-6 py-4 text-sm font-semibold text-gray-700 dark:text-white text-center">
                                Hình ảnh
                            </TableCell>
                            <TableCell isHeader className="px-6 py-4 text-sm font-semibold text-gray-700 dark:text-white text-center">
                                Thao tác
                            </TableCell>
                        </TableRow>
                    </TableHeader>

                    {/* Body */}
                    <TableBody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {categories.map((c) => (
                            <TableRow key={c._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                                <TableCell className="px-6 py-4 text-gray-800 dark:text-gray-100 font-medium">
                                    {c.category_code}
                                </TableCell>
                                <TableCell className="px-6 py-4 text-gray-800 dark:text-gray-100">
                                    <div className="truncate w-[220px] font-medium">{c.category_name}</div>
                                </TableCell>
                                <TableCell className="px-6 py-4">
                                    <div className="w-20 h-20 mx-auto overflow-hidden rounded-lg border border-gray-300 dark:border-gray-600 shadow-md">
                                        <img
                                            src={c.category_thumb}
                                            alt={c.category_name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </TableCell>
                                <TableCell className="px-6 py-4">
                                    <div className="flex justify-center gap-4">
                                        <button
                                            onClick={() => onEdit(c)}
                                            className="text-indigo-600 hover:text-indigo-800 transition-transform hover:scale-110"
                                            title="Chỉnh sửa"
                                        >
                                            <EditIcon />
                                        </button>
                                        <button
                                            onClick={() => onDelete(c._id)}
                                            className="text-red-500 hover:text-red-700 transition-transform hover:scale-110"
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

export default CategoryTable;
