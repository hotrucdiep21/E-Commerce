import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from '../lib/axios';

// Fix leaflet icon issue in React
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom Warehouse Icon
const warehouseIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/2558/2558066.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40]
});

const colors = ["#10B981", "#3B82F6", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#14B8A6"];

const DeliveryMap = () => {
    const [routesData, setRoutesData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedClusterId, setSelectedClusterId] = useState(null);

    useEffect(() => {
        const fetchRoutes = async () => {
            try {
                const res = await axios.get('/orders/delivery-routes');
                setRoutesData(res.data);
            } catch (error) {
                console.error("Error fetching delivery routes", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRoutes();
    }, []);

    const handleMockCoordinates = async () => {
        try {
            await axios.post('/orders/mock-coordinates');
            window.location.reload();
        } catch (error) {
            console.error("Error mocking coordinates", error);
            alert("Lỗi khi tạo tọa độ giả.");
        }
    };

    if (loading) return <div className="text-white text-center py-10">Đang tính toán lịch trình giao hàng...</div>;

    if (!routesData || !routesData.routes || routesData.routes.length === 0) {
        return (
                <div className="text-white text-center py-10 bg-gray-800 rounded-lg p-6">
                <p className="mb-4">Không có đơn hàng nào cần giao hoặc chưa có tọa độ.</p>
                <button 
                    onClick={handleMockCoordinates}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded"
                >
                    Đồng bộ Tọa độ Thực tế cho các đơn cũ
                </button>
            </div>
        );
    }

    const { warehouse, routes } = routesData;

    return (
        <div className="bg-gray-800 rounded-lg p-6 w-full shadow-lg">
            <h2 className="text-2xl font-bold text-emerald-400 mb-6 text-center">Tối ưu Lịch trình Giao hàng (VRP & TSP)</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1 space-y-4">
                    <div className="bg-gray-700 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-white mb-2">Thống kê</h3>
                        <p className="text-gray-300">Tổng số đơn hàng: <span className="font-bold text-emerald-400">{routesData.totalOrders}</span></p>
                        <p className="text-gray-300">Tổng số cụm (Shipper): <span className="font-bold text-emerald-400">{routesData.totalRoutes}</span></p>
                    </div>

                    <div className="bg-gray-700 p-4 rounded-lg max-h-[600px] overflow-y-auto">
                        <h3 className="text-lg font-semibold text-white mb-2">Chi tiết Lộ trình</h3>
                        {routes.map((route, idx) => (
                            <div 
                                key={route.clusterId} 
                                onClick={() => setSelectedClusterId(selectedClusterId === route.clusterId ? null : route.clusterId)}
                                className={`mb-4 p-3 rounded cursor-pointer transition-all border-l-4 ${
                                    selectedClusterId === route.clusterId ? 'bg-gray-500 ring-2 ring-emerald-400' : 'bg-gray-600 hover:bg-gray-500'
                                }`} 
                                style={{ borderColor: colors[idx % colors.length] }}
                            >
                                <p className="font-bold text-white mb-1">Shipper {route.clusterId}</p>
                                <p className="text-sm text-gray-300">Số đơn: {route.numOrders}</p>
                                <p className="text-sm text-gray-300 mb-2">Quãng đường: {route.totalDistanceKm} km</p>
                                
                                <div className="text-xs text-gray-400 mt-2 space-y-1">
                                    <p className="font-semibold text-emerald-400">Xuất phát: Kho trung tâm</p>
                                    {route.route.map((order, orderIdx) => (
                                        <p key={order._id} className="ml-2">
                                            ↓ Điểm {orderIdx + 1}: {order.shippingAddress || "Không rõ địa chỉ"} 
                                            <span className="text-gray-500"> ({order.user?.name || "Khách Vãng Lai"})</span>
                                        </p>
                                    ))}
                                    <p className="font-semibold text-emerald-400 mt-1">↓ Trở về Kho</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-3 h-[600px] rounded-lg overflow-hidden border-2 border-gray-700">
                    <MapContainer center={[warehouse.lat, warehouse.lng]} zoom={12} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
                        {/* Dark theme map tiles */}
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        />

                        {/* Warehouse Marker */}
                        <Marker position={[warehouse.lat, warehouse.lng]} icon={warehouseIcon}>
                            <Popup>
                                <strong className="text-black">KHO HÀNG TRUNG TÂM</strong>
                            </Popup>
                        </Marker>

                        {/* Routes and Order Markers */}
                        {routes
                            .filter(routeData => selectedClusterId === null || selectedClusterId === routeData.clusterId)
                            .map((routeData, idx) => {
                            // Find original index to keep color consistent
                            const originalIdx = routes.findIndex(r => r.clusterId === routeData.clusterId);
                            const color = colors[originalIdx % colors.length];
                            
                            // Create array of positions for the polyline: Warehouse -> Order 1 -> Order 2 ... -> Warehouse
                            const positions = [
                                [warehouse.lat, warehouse.lng],
                                ...routeData.route.map(order => [order.location.lat, order.location.lng]),
                                [warehouse.lat, warehouse.lng]
                            ];

                            return (
                                <React.Fragment key={routeData.clusterId}>
                                    <Polyline positions={positions} color={color} weight={4} opacity={0.8} dashArray="5, 10" />
                                    
                                    {routeData.route.map((order, orderIdx) => (
                                        <Marker 
                                            key={order._id} 
                                            position={[order.location.lat, order.location.lng]}
                                        >
                                            <Popup>
                                                <div className="text-black text-sm max-w-xs">
                                                    <strong className="text-emerald-600 text-base">Shipper {routeData.clusterId} - Điểm {orderIdx + 1}</strong><br />
                                                    <span className="font-semibold">Khách hàng:</span> {order.user?.name || "Khách Vãng Lai"}<br />
                                                    <span className="font-semibold">SĐT:</span> {order.phoneNumber || "Không có"}<br />
                                                    <span className="font-semibold">Địa chỉ:</span> {order.shippingAddress || "Không rõ địa chỉ"}<br />
                                                    <span className="font-semibold">Giá trị:</span> <span className="text-emerald-600 font-bold">${order.totalAmount}</span>
                                                </div>
                                            </Popup>
                                        </Marker>
                                    ))}
                                </React.Fragment>
                            );
                        })}
                    </MapContainer>
                </div>
            </div>
        </div>
    );
};

export default DeliveryMap;
