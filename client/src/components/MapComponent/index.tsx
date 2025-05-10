/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import { getApiCodeLocation, getApiCurrentLocation } from '../../services/address.service';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
interface MapComponentProps {
    placeName?: string | any;
    height?: string;
    width?: string;
}
const customIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png', // Đường dẫn icon mặc định
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
    iconSize: [25, 41], // Kích thước icon
    iconAnchor: [12, 41], // Điểm neo của icon
    popupAnchor: [1, -34], // Điểm neo của popup
    shadowSize: [41, 41], // Kích thước bóng
});
const MapComponent: React.FC<MapComponentProps> = ({ placeName, height = '200px', width = '300px' }) => {
    const [position, setPosition] = useState<LatLngExpression | any>(null); // Lưu tọa độ của vị trí
    const [displayName, setDisplayName] = useState<LatLngExpression | any>(placeName); // Lưu tọa độ của vị trí
    // Hàm lấy tọa độ từ tên địa điểm
    const geocodeLocation = async () => {
        const data = await getApiCodeLocation(placeName);
        if (data && data.length > 0) {
            const { lat, lon } = data[0];
            const latitude = parseFloat(lat);
            const longitude = parseFloat(lon);
            setPosition([latitude, longitude]); // Cập nhật tọa độ vào state
        }
    };
    // Hàm lấy tọa độ từ vị trí người dùng
    const handleGetLocationAndPlaceName = async () => {
        if (!navigator.geolocation) {
            alert('Trình duyệt không hỗ trợ định vị.');
            return;
        }
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                setPosition([latitude, longitude]);
                // Gọi API để lấy thông tin địa chỉ từ tọa độ
                const res = await getApiCurrentLocation(latitude, longitude);
                if (res && res.address) {
                    const address = res.display_name;
                    setDisplayName(address);
                }
            },
            (error) => {
                console.error('Lỗi khi lấy vị trí:', error);
                alert('Vui lòng bật định vị để sử dụng tính năng này.');
            },
        );
    };
    useEffect(() => {
        if (placeName) {
            geocodeLocation(); // Gọi geocodeLocation khi placeName có giá trị
        } else {
            handleGetLocationAndPlaceName(); // Lấy vị trí người dùng nếu không có placeName
        }
    }, [placeName]);

    if (!position) {
        return <div>Bản đồ không thể hiển thị..</div>; // Hiển thị trạng thái khi chưa có vị trí
    }

    return (
        <MapContainer
            center={position} // Vị trí trung tâm bản đồ [lat, lng]
            zoom={13}
            style={{ height: height, width: width }}
            key={position.join(',')} // Key để tái tạo bản đồ khi vị trí thay đổi
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={position} icon={customIcon}>
                <Popup>{placeName ? placeName : displayName}</Popup>
            </Marker>
        </MapContainer>
    );
};

export default MapComponent;
