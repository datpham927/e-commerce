/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { useNavigate } from 'react-router-dom'; // Thêm dòng này
import { NotFound } from '../../../../components';
import useUserVoucherStore from '../../../../store/userVoucherStore';
import { formatMoney } from '../../../../utils/formatMoney';
import { calculateVoucherStatus } from '../../../../utils/calculateVoucherStatus';

const UserVoucherPage: React.FC = () => {
    const { userVouchers } = useUserVoucherStore();
    const navigate = useNavigate(); // Khởi tạo navigate
    const isVoucherExpired = (endDate: any) => {
        return new Date(endDate) < new Date();
    };

    const handleUseVoucher = () => {
        navigate('/gio-hang');
    };

    return (
        <div className="tablet:fixed tablet:top-0 tablet:right-0 tablet:z-[1000] w-full h-full bg-white overflow-hidden p-4 laptop:rounded-lg tablet:overflow-y-scroll">
            <div className="w-full mb-4">
                <h1 className="text-2xl font-bold text-primary mb-6 text-center">Danh sách voucher</h1>
                <div className="flex flex-col bg-white pb-8 gap-10 z-0">
                    {userVouchers?.length > 0 ? (
                        <div className="grid tablet:grid-cols-1 grid-cols-2 gap-6">
                            {userVouchers.map((voucher) => {
                                const expired = isVoucherExpired(voucher.voucher_end_date);
                                return (
                                    <div
                                        key={voucher._id}
                                        className={`relative flex items-stretch border rounded-xl shadow-sm bg-white transition-all duration-300 hover:shadow-md ${
                                            expired ? 'opacity-60 bg-gray-100' : 'hover:scale-[1.02]'
                                        }`}>
                                        {/* Left Section: Logo and Category */}
                                        <div className="border-l-4 border-dashed border-green-500 p-2 rounded-l-md">
                                            <img src={voucher.voucher_thumb} className="w-32 rounded-md" />
                                        </div>
                                        {/* Right Section: Voucher Details */}
                                        <div className="flex-1 p-4 flex flex-col justify-between">
                                            <div>
                                                <span className="block text-base font-semibold text-gray-800 md:text-lg leading-6">
                                                    {voucher.voucher_name} - Giảm {formatMoney(voucher.voucher_max_price ?? voucher.voucher_value)}
                                                </span>
                                                <span className="block text-sm text-gray-600 mt-1">
                                                    Đơn tối thiểu {formatMoney(voucher.voucher_min_order_value)}
                                                </span>

                                                {/* Voucher Code */}
                                                <span className="block text-sm text-gray-600 mt-1">
                                                    Mã voucher: <strong>{voucher.voucher_code}</strong>
                                                </span>
                                                <span
                                                    className={`block text-base mt-1 font-semibold ${
                                                        calculateVoucherStatus(voucher).includes('Sắp hết hạn')
                                                            ? 'text-primary'
                                                            : calculateVoucherStatus(voucher).includes('Còn hiệu lực')
                                                            ? 'text-green-600'
                                                            : 'text-gray-600'
                                                    }`}>
                                                    {calculateVoucherStatus(voucher)}
                                                </span>
                                            </div>

                                            {/* Button "Dùng ngay" */}
                                            <div className="flex justify-end mt-4">
                                                <button
                                                    disabled={expired}
                                                    onClick={handleUseVoucher} // Bấm là chuyển sang /gio-hang
                                                    className={`px-4 py-2 rounded-full text-sm font-semibold ${
                                                        expired ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-primary text-white transition-colors'
                                                    }`}>
                                                    Dùng ngay
                                                </button>
                                            </div>
                                        </div>

                                        {/* Expired Label */}
                                        {expired && (
                                            <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                                                Hết hạn
                                            </span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <NotFound>Không tìm thấy voucher nào</NotFound>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserVoucherPage;
