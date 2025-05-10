import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageMeta from '../../../components/common/PageMeta';
import PageBreadcrumb from '../../../components/common/PageBreadCrumb';
import { apiGetDashboardStats } from '../../../services/dashboard.service';
import { apiGetNewUsers, apiGetPotentialCustomers } from '../../../services/dashboard.service'; // Thêm import
import { DashboardData } from '../../../interfaces/dashboard.interface';
import { DashboardSkeleton } from '../../../components';
import StatsOverview from './StatsOverview';
import RevenueChart from './RevenueChart';
import TopSellingProducts from './TopSellingProducts';
import TabsTable from './TabsTable'; // Import TabsTable component

export default function DashboardManage() {
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [newUsers, setNewUsers] = useState<any[]>([]); // Để lưu trữ dữ liệu người dùng mới
    const [potentialCustomers, setPotentialCustomers] = useState<any[]>([]); // Để lưu trữ dữ liệu khách hàng tiềm năng
    const [viewType, setViewType] = useState<'day' | 'month'>('day');
    const [showTooltip, setShowTooltip] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const resDashboard = await apiGetDashboardStats();
            if (resDashboard.success) {
                setDashboardData(resDashboard.data);
            }

            const resNewUsers = await apiGetNewUsers();
            if (resNewUsers.success) {
                setNewUsers(resNewUsers.users);
            }

            const resPotentialCustomers = await apiGetPotentialCustomers();
            if (resPotentialCustomers.success) {
                setPotentialCustomers(resPotentialCustomers.users);
            }
        };

        fetchData();
    }, []);

    if (!dashboardData) return <DashboardSkeleton />;

    return (
        <>
            <PageMeta title="Tổng quan hệ thống" />
            <PageBreadcrumb pageTitle="Dashboard" />

            {/* Thống kê tổng quan */}
            <StatsOverview
                stats={dashboardData.stats}
                onProductClick={() => navigate('/quan-ly/san-pham')}
                onUserClick={() => navigate ('/quan-ly/nguoi-dung')}
                onOrderClick={() => navigate('/quan-ly/don-hang')}
                onOrderoffClick={() => navigate('/quan-ly/hoa-don')}
                onReviewClick={() => navigate('/quan-ly/danh-gia')}
                onRevenueMouseEnter={() => setShowTooltip(true)}
                onRevenueMouseLeave={() => setShowTooltip(false)}
                showTooltip={showTooltip}
                revenuePerMonth={dashboardData.revenuePerMonth}
            />

            {/* Doanh thu theo ngày/tháng */}
            <RevenueChart
                viewType={viewType}
                onViewChange={setViewType}
                revenuePerDay={dashboardData.revenuePerDay}
                revenuePerMonth={dashboardData.revenuePerMonth}
                offlineRevenuePerDay={dashboardData.offlineRevenuePerDay}
                offlineRevenuePerMonth={dashboardData.offlineRevenuePerMonth}
            />

            {/* Top 5 sản phẩm bán chạy */}
            <TopSellingProducts topSellingProducts={dashboardData.topSellingProducts} />
            <div className="mb-8"></div> 

            {/* Tab New Users và Potential Customers */}
            <TabsTable newUsers={newUsers} potentialCustomers={potentialCustomers} />
        </>
    );
}
