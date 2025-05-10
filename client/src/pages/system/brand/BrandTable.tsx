import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { IBrand } from '../../../interfaces/brand.interfaces';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../../../components/ui/table';

interface BrandListProps {
    brands: IBrand[];
    onEdit: (brand: IBrand) => void;
    onDelete: (id: string) => void;
}

const BrandTable: React.FC<BrandListProps> = ({ brands, onEdit, onDelete }) => {
    return (
        <div className="overflow-hidden rounded-xl my-6 border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800">
            <div className="w-full overflow-x-auto">
                <Table className="min-w-full">
                    {/* Table Header */}
                    <TableHeader className="bg-gray-100 dark:bg-gray-700">
                        <TableRow>
                            <TableCell isHeader className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-200">
                                Tên thương hiệu
                            </TableCell>
                            <TableCell isHeader className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-200">
                                Banner
                            </TableCell>
                            <TableCell isHeader className="px-6 py-4 text-center text-sm font-semibold text-gray-600 dark:text-gray-200">
                                Thao tác
                            </TableCell>
                        </TableRow>
                    </TableHeader>

                    {/* Table Body */}
                    <TableBody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {brands?.map((brand) => (
                            <TableRow key={brand._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                                <TableCell className="px-6 py-4 text-gray-800 dark:text-gray-100 font-medium">
                                    {brand.brand_name}
                                </TableCell>
                                <TableCell className="px-6 py-4">
                                    <div className="w-[120px] h-[60px] overflow-hidden rounded-lg shadow-sm border border-gray-200">
                                        <img
                                            src={brand.brand_banner}
                                            alt={brand.brand_name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </TableCell>
                                <TableCell className="px-6 py-4">
                                    <div className="flex justify-center items-center gap-4">
                                        <button
                                            onClick={() => onEdit(brand)}
                                            className="text-indigo-600 hover:text-indigo-800 transition-transform hover:scale-110"
                                            title="Chỉnh sửa"
                                        >
                                            <EditIcon />
                                        </button>
                                        <button
                                            onClick={() => onDelete(brand._id)}
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

export default BrandTable;
