import { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { useModal } from '../../../hooks/useModal';
import { Pagination, showNotification, TableSkeleton } from '../../../components';
import PageMeta from '../../../components/common/PageMeta';
import PageBreadcrumb from '../../../components/common/PageBreadCrumb';
import { IAdmin } from '../../../interfaces/admin.interfaces';
import { apiAddAdmin, apiDeleteAdmin, apiGetAllAdmin, apiUpdateAdmin, apiSearchAdmin } from '../../../services/admin.service';
import EmployeeTable from './EmployeeTable';
import EmployeeModal from './EmployeeModal';
import InputSearch from '../../../components/item/inputSearch';
import NotExit from '../../../components/common/NotExit'; // Import NotExit component
import { useActionStore } from '../../../store/actionStore';

export default function EmployeeManage() {
    const [employees, setEmployees] = useState<IAdmin[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [totalPage, setTotalPage] = useState<number>(0);
    const [selectedEmployee, setSelectedAdmin] = useState<IAdmin | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>(''); // Ô tìm kiếm
    const [isSearching, setIsSearching] = useState<boolean>(false); // Trạng thái tìm kiếm
    const { openModal, isOpen, closeModal } = useModal();
    const { setIsLoading, isLoading } = useActionStore();

    // Fetch dữ liệu người dùng
    const fetchApi = async () => {
        const res = await apiGetAllAdmin();
        if (!res.success) return;
        const data = res.data;
        setEmployees(data.admins);
        setTotalPage(data.totalPage);
    };

    useEffect(() => {
        if (!isSearching) {
            fetchApi(); // Fetch dữ liệu bình thường nếu không tìm kiếm
        }
    }, [currentPage, isSearching]);

    // Thêm nhân viên mới
    const handleAdd = () => {
        setSelectedAdmin(null);
        openModal();
    };

    // Sửa thông tin nhân viên
    const handleEdit = (employee: IAdmin) => {
        setSelectedAdmin(employee);
        openModal();
    };

    // Lưu thông tin nhân viên
    const handleSave = async (data: IAdmin) => {
        let res;
        setIsLoading(true);
        if (data._id) {
            res = await apiUpdateAdmin(data._id, data);
        } else {
            res = await apiAddAdmin(data);
        }
        setIsLoading(false);
        showNotification(res?.message, res?.success);
        if (!res?.success) return;

        // Sau khi thành công, gọi lại API để làm mới danh sách nhân viên
        fetchApi();
        closeModal();
    };

    // Xóa nhân viên
    const handleDelete = async (id: string) => {
        if (!id || !confirm('Bạn có muốn xóa không?')) return;
        setIsLoading(true);
        const res = await apiDeleteAdmin(id);
        setIsLoading(false);
        if (res?.success) {
            setEmployees((prev) => prev.filter((item) => item._id !== id));
            showNotification('Xóa thành công', true);
        } else {
            showNotification(res?.message || 'Xóa thất bại', false);
        }
    };

    // Xử lý thay đổi ô tìm kiếm
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);
        if (value === '') {
            setIsSearching(false);
            fetchApi(); // Fetch lại dữ liệu khi ô tìm kiếm trống
        }
    };

    // Gửi API tìm kiếm
    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            showNotification('Vui lòng nhập từ khoá tìm kiếm', false);
            return;
        }
        setIsSearching(true);
        const res = await apiSearchAdmin(searchQuery.trim());
        if (res.success) {
            setEmployees(res.data); // Cập nhật danh sách nhân viên tìm được
            setTotalPage(0); // Không cần phân trang khi tìm kiếm
        } else {
            setEmployees([]); // Xóa danh sách nhân viên khi không tìm thấy kết quả
            setTotalPage(0);
            showNotification(res.message || 'Không tìm thấy nhân viên', false);
        }
    };

    if (isLoading) return <TableSkeleton />;

    return (
        <>
            <PageMeta title="Quản lý Nhân viên" />
            <PageBreadcrumb pageTitle="Nhân viên" />
            <div className="rounded-2xl border border-gray-200 bg-white px-5 py-2 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
                <div className="flex justify-between items-center mb-4">
                    {/* Thanh tìm kiếm */}
                    <InputSearch handleSearch={handleSearch} handleSearchChange={handleSearchChange} searchQuery={searchQuery} />
                    {/* Nút thêm nhân viên */}
                    <button
                        onClick={handleAdd}
                        className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto">
                        <AddIcon />
                        Thêm
                    </button>
                </div>

                {/* Danh sách nhân viên */}
                {employees.length > 0 ? (
                    <>
                        <EmployeeTable employees={employees} onEdit={handleEdit} onDelete={handleDelete} />
                        {!isSearching && totalPage > 1 && <Pagination currentPage={currentPage} totalPage={totalPage - 1} setCurrentPage={setCurrentPage} />}
                    </>
                ) : (
                    <NotExit label="Không có nhân viên nào" />
                )}
            </div>

            {/* Modal thêm/sửa nhân viên */}
            {isOpen && <EmployeeModal isOpen={isOpen} closeModal={closeModal} onSave={handleSave} employee={selectedEmployee} />}
        </>
    );
}
