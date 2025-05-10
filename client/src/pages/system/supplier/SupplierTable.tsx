import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../../../components/ui/table';
import { ISupplier } from '../../../interfaces/supplier.interfaces';

interface SupplierListProps {
    suppliers: ISupplier[];
    onEdit: (supplier: ISupplier) => void;
    onDelete: (id: any) => void;
}

const SupplierTable: React.FC<SupplierListProps> = ({ suppliers, onEdit, onDelete }) => {
    return (
        <div className="overflow-hidden rounded-xl my-6 border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800">
            <div className="w-full overflow-x-auto">
                <Table>
                    <TableHeader className="bg-gray-100 dark:bg-gray-700">
                        <TableRow>
                            <TableCell isHeader className="px-6 py-4 font-semibold text-gray-700 dark:text-white">Tên nhà cung cấp</TableCell>
                            <TableCell isHeader className="px-6 py-4 font-semibold text-gray-700 dark:text-white">Số điện thoại</TableCell>
                            <TableCell isHeader className="px-6 py-4 font-semibold text-gray-700 dark:text-white text-center">Email</TableCell>
                            <TableCell isHeader className="px-6 py-4 font-semibold text-gray-700 dark:text-white text-center">Địa chỉ</TableCell>
                            <TableCell isHeader className="px-6 py-4 font-semibold text-gray-700 dark:text-white text-center">Thao tác</TableCell>
                        </TableRow>
                    </TableHeader>

                    <TableBody className="divide-y divide-gray-200 dark:divide-gray-600">
                        {suppliers?.map((c) => (
                            <TableRow key={c._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                                <TableCell className="px-6 py-4 text-gray-900 dark:text-gray-100 font-medium">
                                    {c.supplier_name}
                                </TableCell>
                                <TableCell className="px-6 py-4 text-gray-800 dark:text-gray-200">
                                    {c.supplier_phone}
                                </TableCell>
                                <TableCell className="px-6 py-4 text-gray-800 dark:text-gray-200 text-center">
                                    <span className="block truncate max-w-[180px]">{c.supplier_email}</span>
                                </TableCell>
                                <TableCell className="px-6 py-4 text-gray-800 dark:text-gray-200 text-center">
                                    {c.supplier_address}
                                </TableCell>
                                <TableCell className="px-6 py-4 text-center">
                                    <div className="flex justify-center gap-3">
                                        <button
                                            onClick={() => onEdit(c)}
                                            className="text-indigo-600 hover:text-indigo-800 hover:scale-110 transition-transform"
                                            title="Chỉnh sửa"
                                        >
                                            <EditIcon />
                                        </button>
                                        <button
                                            onClick={() => onDelete(c._id)}
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

export default SupplierTable;
