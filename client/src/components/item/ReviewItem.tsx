import React, { memo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import moment from 'moment';
import 'moment/dist/locale/vi';
import MoodIcon from '@mui/icons-material/Mood';
import { v4 as uuidv4 } from 'uuid';
import { formatStar } from '../../utils/formatStar';
import { noUser } from '../../assets';
import useUserStore from '../../store/userStore';
import { RATING_REVIEW } from '../../utils/const';
import { IReview } from '../../interfaces/review.interfaces';

interface ReviewsProps {
    review: IReview;
    handleDelete?: () => void;
    handleEdit?: () => void;
}

const ReviewItem: React.FC<ReviewsProps> = ({ review, handleDelete, handleEdit }) => {
    moment.locale('vi');
    const { review_comment, review_images, review_rating, review_user, createdAt } = review;
    const { user } = useUserStore();

    const isAuthor = user._id === review_user?._id;
    const isEditable = moment().diff(moment(createdAt), 'hours') < 24;


    return (
        <div className="w-full px-6 py-4 border-b border-solid border-slate-200">
            <div className="flex w-full gap-3 tablet:flex-col">
                {/* Thông tin người dùng */}
                <div className="flex items-start gap-3 laptop:w-3/12 tablet:w-full">
                    <div className="w-10 h-10 rounded-full shrink-0 overflow-hidden">
                        <img className="object-cover w-full h-full" src={review_user?.user_avatar_url || noUser} alt="Avatar" />
                    </div>
                    <div className="flex flex-col justify-center gap-1">
                        <div className="flex items-center gap-3">
                            <h3 className="text-base font-medium">{review_user?.user_name}</h3>
                        </div>
                        <span className="text-xs text-text_secondary">Đã tham gia {moment(review_user?.createdAt).fromNow()}</span>
                    </div>
                </div>

                {/* Nội dung đánh giá */}
                <div className="flex flex-col justify-center gap-3 pr-6 laptop:w-9/12 tablet:w-full">
                    <div className="flex flex-col gap-2 w-full">
                        {review_rating > 0 && (
                            <div className="flex items-center gap-2 w-full">
                                <div className="flex">{formatStar(review_rating, '20px')}</div>
                                <span className="text-sm font-semibold">{RATING_REVIEW?.find((r) => r.start === review_rating)?.text}</span>
                            </div>
                        )}
                        {review_rating > 0 && (
                            <div className="flex w-full">
                                <span className="flex items-center py-[1px] px-1 text-[10px] font-semibold text-pink-500 border border-solid border-pink-500 rounded-sm gap-1">
                                    <MoodIcon style={{ fontSize: '12px' }} />
                                    'Đã mua hàng'
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col w-full h-full  gap-1">
                        <span className="text-sm text-capitalize">{review_comment} </span>
                        <ul className="w-full h-full">
                            <Swiper
                                loop={false}
                                allowTouchMove={false}
                                navigation={true}
                                spaceBetween={20}
                                modules={[Navigation]}
                                className="mySwiper"
                                breakpoints={{
                                    1: {
                                        slidesPerView: 1,
                                        slidesPerGroup: 1,
                                        allowTouchMove: true,
                                    },
                                    740: {
                                        slidesPerView: 2,
                                        slidesPerGroup: 2,
                                    },
                                    1024: {
                                        slidesPerView: 4,
                                        slidesPerGroup: 3,
                                    },
                                }}>
                                {review_images?.map((i) => (
                                    <SwiperSlide key={uuidv4()}>
                                        <div className=" h-[200px]  mx-auto">
                                            <img className="w-full h-full object-contain block" src={i} />
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </ul>
                        <span className="text-sm text-secondary">Đánh giá {moment(createdAt).fromNow()}</span>
                    </div>

                    <div className="flex gap-6 mt-3 w-full">
                        {isAuthor && (
                            <div className="flex gap-6 text-primary">
                                {isEditable && (
                                    <button className="text-sm hover:opacity-80" onClick={handleEdit}>
                                        Chỉnh sửa
                                    </button>
                                )}
                                <button className="text-sm hover:opacity-80" onClick={handleDelete}>
                                    Xóa
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(ReviewItem);
