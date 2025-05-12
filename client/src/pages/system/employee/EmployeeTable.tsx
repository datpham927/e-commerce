/* eslint-disable @typescript-eslint/no-explicit-any */
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../../../components/ui/table';
import { IAdmin } from '../../../interfaces/admin.interfaces';
import { LogoAdmin } from '../../../assets';

interface EmployeeListProps {
    employees: IAdmin[];
    onEdit: (employee: IAdmin) => void;
    onDelete: (id: string | any) => void;
}

const EmployeeTable: React.FC<EmployeeListProps> = ({ employees, onEdit, onDelete }) => {
    return (
        <div className="overflow-hidden rounded-xl my-6 border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800">
            <div className="w-full overflow-x-auto">
                <Table>
                    <TableHeader className="bg-gray-100 dark:bg-gray-700">
                        <TableRow>
                            <TableCell isHeader className="px-6 py-4 font-medium text-gray-700 dark:text-white">
                                Tên nhân viên
                            </TableCell>
                            <TableCell isHeader className="px-6 py-4 font-medium text-gray-700 dark:text-white">
                                Ảnh đại diện
                            </TableCell>
                            <TableCell isHeader className="px-6 py-4 font-medium text-gray-700 dark:text-white">
                                Vai trò
                            </TableCell>
                            <TableCell isHeader className="px-6 py-4 font-medium text-gray-700 dark:text-white">
                                SĐT
                            </TableCell>
                            <TableCell isHeader className="px-6 py-4 font-medium text-gray-700 dark:text-white text-center">
                                Email
                            </TableCell>
                            <TableCell isHeader className="px-6 py-4 font-medium text-gray-700 dark:text-white text-center">
                                Thao tác
                            </TableCell>
                        </TableRow>
                    </TableHeader>

                    <TableBody className="divide-y divide-gray-200 dark:divide-gray-600">
                        {employees?.map((c) => (
                            <TableRow key={c._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                                <TableCell className="px-6 py-4 text-gray-900 dark:text-gray-100 ">{c.admin_name}</TableCell>
                                <TableCell className="px-6 py-4">
                                    <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-300 dark:border-gray-600 shadow">
                                        <img src={c?.admin_avatar_url || LogoAdmin} alt={c.admin_name} className="w-full h-full object-cover" />
                                    </div>
                                </TableCell>
                                <TableCell className="px-6 py-4 text-gray-800 dark:text-gray-200">
                                    {c?.roles?.map((role: any, index: any) => (
                                        <span
                                            key={index}
                                            className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium dark:bg-gray-600 dark:text-white">
                                            {role}
                                            {index < c?.roles?.length - 1 && ', '}
                                        </span>
                                    ))}
                                </TableCell>
                                <TableCell className="px-6 py-4 text-gray-800 dark:text-gray-200">{c.admin_mobile}</TableCell>
                                <TableCell className="px-6 py-4 text-center text-gray-800 dark:text-gray-200">
                                    <span className="block truncate max-w-[180px]">{c.admin_email}</span>
                                </TableCell>
                                <TableCell className="px-6 py-4 text-center">
                                    <div className="flex justify-center gap-3">
                                        <button
                                            onClick={() => onEdit(c)}
                                            className="text-indigo-600 hover:text-indigo-800 hover:scale-110 transition-transform"
                                            title="Chỉnh sửa">
                                            <EditIcon />
                                        </button>
                                        <button
                                            onClick={() => onDelete(c._id)}
                                            className="text-red-500 hover:text-red-700 hover:scale-110 transition-transform"
                                            title="Xóa">
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

export default EmployeeTable;
