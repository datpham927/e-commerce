/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useEffect } from 'react';

// Import dịch vụ và store cần thiết
import { apiGetAllCategories } from '../../../services/category.service';
import { useCategoriesStore } from '../../../store/categoryStore';
import { apiGetAllBrands } from '../../../services/brand.service';
import { useBrandsStore } from '../../../store/brandStore';
import HeaderTop from './headerTop';
import HeaderBottom from './headerBottom';
import { useLocation } from 'react-router';
import { PATH } from '../../../utils/const';

const Header: React.FC = () => {
    const { setCategories } = useCategoriesStore();
    const { setBrands } = useBrandsStore();

    useEffect(() => {
        const fetchCategory = async () => {
            const resCategory = await apiGetAllCategories();
            const resBrand = await apiGetAllBrands();
            const dataCategory = resCategory?.data;
            const dataBrand = resBrand?.data;
            if (resCategory.success && dataCategory.length > 0) setCategories(dataCategory);
            if (resBrand.success && dataBrand.length > 0) setBrands(dataBrand);
        };
        fetchCategory();
    }, [setCategories, setBrands]);
    const location = useLocation();
    return (
        <header className="w-full tablet:px-0 px-4  bg-gradient-to-r from-blue-500 to-green-500 tablet:bg-transparent tablet:bg-[url(https://salt.tikicdn.com/ts/banner/0f/65/5a/cc78315d8fe4d78ac876e8f9005a5cbb.png)] tablet:pb-2 transition-all ease-in-out duration-300">
            <div className="w-full h-full flex flex-col items-center max-w-[1280px] mx-auto">
                <HeaderTop />
                {!location.pathname.includes(PATH.PAGE_PAYMENT) && !location.pathname.includes(PATH.PAGE_PAYMENT_CONFIRM) && <HeaderBottom />}
            </div>
        </header>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export default memo(Header);
