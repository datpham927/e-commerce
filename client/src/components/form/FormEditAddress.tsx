/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { memo, useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { InputForm, InputReadOnly, Overlay, showNotification } from '..';
import ButtonOutline from '../buttonOutline';
import SelectOptions from '../selectOptions';
import { IUserProfile } from '../../interfaces/user.interfaces';
import { getApiCurrentLocation, getApiPublicDistrict, getApiPublicProvince, getApiPublicWards } from '../../services/address.service';
import { apiUpdateProfile } from '../../services/user.service';
import useUserStore from '../../store/userStore';
import MapComponent from '../MapComponent';
import { useActionStore } from '../../store/actionStore';

interface FormEditAddressProps {
    payload: IUserProfile | any;
    setPayload?: (e: any) => void;
    setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
    isEdit?: boolean;
}

const FormEditAddress: React.FC<FormEditAddressProps> = ({ payload, setPayload, setIsOpen, isEdit }) => {
    const [provinces, setProvinces] = useState<{ code: number; name: string }[]>();
    const [districts, setDistricts] = useState<{ code: number; name: string }[]>();
    const [provinceId, setProvinceId] = useState<any>();
    const [districtId, setDistrictId] = useState<any>();
    const [wardsId, setWardsId] = useState<any>();
    const [specificAddress, setSpecificAddress] = useState<any>();
    const [wards, setWards] = useState<{ code: number; name: string }[]>();
    const [usingLocation, setUsingLocation] = useState<boolean>(false);
    const [address, setAddress] = useState<string>('');
    const { setUser } = useUserStore();
    const { setIsLoading } = useActionStore();

    useEffect(() => {
        const fetchApi = async () => {
            const response = await getApiPublicProvince();
            setProvinces(response);
        };
        fetchApi();
    }, []);

    useEffect(() => {
        setDistrictId(undefined);
        const fetchApi = async () => {
            const response = await getApiPublicDistrict(provinceId);
            setDistricts(response.districts);
        };
        fetchApi();
    }, [provinceId]);

    useEffect(() => {
        const fetchApi = async () => {
            const response = await getApiPublicWards(districtId);
            setWards(response.wards);
        };
        fetchApi();
    }, [districtId]);

    useEffect(() => {
        if (usingLocation) return;
        const province = provinces?.find((e) => e?.code === Number(provinceId));
        const district = districts?.find((e) => e?.code === Number(districtId));
        const ward = wards?.find((e) => e?.code === Number(wardsId));
        const detailAddress = [specificAddress, ward?.name, district?.name, province?.name].filter(Boolean).join(', ');
        setAddress(detailAddress || payload.user_address?.detail || '');
    }, [usingLocation, provinceId, districtId, wardsId, specificAddress, provinces, districts, wards, payload]);

    const handleSubmit = async (e: { stopPropagation: () => void }) => {
        e.stopPropagation();
        const provinceName = provinces?.find((p) => p?.code === Number(provinceId))?.name || '';
        const districtName = districts?.find((d) => d?.code === Number(districtId))?.name || '';
        const wardName = wards?.find((w) => w?.code === Number(wardsId))?.name || '';
        const newAddress = {
            city: provinceName,
            district: districtName,
            village: wardName,
            detail: address,
        };
        if (isEdit) {
            const res = await apiUpdateProfile({ user_address: newAddress });
            showNotification(res.message, res.success);
            if (res.success) setUser(res.data);
            if (res.success && setPayload) {
                setPayload((prev: any) => ({
                    ...prev,
                    user_address: newAddress,
                }));
            }
        } else {
            if (setPayload) {
                setPayload((prev: any) => ({
                    ...prev,
                    user_address: newAddress,
                }));
            }
        }
        setIsOpen?.(false);
    };
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSpecificAddress(e.target.value);
    };
    const handleGetLocationAndPlaceName = async () => {
        if (!navigator.geolocation) {
            showNotification('Trình duyệt không hỗ trợ định vị.', false);
            return;
        }
        setUsingLocation(true);

        navigator.geolocation.getCurrentPosition(
            async ({ coords: { latitude, longitude } }) => {
                setIsLoading(true);
                try {
                    const res = await getApiCurrentLocation(latitude, longitude);
                    setIsLoading(false);
                    const addr = res?.address;
                    if (addr) {
                        const provinceName = addr.city || addr.state || addr.province;
                        const districtName = addr.suburb?.replace('District', '')?.trim()|| addr.city_district;
                        const wardName = addr.quarter||addr.village;
                        // --- Tìm province ---
                        const matchedProvince = provinces?.find((p) => p.name.toLowerCase().includes(provinceName?.toLowerCase()));
                        if (matchedProvince) {
                            setProvinceId(matchedProvince.code);
                            // --- Lấy danh sách quận/huyện ---
                            const districtsRes = await getApiPublicDistrict(matchedProvince.code);
                            const matchedDistrict = districtsRes.districts?.find((d: any) => d.name.toLowerCase().includes(districtName?.toLowerCase()));
                            if (matchedDistrict) {
                                setDistrictId(matchedDistrict.code);
                                // --- Lấy danh sách phường/xã ---
                                const wardsRes = await getApiPublicWards(matchedDistrict.code);
                                const matchedWard = wardsRes.wards?.find((w: any) => w.name.toLowerCase().includes(wardName?.toLowerCase()));
                                if (matchedWard) {
                                    setWardsId(matchedWard.code);
                                }
                                setWards(wardsRes.wards || []);
                            }
                            setDistricts(districtsRes.districts || []);
                        }

                        // Cập nhật địa chỉ chi tiết
                        const detailAddress = [addr.road, wardName, districtName, provinceName].filter(Boolean).join(', ');
                        setSpecificAddress(addr.road || '');
                        setAddress(detailAddress);

                        showNotification('Đã lấy vị trí trên bản đồ', true);
                    } else {
                        showNotification('Không lấy được thông tin vị trí.', false);
                    }
                } catch (error) {
                    console.error('Lỗi khi gọi API địa chỉ:', error);
                    setIsLoading(false);
                    showNotification('Đã xảy ra lỗi khi lấy địa chỉ.', false);
                }
            },
            (error) => {
                console.error('Lỗi khi lấy vị trí:', error);
                setIsLoading(false);
            },
        );
    };

    return (
        <Overlay
            className="z-[1000]"
            onClick={(e) => {
                e.stopPropagation();
                if (setIsOpen) setIsOpen(false);
            }}>
            <div
                className="relative flex flex-col w-auto h-[500px] p-6 bg-white rounded-lg overflow-hidden"
                onClick={(e) => {
                    e.stopPropagation();
                    if (setIsOpen) setIsOpen(true);
                }}>
                <h1 className="text-xl mx-auto mb-8">Chỉnh sửa địa chỉ</h1>
                <div className="flex gap-6">
                    <div className="flex flex-col gap-6 w-[400px] justify-center">
                        <div className="flex flex-col gap-3">
                            <SelectOptions
                                label="Tỉnh/Thành phố"
                                options={provinces}
                                selectId={provinces?.find((e) => e.code === provinceId)?.code}
                                setOptionId={(id) => {
                                    setProvinceId(id);
                                    setUsingLocation(false);
                                }}
                            />
                            <SelectOptions
                                label="Quận/Huyện"
                                options={districts}
                                selectId={districts?.find((e) => e.code === districtId)?.code}
                                setOptionId={setDistrictId}
                            />
                            <SelectOptions label="Xã/Phường" options={wards} selectId={wards?.find((e) => e.code === wardsId)?.code} setOptionId={setWardsId} />
                            <InputForm name_id="specificAddress" handleOnchange={handleInputChange} label="Địa chỉ cụ thể" value={specificAddress} />
                        </div>
                        <InputReadOnly label="Địa chỉ" value={address} />
                    </div>
                    <div className="my-5">
                        <h1 className="text-[20px] my-2 font-semibold">Bản đồ</h1>
                        <div className="my-2">
                            <MapComponent placeName={address} />
                            <ButtonOutline onClick={handleGetLocationAndPlaceName} className="mx-auto px-6 text-white bg-primary mt-6">
                                Lấy vị trí của bạn
                            </ButtonOutline>
                        </div>
                    </div>
                </div>
                <ButtonOutline className="mx-auto px-6 text-white bg-primary my-2" onClick={handleSubmit}>
                    Lưu
                </ButtonOutline>
                <span
                    className="absolute top-2 right-2 cursor-pointer"
                    onClick={(e) => {
                        e.stopPropagation();
                        if (setIsOpen) setIsOpen(false);
                    }}>
                    <CloseIcon fontSize="small" style={{ color: '#808089' }} />
                </span>
            </div>
        </Overlay>
    );
};

export default memo(FormEditAddress);
