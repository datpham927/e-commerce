/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

const getApiPublicProvince = async () => {
    try {
        const response = await axios.get('https://provinces.open-api.vn/api/p');
        return response.data;
    } catch (error) {
        return error;
    }
};

const getApiPublicDistrict = async (province_code: any) => {
    try {
        const response = await axios.get(`https://provinces.open-api.vn/api/p/${province_code}?depth=2`);
        return response.data;
    } catch (error) {
        return error;
    }
};
const getApiPublicWards = async (districtId: any) => {
    try {
        const response = await axios.get(`https://provinces.open-api.vn/api/d/${districtId}?depth=2`);
        return response.data;
    } catch (error) {
        return error;
    }
};
const getApiCurrentLocation = async (latitude: number, longitude: number) => {
    try {
        const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
        return response.data;
    } catch (error) {
        return error;
    }
};
const getApiCodeLocation = async (placeName: string) => {
    try {
        const response = await axios.get(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(placeName)}&addressdetails=1&language=vi`,
        );
        return response.data;
    } catch (error) {
        return error;
    }
};
export { getApiPublicProvince, getApiPublicDistrict, getApiCurrentLocation, getApiCodeLocation, getApiPublicWards };
