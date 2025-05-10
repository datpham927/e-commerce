import React, { memo, useEffect } from 'react';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { useNavigate } from 'react-router-dom';
import { apiGetCartByUserId } from '../../services/cart.service';
import { useCartStore } from '../../store/cartStore';
import useAuthStore from '../../store/authStore';
import { PATH } from '../../utils/const';
import { useActionStore } from '../../store/actionStore';

// eslint-disable-next-line react-refresh/only-export-components
const Cart: React.FC = () => {
    const navigate = useNavigate();
    const { isUserLoggedIn } = useAuthStore();
    const { setAddProductInCartFromApi, productInCart } = useCartStore();
    const { setOpenFeatureAuth } = useActionStore();

    useEffect(() => {
        if (!isUserLoggedIn) return;
        const fetchApi = async () => {
            const res = await apiGetCartByUserId();
            if (!res.success) return;
            if (res.data.cart_products?.length > 0) {
                setAddProductInCartFromApi(res.data.cart_products);
            }
        };
        fetchApi();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isUserLoggedIn]);

    return (
        <div className="flex laptop:w-2/12 laptop:h-search items-center justify-center pr-2">
            <div
                className="flex relative text-white cursor-pointer"
                onClick={() => {
                    if (isUserLoggedIn) {
                        navigate(PATH.PAGE_CART);
                    } else setOpenFeatureAuth(true);
                }}>
                {/* Cập nhật biểu tượng giỏ hàng với fontSize="large" */}
                <ShoppingCartOutlinedIcon style={{ fontSize: 30 }} /> {/* Hoặc dùng fontSize="large" */}
                <div className="absolute text-[13px] px-[5px] py-[1] rounded-[50%] bottom-2 right-[-8px] h-fit bg-[#A769FD]">
                    {productInCart?.length > 10 ? '9+' : productInCart?.length || 0}
                </div>
            </div>
        </div>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export default memo(Cart);
