import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { v4 as uuidv4 } from 'uuid';
import { IProductItem } from '../../../../interfaces/product.interfaces';
import { apiProductRecommendations } from '../../../../services/product.service';
import ProductItem from '../../../../components/item/ProductItem';
import useAuthStore from '../../../../store/authStore';

const ProductRecommendation: React.FC = () => {
    const [products, setProducts] = useState<IProductItem[]>([]);
    const { isUserLoggedIn } = useAuthStore();
    useEffect(() => {
        if (!isUserLoggedIn) return;
        const fetchProducts = async () => {
            const res = await apiProductRecommendations();
            if (res.success) setProducts(res.data);
        };
        fetchProducts();
    }, [isUserLoggedIn]);
    if (!isUserLoggedIn || products?.length === 0) return <></>;
    return (
        <>
            {products?.length > 0 && (
                <div className="relative flex flex-col w-full h-auto py-3 pt-6 px-4 bg-white rounded-md  gap-4">
                    <div className="absolute left-1/2 top-[-16px] z-[1] flex w-max min-w-[272px] -translate-x-1/2 items-center justify-center">
                        <p className="relative flex min-h-[34px] w-full items-center justify-center rounded-b-[8px] border-[1px]  border-solid   border-primary px-[7px] py-1 text-16 font-bold uppercase leading-[18px] before:absolute before:left-[-9px] before:top-[-1px] before:border-r-[9px] before:border-t-[16px] before:border-r-primary before:border-t-transparent after:absolute after:right-[-9px] after:top-[-1px] after:border-l-[9px] after:border-t-[16px] after:border-l-primary after:border-t-transparent  bg-primary text-white">
                            Sản phẩm bạn quan tâm
                        </p>
                    </div>
                    <div className="relative">
                        <Swiper
                            loop={false}
                            allowTouchMove={false}
                            slidesPerGroup={3}
                            navigation={true}
                            modules={[Navigation]}
                            className="mySwiper"
                            breakpoints={{
                                1: {
                                    slidesPerView: 2,
                                    slidesPerGroup: 1,
                                    allowTouchMove: true,
                                },
                                740: {
                                    slidesPerView: 4,
                                    slidesPerGroup: 2,
                                },
                                1024: {
                                    slidesPerView: 6,
                                    slidesPerGroup: 3,
                                },
                            }}>
                            {products?.map((p) => {
                                return (
                                    <SwiperSlide key={uuidv4()}>
                                        <ProductItem key={p?._id} props={p} />
                                    </SwiperSlide>
                                );
                            })}
                        </Swiper>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProductRecommendation;
