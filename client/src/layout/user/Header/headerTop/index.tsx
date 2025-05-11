import React from 'react';
import Notification from './Notification';
import User from './User';
import Cart from '../../../../components/cart';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { useActionStore } from '../../../../store/actionStore';
const HeaderTop: React.FC = () => {
    const { mobile_ui } = useActionStore();
    return (
        <div className="flex w-full justify-between items-center py-[6px] px-6  ">
            <div className="flex gap-1 text-white text-sm">
                <MailOutlineIcon fontSize="small" />
                <span>support@bachhoaxanh.com</span>
            </div>
            <div className="flex items-center gap-6 ">
                <Notification />
                {mobile_ui ? <Cart /> : <User />}
            </div>
        </div>
    );
};

export default HeaderTop;
