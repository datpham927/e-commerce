/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import Avatar from './Avatar';
import useAdminStore from '../../../store/adminStore';
import { IAdmin } from '../../../interfaces/admin.interfaces';
import { apiUpdateProfileAmin } from '../../../services/admin.service';
import { ButtonOutline, InputForm, InputReadOnly, showNotification } from '../../../components';
import { useActionStore } from '../../../store/actionStore';

const AdminProfile: React.FC = () => {
    const [payload, setPayload] = useState<IAdmin>({} as IAdmin);
    const { admin, setAdmin } = useAdminStore();
    const { setIsLoading, mobile_ui } = useActionStore();

    useEffect(() => {
        setPayload(admin);
    }, [admin]);

    const handleOnChangeValue = (e: React.ChangeEvent<HTMLInputElement>, name_id: string): void => {
        setPayload((prevState) => ({ ...prevState, [name_id]: e.target.value }));
    };

    // Kiểm tra số điện thoại có hợp lệ không
    const isValidPhoneNumber = (phone: string): boolean => {
        const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
        return phoneRegex.test(phone);
    };

    const handleSummit = async () => {
        if (!isValidPhoneNumber(payload.admin_mobile)) {
            showNotification('Số điện thoại không hợp lệ', false);
            return;
        }

        setIsLoading(true); // Bắt đầu loading

        const res = await apiUpdateProfileAmin(payload);

        if (!res.success) {
            // Nếu API trả về lỗi, kiểm tra mã lỗi
            setIsLoading(false); // Dừng loading
            if (res.code === 203) {
                // Lỗi số điện thoại đã tồn tại
                showNotification('Số điện thoại đã tồn tại!', false);
            } else {
                // Nếu lỗi khác, thông báo chung
                showNotification('Cập nhật không thành công', false);
            }
            return;
        }

        setIsLoading(false); // Dừng loading
        setAdmin(res.data);
        showNotification('Cập nhật thành công', true);
    };

    return (
        <div className="tablet:fixed tablet:top-0 tablet:right-0 tablet:z-[1000] w-full h-full bg-white overflow-hidden p-4 laptop:rounded-lg tablet:overflow-y-scroll ">
            <div className="w-full mb-4">
                <h1 className="text-xl ">Hồ Sơ Của Tôi</h1>
                <span className="text-sm text-secondary ">Quản lý thông tin hồ sơ để bảo mật tài khoản</span>
            </div>
            <div className="flex tablet:flex-col tablet:gap-4 w-full py-10 border-solid border-t-[1px] border-slate-200">
                {mobile_ui && <Avatar setPayload={setPayload} payload={payload} />}
                <div className="flex flex-col justify-center items-center tablet:w-full w-1/2 gap-6">
                    <InputForm
                        label="Họ và tên"
                        name_id="admin_name"
                        value={payload?.admin_name}
                        handleOnchange={(e: any) => handleOnChangeValue(e, 'admin_name')}
                    />
                    <InputReadOnly label="Email" value={payload.admin_email} />
                    <InputForm
                        label="Số Điện Thoại"
                        name_id="admin_mobile"
                        value={payload.admin_mobile}
                        handleOnchange={(e: any) => handleOnChangeValue(e, 'admin_mobile')}
                    />
                    <ButtonOutline className="mx-auto px-6 text-white bg-primary" onClick={handleSummit}>
                        Cập nhật
                    </ButtonOutline>
                </div>
                {!mobile_ui && (
                    <div className="flex flex-col  w-1/2 items-center gap-4 ">
                        <Avatar setPayload={setPayload} payload={payload} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminProfile;
