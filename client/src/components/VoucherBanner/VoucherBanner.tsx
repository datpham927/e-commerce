/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import { apiGetActiveBannerVouchers } from '../../services/voucher.service';
import { IVoucher } from '../../interfaces/voucher.interfaces';
import Overlay from '../common/Overlay';

const VoucherBanner: React.FC = () => {
    const [vouchers, setVouchers] = useState<IVoucher[]>([]);
    const [isVisible, setIsVisible] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [fireStyle, setFireStyle] = useState<React.CSSProperties>({});
    const [explosions, setExplosions] = useState<any[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchVouchers = async () => {
            const response = await apiGetActiveBannerVouchers();
            if (response.success && response.data?.length > 0) {
                setVouchers(response.data);
                const lastClosedTime = localStorage.getItem('voucherBannerLastClosed');
                const currentTime = Date.now();
                const fiveMinutesInMs = 5 * 60 * 1000;
                if (!lastClosedTime || currentTime - parseInt(lastClosedTime) >= fiveMinutesInMs) {
                    setIsVisible(true);
                }
            }
        };
        fetchVouchers();
    }, []);

    useEffect(() => {
        if (!isVisible) {
            const fiveMinutesInMs = 5 * 60 * 1000;
            const timer = setTimeout(() => {
                if (vouchers.length > 0) {
                    setCurrentIndex((prevIndex) => (prevIndex + 1) % vouchers.length);
                    setIsVisible(true);
                }
            }, fiveMinutesInMs);
            return () => clearTimeout(timer);
        }
    }, [isVisible, vouchers]);

    useEffect(() => {
        const interval = setInterval(() => {
            const centerX = Math.random() * 100;
            const centerY = Math.random() * 100;
            const numParticles = 30; // Tăng số lượng tia sáng
            const newExplosion = Array.from({ length: numParticles }).map((_, i) => {
                const angle = (i / numParticles) * 2 * Math.PI;
                const distance = 50 + Math.random() * 30;
                const dx = Math.cos(angle) * distance;
                const dy = Math.sin(angle) * distance;
                const color = ['#ffcc00', '#ff6699', '#66ff66', '#66ccff'][Math.floor(Math.random() * 4)];
                return {
                    id: `${Date.now()}-${i}`,
                    x: centerX,
                    y: centerY,
                    dx,
                    dy,
                    color,
                };
            });
            setExplosions((prev) => [...prev, ...newExplosion]);

            // Remove after 1s
            setTimeout(() => {
                setExplosions((prev) => prev.filter((p) => !newExplosion.find((np) => np.id === p.id)));
            }, 1000);
        }, 700);

        return () => clearInterval(interval);
    }, []);

    // Thêm keyframes động sparkle
    useEffect(() => {
        const styleSheet = document.styleSheets[0];
        const keyframes = `@keyframes sparkle {
                0% { opacity: 1; transform: translate(0, 0) scale(1); }
                100% { opacity: 0; transform: translate(var(--dx), var(--dy)) scale(0.5); }
            }`;
        try {
            styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
        } catch (e) {
            console.error('Failed to insert sparkle keyframes:', e);
        }
    }, []);

    // Lửa ở nút
    useEffect(() => {
        const interval = setInterval(() => {
            const intensity = Math.floor(Math.random() * 10) + 5;
            const color = ['#ff6600', '#ff3300', '#ff9900'][Math.floor(Math.random() * 3)];
            setFireStyle({
                boxShadow: `0 0 ${intensity}px 4px ${color}`,
            });
        }, 150);
        return () => clearInterval(interval);
    }, []);

    const handleCloseBanner = () => {
        localStorage.setItem('voucherBannerLastClosed', Date.now().toString());
        setIsVisible(false);
    };

    if (!isVisible || vouchers.length === 0) return null;

    return (
        <Overlay className="z-[999]" onClick={handleCloseBanner}>
            <div
                className="relative tablet:h-auto tablet:max-w-[60%] max-w-[390px] h-[500px] mx-4 sm:mx-6 lg:mx-auto bg-white rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()}>
                <button
                    onClick={handleCloseBanner}
                    className="absolute -top-4 -right-4 bg-gray-800 text-white p-2 rounded-full hover:bg-red-500 transition-colors duration-300"
                    aria-label="Close voucher banner">
                    <FaTimes className="text-xl" />
                </button>

                <div className="w-full h-full rounded-lg overflow-hidden relative">
                    <img
                        className="w-full h-full object-cover"
                        src={vouchers[currentIndex]?.voucher_banner_image}
                        alt={`Voucher ${vouchers[currentIndex]._id}`}
                    />

                    {/* Hiệu ứng pháo hoa nổ ra nhiều tia sáng và lan rộng */}
                    {explosions.map((p) => (
                        <div
                            key={p.id}
                            style={{
                                position: 'absolute',
                                left: `${p.x}%`,
                                top: `${p.y}%`,
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                backgroundColor: p.color,
                                pointerEvents: 'none',
                                animation: 'sparkle 1s ease-out forwards',
                                transform: 'translate(0, 0)',
                                opacity: 1,
                                // Custom properties cho animation
                                ['--dx' as any]: `${p.dx}px`,
                                ['--dy' as any]: `${p.dy}px`,
                            }}
                        />
                    ))}

                    <button
                        onClick={() => {
                            handleCloseBanner();
                            navigate('/voucher');
                        }}
                        style={fireStyle}
                        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-xl transition duration-300">
                        🎁 Nhận voucher
                    </button>
                </div>
            </div>
        </Overlay>
    );
};

export default VoucherBanner;
