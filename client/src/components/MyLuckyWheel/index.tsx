import React, { useState, useEffect } from 'react';
import { Wheel } from 'react-custom-roulette';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import Overlay from '../common/Overlay';
import { dpnAudio, spinAudio, votayAudio } from '../../assets';
import { apiPlayLuckyBox } from '../../services/user.service';
import useUserStore from '../../store/userStore';

// Định nghĩa interface cho phần thưởng
interface Prize {
    option: string;
    probability: number;
}

// Định nghĩa interface cho dữ liệu trả về từ API
interface ApiResponse {
    success: boolean;
    data: {
        type: 'point' | 'ticket' | 'voucher';
        point?: number;
        ticket?: number;
        voucher?: { voucher_name: string };
    };
}

// Định nghĩa interface cho user từ store
interface User {
    user_spin_turns: number;
}

// Định nghĩa interface cho props của component
interface LuckyWheelProps {
    setGameModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

// Cấu hình danh sách phần thưởng với xác suất trúng (tổng xác suất phải bằng 100)
const PRIZES: Prize[] = [
    { option: '💵 10.000 xu', probability: 5 }, // Giá trị trung bình, xác suất thấp
    { option: '🙁 May mắn lần sau', probability: 25 }, // Không giá trị, xác suất cao
    { option: '🏷️ Phiếu giảm giá', probability: 5 }, // Giá trị trung bình, xác suất trung bình
    { option: '🔄 1 lượt quay', probability: 5 }, // Giá trị trung bình, xác suất thấp
    { option: '🙁 May mắn lần sau', probability: 25 }, // Không giá trị, xác suất cao
    { option: '💸 50.000 xu', probability: 5 }, // Giá trị cao, xác suất rất thấp
    { option: '🙁 May mắn lần sau', probability: 25 }, // Không giá trị, xác suất cao
    { option: '🔁 2 lượt quay', probability: 5 }, // Giá trị trung bình, xác suất thấp
];
// Màu nền và màu chữ cho vòng quay
const BACKGROUND_COLORS: string[] = ['#FFD700', '#FF8C00', '#FF69B4', '#00CED1', '#ADFF2F', '#9370DB', '#00FA9A', '#FF4500', '#20B2AA'];
const TEXT_COLORS: string[] = ['#FFFFFF'];
// Hàm chọn phần thưởng ngẫu nhiên dựa trên xác suất
const getWeightedRandomPrizeIndex = (): number => {
    // ví dụ phần thưởng a=90 b=10
    // thì a sẽ có khoảng trúng từ [0%,90%] còn b thì [90%,100%]
    // tỉ lệ random trong khoảng [0%,90%]   cao hơn [90%,100%]
    // Tính tổng xác suất
    const total = PRIZES.reduce((sum, prize) => sum + prize.probability, 0);
    console.log({ total });
    if (total !== 100) {
        console.error('Xác suất phải có tổng bằng 100');
        return 0;
    }
    // Tạo số ngẫu nhiên từ 0 đến 100
    const random = Math.random() * 100;
    let cumulative = 0;
    console.log({ random });
    // Duyệt qua từng phần thưởng, tích lũy xác suất
    for (let i = 0; i < PRIZES.length; i++) {
        cumulative += PRIZES[i].probability;
        if (random <= cumulative) {
            return i;
        }
    }
    // Dự phòng: trả về phần thưởng cuối cùng
    return PRIZES.length - 1;
};

// Component chính của vòng quay may mắn
const LuckyWheel: React.FC<LuckyWheelProps> = ({ setGameModalOpen }) => {
    // Quản lý trạng thái: đang quay, chỉ số phần thưởng, hiển thị kết quả
    const [isSpinning, setIsSpinning] = useState<boolean>(false);
    const [prizeIndex, setPrizeIndex] = useState<number>(0);
    const [showPrize, setShowPrize] = useState<boolean>(false);
    // Lấy hàm và dữ liệu người dùng từ store
    const { setAddRewardPoints, setAddTicket, user, setSubtractTicket } = useUserStore() as {
        setAddRewardPoints: (points: number) => void;
        setAddTicket: (tickets: number) => void;
        user: User;
        setSubtractTicket: () => void;
    };
    // Lưu tiêu đề phiếu giảm giá
    const [titleVoucher, setTitleVoucher] = useState<string>('');
    // Xử lý sự kiện bắt đầu quay
    const handleSpin = (): void => {
        // Không cho quay nếu đang quay hoặc hết lượt
        if (isSpinning || user.user_spin_turns === 0) return;
        // Giảm số lượt quay
        setSubtractTicket();
        // Phát âm thanh quay
        const audio = new Audio(spinAudio);
        audio.play();
        // Chọn ngẫu nhiên phần thưởng
        const newPrizeIndex = getWeightedRandomPrizeIndex();
        setPrizeIndex(newPrizeIndex);
        setIsSpinning(true);
        setShowPrize(false);
    };

    // Xử lý khi vòng quay dừng
    const handleSpinEnd = (): void => {
        setIsSpinning(false);
        setShowPrize(true);
    };

    // Hiệu ứng pháo giấy khi trúng thưởng
    const fireConfetti = (): void => {
        confetti({
            particleCount: 200,
            spread: 110,
            zIndex: 1000,
            origin: { y: 0.3 },
            colors: ['#FFC700', '#FF0000', '#00FF00', '#0000FF'],
        });
    };

    // Hiệu ứng animation cho thông báo phần thưởng
    const prizeVariants = {
        hidden: { scale: 0.5, opacity: 0 },
        visible: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 120, damping: 10 } },
        exit: { scale: 0.5, opacity: 0, transition: { duration: 0.4 } },
    };

    // Xử lý phần thưởng khi vòng quay dừng
    useEffect(() => {
        if (!showPrize) return;

        const handlePrize = async (): Promise<void> => {
            const currentPrize = PRIZES[prizeIndex].option;
            // Gửi yêu cầu đến server
            const res: ApiResponse = await apiPlayLuckyBox(prizeIndex);
            // Nếu không trúng thưởng
            if (currentPrize === '🙁 May mắn lần sau') {
                const audio = new Audio(dpnAudio);
                audio.play();
                return;
            }
            // Nếu trúng thưởng, phát hiệu ứng và âm thanh
            fireConfetti();
            const audio = new Audio(votayAudio);
            audio.play();
            if (!res.success) return;
            const data = res.data;
            // Cập nhật điểm thưởng, lượt quay hoặc phiếu giảm giá
            if (data.type === 'point' && data.point) {
                setAddRewardPoints(data.point);
            } else if (data.type === 'ticket' && data.ticket) {
                setAddTicket(data.ticket);
            } else if (data.type === 'voucher' && data.voucher) {
                setTitleVoucher(data.voucher.voucher_name);
            }
        };

        handlePrize();
    }, [showPrize, prizeIndex, setAddRewardPoints, setAddTicket]);

    return (
        <>
            {/* Lớp phủ (overlay) cho vòng quay */}
            <AnimatePresence>
                <Overlay
                    onClick={() => setGameModalOpen(false)}
                    className="z-50 flex items-center justify-center min-h-screen font-[Poppins] bg-black bg-opacity-70">
                    <div onClick={(e: React.MouseEvent) => e.stopPropagation()} className="relative text-center">
                        {/* Component vòng quay */}
                        <Wheel
                            mustStartSpinning={isSpinning}
                            prizeNumber={prizeIndex}
                            data={PRIZES}
                            backgroundColors={BACKGROUND_COLORS}
                            textColors={TEXT_COLORS}
                            fontSize={13}
                            textDistance={65}
                            outerBorderColor="#FFD700"
                            outerBorderWidth={8}
                            radiusLineColor="#fff"
                            radiusLineWidth={2}
                            innerRadius={20}
                            spinDuration={0.5}
                            onStopSpinning={handleSpinEnd}
                        />
                        {/* Nút quay */}
                        <button
                            onClick={handleSpin}
                            disabled={isSpinning || user.user_spin_turns === 0}
                            className={`mt-6 px-6 py-3 text-lg font-bold rounded-full text-white shadow-md transition-transform duration-300 ${
                                user.user_spin_turns === 0 || isSpinning
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-pink-500 via-yellow-400 to-purple-600 hover:scale-105'
                            }`}>
                            {user.user_spin_turns > 0 ? `🎯 Quay Ngay! (${user.user_spin_turns} lượt còn lại)` : '😔 Hết lượt quay rồi!'}
                        </button>
                    </div>
                </Overlay>
            </AnimatePresence>

            {/* Hiển thị thông báo phần thưởng */}
            <AnimatePresence>
                {showPrize && (
                    <motion.div
                        className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-60"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowPrize(false)}>
                        <motion.div
                            className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-md mx-auto"
                            variants={prizeVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                            <div className="text-4xl mb-4">{PRIZES[prizeIndex].option === '🙁 May mắn lần sau' ? '💔 Rất tiếc!' : '🎉 Xin chúc mừng!'}</div>
                            <p className="text-xl font-semibold mb-4 break-words">
                                {PRIZES[prizeIndex].option === '🙁 May mắn lần sau'
                                    ? 'Chúc bạn may mắn lần sau!'
                                    : `Bạn đã trúng: ${titleVoucher || PRIZES[prizeIndex].option}`}
                            </p>
                            <button onClick={() => setShowPrize(false)} className="mt-4 px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg">
                                Đóng
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default LuckyWheel;
