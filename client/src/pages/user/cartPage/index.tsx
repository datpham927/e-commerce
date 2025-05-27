import React, { useMemo } from 'react';
import { imgCartEmpty } from '../../../assets';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../../store/cartStore';
import Seo from '../../../components/seo';
import ButtonOutline from '../../../components/buttonOutline';
import { PATH } from '../../../utils/const';
import { formatMoney } from '../../../utils/formatMoney';
import useUserStore from '../../../store/userStore';
import { showNotification } from '../../../components';
import ProductList from './ProductList';

const CartPage: React.FC = () => {
    const { productInCart } = useCartStore();
    const { selectedProducts } = useCartStore();
    const { user } = useUserStore();
    const navigate = useNavigate();
    const totalPriceMemo = useMemo(() => {
        const result = selectedProducts.reduce((total, e) => {
            return total + e?.product_discounted_price * e.quantity;
        }, 0);
        return result;
    }, [selectedProducts]);

    const handleBuyProducts = () => {
        const hasAddressInfo =
            user?.user_name &&
            user?.user_mobile &&
            user?.user_address?.detail &&
            user?.user_address?.city &&
            user?.user_address?.district &&
            user?.user_address?.village;
        if (hasAddressInfo) {
            if (selectedProducts?.length === 0) {
                showNotification('Vui lòng chọn sản phẩm!');
                return;
            }
            navigate(PATH.PAGE_PAYMENT);
        } else {
            if (confirm('Vui lòng cập nhật lại thông tin!')) {
                navigate(PATH.PAGE_PROFILE);
            }
        }
    };
    if (productInCart?.length === 0) {
        return (
            <div className="flex flex-col items-center w-full h-screen py-6 bg-white rounded-md my-4">
                <img src={imgCartEmpty} className="w-[190px] h-[160px]" />
                <h3 className="text-base text-secondary my-2">Không có sản phẩm nào trong giỏ hàng của bạn.</h3>
                <ButtonOutline className="mt-2 px-8" onClick={() => navigate(PATH.HOME)}>
                    Tiếp tục mua sắm
                </ButtonOutline>
            </div>
        );
    }
    return (
        <div className="w-full h-full">
            <Seo description="Shop bách hóa" title="Bánh Hóa Xanh" key={2} />
            <h1 className="py-4 text-2xl">Giỏ hàng</h1>
            <div className="flex  flex-col pb-8 gap-2">
                <ProductList />
                <div className="sticky flex justify-center bottom-0 z-10 w-full bg-white shadow-[0_-6px_10px_0_rgba(0,0,0,0.15)]">
                    <div className="flex w-1/2 flex-col gap-3 py-2 px-5top-0 left-0">
                        <div className="bg-white px-3 rounded-md overflow-hidden">
                            <div className="flex flex-col border-solid border-b-[1px] border-neutral-200 py-3">
                                <div className="flex justify-between items-center ">
                                    <span className="text-secondary text-sm">Tổng cộng sản phẩm</span>
                                    <span className="text-primary cursor-pointer">{selectedProducts.length} sản phẩm</span>
                                </div>
                                <div className="flex justify-between items-center ">
                                    <span className="text-secondary text-sm">Tạm Tính</span>
                                    <span>{formatMoney(totalPriceMemo)}</span>
                                </div>
                            </div>
                        </div>
                        <ButtonOutline className="py-3 bg-red_custom border-none text-white mt-2" onClick={handleBuyProducts}>
                            Mua hàng
                        </ButtonOutline>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
