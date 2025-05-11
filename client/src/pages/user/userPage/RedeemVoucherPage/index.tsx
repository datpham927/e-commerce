/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { NotFound, showNotification } from '../../../../components';
import { IVoucher } from '../../../../interfaces/voucher.interfaces';
import { getAllRedeemVouchers } from '../../../../services/voucher.service';
import Pagination from '../../../../components/pagination';
import RedeemVoucherItem from '../../../../components/item/RedeemVoucherItem';
import useUserVoucherStore from '../../../../store/userVoucherStore';
import { apiRedeemVoucher } from '../../../../services/user.voucher.service';
import useUserStore from '../../../../store/userStore';
import { useActionStore } from '../../../../store/actionStore';

const RedeemVoucherPage: React.FC = () => {
    const [redeemVouchers, setRedeemVoucher] = useState<IVoucher[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [totalPage, setTotalPage] = useState<number>(0);
    const { userVouchers, setUserVouchers } = useUserVoucherStore();
    const { user, setSubtractRewardPoints } = useUserStore();
    const { setIsLoading } = useActionStore();
    useEffect(() => {
        const fetchApiDetailUser = async () => {
            const res = await getAllRedeemVouchers({ limit: 6, page: currentPage });
            if (!res.success) return;
            const data = res.data;
            setRedeemVoucher(data.vouchers);
            setTotalPage(data.totalPage);
        };
        fetchApiDetailUser();
    }, []);
    const handleRedeemVoucher = async (voucher: IVoucher) => {
        if (!confirm('bạn có muốn đổi phiếu giảm giá này không')) return;
        setIsLoading(true);
        const res = await apiRedeemVoucher(voucher._id);
        setSubtractRewardPoints(voucher.voucher_required_points);
        showNotification(res.message, res.success);
        if (res.success) setUserVouchers(res.data.vc_vouchers);
        setIsLoading(false);
    };

    return (
        <div className="tablet:fixed tablet:top-0 tablet:right-0 tablet:z-[1000] w-full h-full bg-white overflow-hidden p-4 laptop:rounded-lg tablet:overflow-y-scroll">
            <div className="w-full mb-4">
                <h1 className="text-2xl font-bold text-primary mb-6 text-center">Danh sách voucher</h1>
                <div className="flex flex-col bg-white pb-8 gap-10 z-0">
                    {redeemVouchers?.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 gap-6">
                                {redeemVouchers.map((voucher) => (
                                    <RedeemVoucherItem
                                        key={voucher._id}
                                        handleRedeemVoucher={handleRedeemVoucher}
                                        userOwnedVouchers={userVouchers?.map((e) => e._id)}
                                        voucher={voucher}
                                        userPoints={user.user_reward_points}
                                    />
                                ))}
                            </div>
                            {totalPage > 1 && <Pagination currentPage={currentPage} totalPage={totalPage - 1} setCurrentPage={setCurrentPage} />}
                        </>
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

export default RedeemVoucherPage;
