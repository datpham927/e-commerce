import { useState } from 'react';

interface TabsTableProps {
    newUsers: any[];
    potentialCustomers: any[];
}

const TAB_LIST = [
    { tab: 'new_users', title: 'Khách hàng mới' },
    { tab: 'potential_customers', title: 'Khách hàng tiềm năng' },
];

export default function TabsTable({ newUsers, potentialCustomers }: TabsTableProps) {
    const [selectedTab, setSelectedTab] = useState<string>('new_users');

    const renderTable = () => {
        if (selectedTab === 'new_users') {
            return (
                <div className="overflow-x-auto bg-white p-6 rounded-xl shadow-lg dark:border-white/[0.05] dark:bg-white/[0.03]">
                    <table className="min-w-full table-auto text-left">
                        <thead className="bg-gray-100 dark:bg-gray-700">
                            <tr>
                                <th className="px-4 py-2 text-gray-800 dark:text-white">Tên người dùng</th>
                                <th className="px-4 py-2 text-gray-800 dark:text-white">Email</th>
                                <th className="px-4 py-2 text-gray-800 dark:text-white">Số điện thoại</th>
                                <th className="px-4 py-2 text-gray-800 dark:text-white">Ngày tạo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {newUsers.map((user) => (
                                <tr key={user._id} className="border-t border-gray-200 dark:border-gray-600">
                                    <td className="px-4 py-2 text-gray-800 dark:text-white">{user.user_name}</td>
                                    <td className="px-4 py-2 text-gray-800 dark:text-white">{user.user_email}</td>
                                    <td className="px-4 py-2 text-gray-800 dark:text-white">{user.user_mobile}</td>
                                    <td className="px-4 py-2 text-gray-800 dark:text-white">{new Date(user.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
        } else if (selectedTab === 'potential_customers') {
            // Sắp xếp khách hàng tiềm năng theo số đơn hàng đã mua, từ nhiều đến ít
            const sortedPotentialCustomers = potentialCustomers.sort((a, b) => b.totalOrders - a.totalOrders);

            return (
                <div className="overflow-x-auto bg-white p-6 rounded-xl shadow-lg dark:border-white/[0.05] dark:bg-white/[0.03]">
                    <table className="min-w-full table-auto text-left">
                        <thead className="bg-gray-100 dark:bg-gray-700">
                            <tr>
                                <th className="px-4 py-2 text-gray-800 dark:text-white">Tên người dùng</th>
                                <th className="px-4 py-2 text-gray-800 dark:text-white">Email</th>
                                <th className="px-4 py-2 text-gray-800 dark:text-white">Số điện thoại</th>
                                <th className="px-4 py-2 text-gray-800 dark:text-white">Số đơn hàng đã mua</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedPotentialCustomers.map((user) => (
                                <tr key={user._id} className="border-t border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                                    <td className="px-4 py-2 text-gray-800 dark:text-white">{user.user_name}</td>
                                    <td className="px-4 py-2 text-gray-800 dark:text-white">{user.user_email}</td>
                                    <td className="px-4 py-2 text-gray-800 dark:text-white">{user.user_mobile}</td>
                                    <td className="px-4 py-2 text-gray-800 dark:text-white">{user.totalOrders}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
        }
    };

    return (
        <div>
            <div className="flex mb-6 space-x-4">
                {TAB_LIST.map((tabItem) => (
                    <button
                        key={tabItem.tab}
                        className={`px-4 py-2 rounded-md font-semibold transition-all duration-300 ease-in-out ${
                            selectedTab === tabItem.tab ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-blue-500 hover:text-white'
                        }`}
                        onClick={() => setSelectedTab(tabItem.tab)}
                    >
                        {tabItem.title}
                    </button>
                ))}
            </div>

            {renderTable()}
        </div>
    );
}
