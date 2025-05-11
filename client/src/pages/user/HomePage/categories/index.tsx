import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import CategoryItem from '../../../../components/item/CategoryItem';
import { SkeletonCategory } from '../../../../components';
import { useCategoriesStore } from '../../../../store/categoryStore';
import { useActionStore } from '../../../../store/actionStore';
const Categories: React.FC = () => {
    const { mobile_ui } = useActionStore();
    const { categories } = useCategoriesStore();
    return (
        <div className="flex w-full h-full bg-white py-3 rounded-md overflow-hidden ">
            {categories?.length > 0 ? (
                <Swiper
                    className="w-full"
                    allowTouchMove={false}
                    mousewheel={true}
                    loop={true}
                    modules={[Autoplay, Pagination, Navigation]}
                    breakpoints={{
                        1: {
                            slidesPerView: 4,
                            slidesPerGroup: 1,
                            allowTouchMove: true,
                        },
                        740: {
                            slidesPerView: 6,
                            slidesPerGroup: 2,
                        },
                        1024: {
                            slidesPerView: 10,
                            slidesPerGroup: 3,
                        },
                    }}>
                    {categories?.map((c) => {
                        return (
                            <SwiperSlide>
                                <CategoryItem key={uuidv4()} props={c} />;
                            </SwiperSlide>
                        );
                    })}
                </Swiper>
            ) : (
                <SkeletonCategory index={mobile_ui ? 4 : 10} />
            )}
        </div>
    );
};

export default Categories;
