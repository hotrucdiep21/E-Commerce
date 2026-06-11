import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProductStore } from '../stores/useProductStore';
import { useCartStore } from '../stores/useCartStore';
import { useUserStore } from '../stores/useUserStore';
import LoadingSpinner from '../components/LoadingSpinner';
import { ShoppingCart, Heart, Star, ChevronRight, Leaf, Truck, Search } from 'lucide-react';
import toast from 'react-hot-toast';

const ProductDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentProduct, fetchProductById, loading } = useProductStore();
    const { addToCart } = useCartStore();
    const { user } = useUserStore();
    const [selectedSize, setSelectedSize] = useState('14"');
    const [selectedColor, setSelectedColor] = useState('black');

    useEffect(() => {
        fetchProductById(id);
    }, [id, fetchProductById]);

    const handleAddToCart = () => {
        if (!user) {
            toast.error("Please login to add products to cart", { id: "login" });
            navigate('/login');
            return;
        }
        addToCart(currentProduct);
        toast.success("Product added to cart", { id: "cart" });
    };

    if (loading || !currentProduct) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <LoadingSpinner />
            </div>
        );
    }

    // Mock data for UI fidelity based on design image
    const mockRating = 4.8;
    const mockReviews = 120;
    const mockSizes = ['14"', '16"'];
    const mockColors = [
        { name: 'black', class: 'bg-black' },
        { name: 'grey', class: 'bg-gray-500' }
    ];

    return (
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 mt-10'>
            {/* Breadcrumb */}
            <div className='flex items-center text-sm text-gray-400 mb-8'>
                <Link to="/" className='hover:text-emerald-400'>Home</Link>
                <ChevronRight className='mx-2' size={16} />
                <Link to={`/category/${currentProduct.category}`} className='hover:text-emerald-400 capitalize'>
                    {currentProduct.category}
                </Link>
                <ChevronRight className='mx-2' size={16} />
                <span className='text-emerald-400 truncate max-w-[200px] sm:max-w-md'>{currentProduct.name}</span>
            </div>

            <div className='flex flex-col lg:flex-row gap-12'>
                {/* Left Column - Images */}
                <div className='w-full lg:w-1/2 flex flex-col'>
                    <div className='bg-gray-800 rounded-xl overflow-hidden mb-4 border border-gray-700 relative group flex items-center justify-center p-8 min-h-[400px]'>
                        <img 
                            src={currentProduct.image} 
                            alt={currentProduct.name} 
                            className='w-full h-auto object-cover object-center transition-transform duration-500 group-hover:scale-105 rounded-xl'
                        />
                        <div className='absolute bottom-4 left-4 bg-gray-900 bg-opacity-70 px-3 py-1.5 rounded-full text-xs text-white flex items-center backdrop-blur-sm'>
                            <Search className='mr-2' size={14} /> HOVER TO ZOOM
                        </div>
                    </div>
                    {/* Thumbnail gallery placeholders */}
                    <div className='flex gap-4'>
                        {[1,2,3,4].map((item, index) => (
                            <div key={item} className={`w-20 h-20 bg-gray-800 rounded-lg border flex items-center justify-center p-2 ${index===0 ? 'border-emerald-500' : 'border-gray-700'} overflow-hidden cursor-pointer hover:border-gray-500 transition-colors`}>
                                <img src={currentProduct.image} alt="thumbnail" className='w-full h-full object-cover opacity-80 hover:opacity-100 rounded-md'/>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column - Product Info */}
                <div className='w-full lg:w-1/2 flex flex-col text-white'>
                    <h1 className='text-4xl sm:text-5xl font-bold mb-3 leading-tight'>{currentProduct.name}</h1>
                    
                    {/* Rating */}
                    <div className='flex items-center mb-6'>
                        <div className='flex text-emerald-400'>
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={16} className={i < Math.floor(mockRating) ? 'fill-current' : ''} />
                            ))}
                        </div>
                        <span className='ml-2 font-medium'>{mockRating}</span>
                        <span className='ml-2 text-gray-400 underline cursor-pointer hover:text-emerald-400'>
                            ({mockReviews} Reviews)
                        </span>
                    </div>

                    {/* Price */}
                    <div className='text-5xl font-bold text-emerald-400 mb-8'>
                        ${currentProduct.price.toFixed(2)}
                    </div>

                    {/* Description */}
                    <div className='mb-8'>
                        <h3 className='text-sm font-semibold text-gray-300 tracking-wider mb-3 uppercase'>Description</h3>
                        <p className='text-gray-400 leading-relaxed'>
                            {currentProduct.description}
                        </p>
                    </div>

                    {/* Color Selection */}
                    <div className='mb-8'>
                        <h3 className='text-sm font-semibold text-gray-300 tracking-wider mb-3 uppercase'>
                            Color: <span className='text-white capitalize'>{selectedColor}</span>
                        </h3>
                        <div className='flex gap-3'>
                            {mockColors.map(color => (
                                <button
                                    key={color.name}
                                    onClick={() => setSelectedColor(color.name)}
                                    className={`w-8 h-8 rounded-full ${color.class} ${selectedColor === color.name ? 'ring-2 ring-emerald-500 ring-offset-2 ring-offset-gray-900' : 'border border-gray-600'}`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Size Selection */}
                    <div className='mb-8'>
                        <h3 className='text-sm font-semibold text-gray-300 tracking-wider mb-3 uppercase'>Size</h3>
                        <div className='flex gap-4'>
                            {mockSizes.map(size => (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    className={`px-6 py-2 rounded-md border ${selectedSize === size ? 'border-emerald-500 text-emerald-400 bg-gray-800' : 'border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white'} transition-colors font-medium`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className='flex gap-4 mb-10'>
                        <button
                            onClick={handleAddToCart}
                            className='flex-1 bg-emerald-500 hover:bg-emerald-400 text-gray-900 font-bold py-4 px-8 rounded-md flex items-center justify-center transition-colors'
                        >
                            <ShoppingCart className='mr-2' size={20} />
                            ADD TO CART
                        </button>
                        <button className='w-14 flex items-center justify-center border border-gray-700 rounded-md text-gray-400 hover:text-emerald-400 hover:border-emerald-500 transition-colors'>
                            <Heart size={24} />
                        </button>
                    </div>

                    {/* Badges */}
                    <div className='flex flex-col sm:flex-row gap-6 pt-6 border-t border-gray-800'>
                        <div className='flex items-center text-sm text-gray-400'>
                            <div className='w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center mr-3 text-emerald-400'>
                                <Leaf size={20} />
                            </div>
                            <div>
                                <span className='block font-semibold text-white'>Sustainable</span>
                                100% Recycled Fabric
                            </div>
                        </div>
                        <div className='flex items-center text-sm text-gray-400'>
                            <div className='w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center mr-3 text-emerald-400'>
                                <Truck size={20} />
                            </div>
                            <div>
                                <span className='block font-semibold text-white'>Free Shipping</span>
                                On orders over $150
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;
