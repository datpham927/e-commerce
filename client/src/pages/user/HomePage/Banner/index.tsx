import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { apiGetAllBanners } from '../../../../services/banner.service';
import { IBanner } from '../../../../interfaces/banner.interfaces';
import { Link } from 'react-router';
import { Skeleton } from '@mui/material';
import { getTopViewedProduct } from '../../../../services/product.service';
import { IProduct } from '../../../../interfaces/product.interfaces';
import { useActionStore } from '../../../../store/actionStore';
const Banner: React.FC = () => {
    const [banners, setBanners] = useState<IBanner[]>([]);
    const [products, setProducts] = useState<IProduct[]>([]);
    const { mobile_ui } = useActionStore();

    useEffect(() => {
        const fetchProducts = async () => {
            const resBanner = await apiGetAllBanners();
            const resProduct = await getTopViewedProduct();
            if (resBanner?.success) setBanners(resBanner.data);
            if (resProduct?.success) setProducts(resProduct.data);
        };
        fetchProducts();
    }, []);

    return (
        <div className="flex tablet:col  w-full h-full gap-1 mt-4 mb-4">
            <div className="flex tablet:w-full w-[74%]  h-full  rounded-md overflow-hidden">
                {banners?.length > 0 ? (
                    <Swiper
                        centeredSlides={true}
                        autoplay={{
                            delay: 2000,
                            disableOnInteraction: false,
                        }}
                        pagination={{
                            clickable: true,
                        }}
                        loop={true}
                        navigation={true}
                        modules={[Autoplay, Pagination, Navigation]}
                        className="mySwiper"
                        breakpoints={{
                            1: {
                                slidesPerGroup: 1,
                                allowTouchMove: true,
                            },
                            1024: {
                                allowTouchMove: false,
                            },
                        }}>
                        {banners?.map((i) => {
                            return (
                                <SwiperSlide key={i._id}>
                                    <Link to={i.banner_link} className="w-full h-full shrink-0 ">
                                        <img className="w-full h-full object-fill" src={i.banner_imageUrl} alt={i.banner_title} />
                                    </Link>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                ) : (
                    <Skeleton variant={'rectangular'} width={'100%'} height={mobile_ui ? '150px' : '304px'} />
                )}
            </div>
            <div className=" tablet:hidden w-[26%] h-full  pl-4">
                {products?.length > 0 ? (
                    <Swiper
                        autoplay={{
                            delay: 6000,
                            disableOnInteraction: false,
                        }}
                        loop={true}
                        allowTouchMove={false}
                        modules={[Autoplay]}
                        className="mySwiper">
                        {products?.map((i) => {
                            return (
                                <SwiperSlide key={i._id}>
                                    <Link to={`/${i?.product_slug}/${i?._id}`} className="w-full h-full object-fill  overflow-hidden ">
                                        <img className="w-full  h-full  object-fill rounded-[4px]" src={i?.product_thumb} />
                                    </Link>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                ) : (
                    <Skeleton variant={'rectangular'} width={'100%'} height={'304px'} />
                )}
            </div>
        </div>
    );
};

export default Banner;
