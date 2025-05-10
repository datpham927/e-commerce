interface TopSellingProductsProps {
    topSellingProducts: any[];
}

export default function TopSellingProducts({ topSellingProducts }: TopSellingProductsProps) {
    return (
        <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Top 5 sản phẩm bán chạy</h3>
            <div className="overflow-x-auto bg-white p-6 rounded-xl shadow-lg dark:border-white/[0.05] dark:bg-white/[0.03]">
                <table className="min-w-full table-auto text-left">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                        <tr>
                            <th className="px-4 py-2 text-gray-800 dark:text-white">Top</th>
                            <th className="px-4 py-2 text-gray-800 dark:text-white">Tên sản phẩm</th>
                            <th className="px-4 py-2 text-gray-800 dark:text-white">Số lượng bán</th>
                        </tr>
                    </thead>
                    <tbody>
                        {topSellingProducts.slice(0, 5).map((product, index) => (
                            <tr key={product._id} className="border-t border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                                <td className="px-4 py-2 text-gray-800 dark:text-white">
                                    {index === 0 ? (
                                        <span className="text-yellow-500">🥇</span>
                                    ) : index === 1 ? (
                                        <span className="text-gray-400">🥈</span>
                                    ) : index === 2 ? (
                                        <span className="text-orange-500">🥉</span>
                                    ) : (
                                        index + 1
                                    )}
                                </td>
                                <td className="px-4 py-2 text-gray-800 dark:text-white">{product.product_name}</td>
                                <td className="px-4 py-2 text-gray-800 dark:text-white">{product.product_sold}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
