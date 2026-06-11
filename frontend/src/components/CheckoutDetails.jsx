import { motion } from "framer-motion";
import { useCartStore } from "../stores/useCartStore";
import { MapPin, CreditCard } from "lucide-react";

const CheckoutDetails = () => {
    const { shippingAddress, paymentMethod, setShippingAddress, setPaymentMethod } = useCartStore();

    const handleAddressChange = (e) => {
        setShippingAddress({ [e.target.name]: e.target.value });
    };

    return (
        <div className="space-y-6 mt-6">
            <motion.div
                className='bg-gray-800 shadow-lg rounded-lg border border-gray-700 overflow-hidden'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                <div className='p-6'>
                    <h3 className='text-lg font-semibold text-white flex items-center mb-4'>
                        <MapPin className="text-emerald-400 mr-2" size={20} />
                        Shipping Address
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Detailed Address</label>
                            <textarea
                                name="address"
                                value={shippingAddress.address}
                                onChange={handleAddressChange}
                                placeholder="Street, building number, apartment, city..."
                                className="w-full bg-gray-900 border border-gray-600 rounded-md p-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                                rows="3"
                            ></textarea>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
                                <input
                                    type="text"
                                    name="phoneNumber"
                                    value={shippingAddress.phoneNumber}
                                    onChange={handleAddressChange}
                                    placeholder="+1 (555) 000-0000"
                                    className="w-full bg-gray-900 border border-gray-600 rounded-md p-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-300 mb-1">Postal Code</label>
                                <input
                                    type="text"
                                    name="postalCode"
                                    value={shippingAddress.postalCode}
                                    onChange={handleAddressChange}
                                    placeholder="12345"
                                    className="w-full bg-gray-900 border border-gray-600 rounded-md p-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            <motion.div
                className='bg-gray-800 shadow-lg rounded-lg border border-gray-700 overflow-hidden'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <div className='p-6'>
                    <h3 className='text-lg font-semibold text-white flex items-center mb-4'>
                        <CreditCard className="text-emerald-400 mr-2" size={20} />
                        Payment Method
                    </h3>
                    <div className="flex gap-4">
                        <label className={`flex-1 flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'Credit Card' ? 'border-emerald-500 bg-emerald-500/10' : 'border-gray-600 bg-gray-900 hover:border-gray-500'}`}>
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="Credit Card"
                                checked={paymentMethod === 'Credit Card'}
                                onChange={() => setPaymentMethod('Credit Card')}
                                className="w-4 h-4 text-emerald-500 focus:ring-emerald-500 border-gray-600 bg-gray-700 rounded-full"
                            />
                            <div className="ml-3">
                                <span className="block text-sm font-semibold text-white">Credit Card</span>
                                <span className="block text-xs text-gray-400">Visa, Mastercard</span>
                            </div>
                        </label>
                        <label className={`flex-1 flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'Cash on Delivery' ? 'border-emerald-500 bg-emerald-500/10' : 'border-gray-600 bg-gray-900 hover:border-gray-500'}`}>
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="Cash on Delivery"
                                checked={paymentMethod === 'Cash on Delivery'}
                                onChange={() => setPaymentMethod('Cash on Delivery')}
                                className="w-4 h-4 text-emerald-500 focus:ring-emerald-500 border-gray-600 bg-gray-700 rounded-full"
                            />
                            <div className="ml-3">
                                <span className="block text-sm font-semibold text-white uppercase">CASH ON DELIVERY</span>
                                <span className="block text-xs text-gray-400">Pay when received</span>
                            </div>
                        </label>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default CheckoutDetails;
