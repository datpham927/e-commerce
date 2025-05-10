import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../../../components/ui/table';
import { IRole } from '../../../interfaces/role.interfaces';

interface RoleListProps {
    roles: IRole[];
    onEdit: (role: IRole) => void;
    onDelete: (id: string) => void;
}

const RoleTable: React.FC<RoleListProps> = ({ roles, onEdit, onDelete }) => {
    return (
        <div className="overflow-hidden rounded-xl my-6 border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800">
            <div className="w-full overflow-x-auto">
                <Table>
                    <TableHeader className="bg-gray-100 dark:bg-gray-700">
                        <TableRow>
                            <TableCell
                                isHeader
                                className="px-6 py-4 font-semibold text-gray-700 dark:text-white text-center"
                            >
                                Tên vai trò
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-6 py-4 font-semibold text-gray-700 dark:text-white text-center"
                            >
                                Thao tác
                            </TableCell>
                        </TableRow>
                    </TableHeader>

                    <TableBody className="divide-y divide-gray-200 dark:divide-gray-600">
                        {roles?.map((role) => (
                            <TableRow key={role._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                                <TableCell className="px-6 py-4 text-center text-gray-900 dark:text-gray-100 font-medium">
                                    {role.role_name}
                                </TableCell>
                                <TableCell className="px-6 py-4 text-center">
                                    <div className="flex justify-center gap-3">
                                        <button
                                            onClick={() => onEdit(role)}
                                            className="text-blue-600 hover:text-blue-800 hover:scale-110 transition-transform"
                                            title="Chỉnh sửa"
                                        >
                                            <EditIcon />
                                        </button>
                                        <button
                                            onClick={() => onDelete(role._id)}
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

export default RoleTable;
