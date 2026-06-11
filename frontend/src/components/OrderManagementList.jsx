import { motion } from "framer-motion";
import { Eye, Pencil } from "lucide-react";
import { useOrderStore } from "../stores/useOrderStore";
import { useEffect, useState } from "react";

const OrderManagementList = () => {
    const { fetchAllOrders, orders, loading, updateDeliveryStatus } = useOrderStore();
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchAllOrders();
    }, [fetchAllOrders]);

    if (loading) {
        return <div className="text-center text-gray-300 mt-10">Loading orders...</div>;
    }

    const itemsPerPage = 5;
    const totalPages = Math.ceil((orders?.length || 0) / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentOrders = orders?.slice(startIndex, endIndex) || [];

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <motion.div
            className='bg-gray-800 shadow-lg rounded-lg overflow-hidden max-w-7xl mx-auto'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            <div className='overflow-x-auto'>
                <table className='min-w-full divide-y divide-gray-700'>
                    <thead className='bg-gray-700'>
                        <tr>
                            <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>
                                Order ID
                            </th>
                            <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>
                                Customer Name
                            </th>
                            <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>
                                Delivery Status
                            </th>
                            <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>
                                Payment Status
                            </th>
                            <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>
                                Payment Method
                            </th>
                            <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>
                                Phone Number
                            </th>
                            <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>
                                Shipping Address
                            </th>
                            <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className='bg-gray-800 divide-y divide-gray-700'>
                        {currentOrders.length === 0 ? (
                            <tr>
                                <td colSpan="8" className="px-6 py-4 text-center text-gray-300">No orders found.</td>
                            </tr>
                        ) : (
                            currentOrders.map((order) => (
                                <tr key={order._id} className='hover:bg-gray-700'>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-emerald-400'>
                                        #{order._id.substring(order._id.length - 8).toUpperCase()}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
                                        {order.user?.name || "Unknown"}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        <select
                                            value={order.deliveryStatus}
                                            onChange={(e) => updateDeliveryStatus(order._id, e.target.value)}
                                            className={`px-2 py-1 outline-none text-xs leading-5 font-semibold rounded-full ${order.deliveryStatus === "Delivered" ? "bg-emerald-100/10 text-emerald-500 border border-emerald-500" : "bg-gray-600 text-gray-300 border border-gray-500"}`}
                                        >
                                            <option value="Pending" className="bg-gray-800 text-white">Pending</option>
                                            <option value="Shipped" className="bg-gray-800 text-white">Shipped</option>
                                            <option value="Delivered" className="bg-emerald-900 text-emerald-400">Delivered</option>
                                        </select>
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.paymentStatus === "Paid" ? "bg-emerald-100/10 text-emerald-500" : "bg-gray-600 text-gray-300"}`}>
                                            {order.paymentStatus}
                                        </span>
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
                                        {order.paymentMethod}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
                                        {order.phoneNumber || "Not Provided"}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300 max-w-xs truncate' title={order.shippingAddress}>
                                        {order.shippingAddress}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-3'>
                                        <button className='text-gray-400 hover:text-white transition-colors'>
                                            <Eye className='h-4 w-4' />
                                        </button>
                                        <button className='text-gray-400 hover:text-white transition-colors'>
                                            <Pencil className='h-4 w-4' />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="bg-gray-800 px-6 py-4 border-t border-gray-700 flex items-center justify-between">
                    <div className="text-sm text-gray-400">
                        Showing {startIndex + 1} to {Math.min(endIndex, orders?.length || 0)} of {orders?.length || 0} orders
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`px-2 py-1 rounded ${currentPage === 1 ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 hover:text-white'}`}
                        >
                            &lt;
                        </button>
                        
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => handlePageChange(i + 1)}
                                className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-emerald-500 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`px-2 py-1 rounded ${currentPage === totalPages ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 hover:text-white'}`}
                        >
                            &gt;
                        </button>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default OrderManagementList;
