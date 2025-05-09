/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import { v4 as uuidv4 } from 'uuid';
import { ButtonOutline, Overlay, showNotification } from '..';
import { IProductDetail } from '../../interfaces/product.interfaces';
import useUserStore from '../../store/userStore';
import useAuthStore from '../../store/authStore';
import usePurchasedStore from '../../store/purchasedStore';
import { apiUploadImage } from '../../services/uploadPicture.service';
import { useActionStore } from '../../store/actionStore';
import { apiCreateReview, apiUpdateReview } from '../../services/review.service';
import StarIcon from '@mui/icons-material/Star';
import { Rating } from '@mui/material';
import { IReview } from '../../interfaces/review.interfaces';
import { INotification } from '../../interfaces/notification.interfaces';
import { sendNotificationToAdmin } from '../../services/notification.service';
import useSocketStore from '../../store/socketStore';

interface FormReviewsProps {
    setReviews?: React.Dispatch<React.SetStateAction<IReview[]>>;
    reviews?: IReview[];
    reviewEdit?: IReview;
    productReview: IProductDetail | any;
    setOpenFormReview?: React.Dispatch<React.SetStateAction<boolean>>;
    setRatings?: React.Dispatch<React.SetStateAction<any>>;
    title: string;
    isEdit?: boolean;
    isReviewed?: boolean;
    titleButton?: string;
    // socketRef: React.MutableRefObject<SocketIOClient.Socket | null>;
}

const FormReviews: React.FC<FormReviewsProps> = ({
    setReviews,
    reviews,
    isReviewed,
    isEdit,
    productReview,
    reviewEdit,
    setOpenFormReview,
    titleButton = 'Gửi đánh giá',
    title,
    setRatings,
    // socketRef,
}) => {
    const [valueInput, setValueInput] = useState('');
    const [imagesUrl, setImagesUrl] = useState<string[]>([]);
    const [rating, setRating] = useState<number | any>(5);
    const { user, setAddRewardPoints } = useUserStore();
    const { isUserLoggedIn } = useAuthStore();
    const { setIsLoading, setOpenFeatureAuth } = useActionStore();
    const { purchasedProducts, setIsReviewedPurchasedProduct } = usePurchasedStore();
    const { socket } = useSocketStore();

    useEffect(() => {
        if (isEdit && reviewEdit) {
            setImagesUrl(reviewEdit.review_images);
            setValueInput(reviewEdit.review_comment);
            setRating(reviewEdit.review_rating);
        }
        if (purchasedProducts.find((pc) => pc.pc_productId._id === productReview._id)?.pc_isReviewed) {
            setRating(0);
        }
    }, [isEdit, reviewEdit, productReview, purchasedProducts, user._id]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        setIsLoading(true);
        const formData = new FormData();
        for (const file of files) {
            formData.append('file', file);
            formData.append('upload_preset', import.meta.env.VITE_REACT_UPLOAD_PRESET);
            try {
                const response = await apiUploadImage(formData);
                setImagesUrl((prev) => [...prev, response.url]);
            } catch {
                showNotification('Lỗi xảy ra khi tải lên ảnh.', false);
            }
        }

        setIsLoading(false);
    };

    const postComment = async () => {
        setIsLoading(true);
        const res = await apiCreateReview({
            review_comment: valueInput,
            review_images: imagesUrl,
            review_rating: isReviewed ? 0 : rating,
            review_productId: productReview._id,
        });
        showNotification(res.message, res.success);
        if (!res.success) {
            setIsLoading(false);
            return;
        }

        const notification: INotification = {
            notification_title: '⭐ Đánh giá mới cần duyệt!',
            notification_subtitle: '📝 Khách hàng vừa gửi đánh giá cho sản phẩm. ✅ Duyệt ngay để cập nhật! 🚀',
            notification_imageUrl: productReview?.product_thumb,
            notification_link: '/quan-ly/danh-gia',
        };
        const response = await sendNotificationToAdmin(notification);
        socket.emit('sendNotificationForAdminOnline', {
            ...response.data,
        });
        if (res.review.isApproved) {
            setReviews?.((prev) => [{ ...res.review, review_user: user }, ...prev]);
            setRatings?.(
                (
                    prev: {
                        review_rating: number;
                        _id: string;
                    }[],
                ) => [...prev, { _id: res._id, review_rating: rating }],
            );
            setIsReviewedPurchasedProduct(productReview._id);
            setAddRewardPoints();
        }
        setOpenFormReview?.(false);
        setIsLoading(false);
    };

    const editComment = async () => {
        setIsLoading(true);
        const res = await apiUpdateReview(reviewEdit?._id, {
            review_comment: valueInput,
            review_images: imagesUrl,
            review_productId: productReview._id,
        });
        showNotification(res.message, res.success);
        setIsLoading(false);
        if (!res.success) return;
        if (reviews) {
            const updatedReviews = reviews.filter((r) => r._id !== reviewEdit!._id);
            setReviews?.(() => [{ ...res.review, review_user: user }, ...updatedReviews]);
        }
        setOpenFormReview?.(false);
    };

    const handleSubmit = async (e: React.MouseEvent) => {
        e.stopPropagation();

        if (!isUserLoggedIn) {
            setOpenFeatureAuth(true);
            return;
        }
        if (!valueInput.trim()) {
            showNotification('Vui lòng nhập nhận xét!', false);
            return;
        }
        if (isEdit) {
            await editComment();
        } else {
            await postComment();
        }
    };
    return (
        <Overlay
            className="z-[1000]"
            onClick={(e) => {
                e.stopPropagation();
                setOpenFormReview?.(false);
            }}>
            <div className="flex flex-col tablet:w-full laptop:w-1/2 bg-white p-4 rounded-md gap-6" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between">
                    <h3 className="text-xl">{title}</h3>
                    <CloseIcon className="cursor-pointer" onClick={() => setOpenFormReview?.(false)} />
                </div>
                <div className="max-h-[400px] overflow-y-auto p-4 my-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 border-gray-200 rounded-md">
                    <div className="flex justify-center items-center w-10/12 mx-auto gap-3">
                        <img className="h-20 w-20" src={productReview.product_thumb} alt="Product" />
                        <span className="text-sm">{productReview.product_name}</span>
                    </div>
                    {!isReviewed && (
                        <div className="flex gap-2 justify-center my-2">
                            <Rating
                                value={rating}
                                precision={0.5}
                                sx={{ fontSize: '40px' }}
                                onChange={(event: any) => {
                                    setRating(event?.target?.value);
                                }}
                                emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                            />
                        </div>
                    )}
                    {/*   <ul className="flex gap-2 justify-center">
                        {/* {RATING_REVIEW.map((s) => (
                            <li
                                key={s.start}
                                className="flex flex-col items-center gap-1 text-[rgb(243,153,74)] cursor-pointer"
                                onClick={() => {
                                    if (purchasedProducts.some((pc) => pc.pc_productId._id === productReview._id)) {
                                        setRating(s.start);
                                    } else {
                                        showNotification('Bạn không được phép đánh giá');
                                    }
                                }}>
                                {s.start <= rating ? (
                                    <StarRateIcon style={{ fontSize: '40px', color: 'rgb(243,153,74)' }} />
                                ) : (
                                    <StarOutlineIcon style={{ fontSize: '40px', color: 'rgb(243,153,74)' }} />
                                )}
                                <span className={`text-xs ${s.start === rating ? 'font-bold' : 'font-medium'}`}>{s.text}</span>
                            </li>
                        ))}
                    </ul> */}

                    <div className="flex flex-col border border-gray-300 rounded-md py-1 w-10/12 mx-auto">
                        <textarea
                            placeholder="Nhận xét sản phẩm ..."
                            rows={3}
                            value={valueInput}
                            onChange={(e) => setValueInput(e.target.value)}
                            className="outline-none resize-none px-3"
                        />
                        <div className="flex justify-center border-t border-gray-300">
                            <input id="comment_input" type="file" multiple hidden onChange={handleImageUpload} />
                            <label htmlFor="comment_input">
                                <InsertPhotoIcon fontSize="large" style={{ color: 'green' }} />
                            </label>
                        </div>

                        {imagesUrl.length > 0 && (
                            <div className="w-full h-[100px] overflow-auto">
                                <ul className="grid grid-cols-6 gap-3 px-4">
                                    {imagesUrl.map((image) => (
                                        <li key={uuidv4()} className="relative w-full h-[60px] border border-bgSecondary my-4">
                                            <img src={image} className="w-full h-full object-contain" alt="review" />
                                            <CloseIcon
                                                className="absolute top-0 right-1 cursor-pointer"
                                                style={{ fontSize: '25px', color: '#C8C8CB' }}
                                                onClick={() => setImagesUrl((prev) => prev.filter((i) => i !== image))}
                                            />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                    <div className="flex gap-2 items-center mt-6">
                        <ButtonOutline className="w-4/12 text-lg mx-auto bg-primary text-white" onClick={handleSubmit}>
                            {titleButton}
                        </ButtonOutline>
                    </div>
                </div>
            </div>
        </Overlay>
    );
};

export default FormReviews;
