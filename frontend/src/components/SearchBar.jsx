import React, { useState, useEffect, useRef } from 'react';
import { Search, ShoppingCart } from 'lucide-react';
import axios from '../lib/axios';
import { useCartStore } from '../stores/useCartStore';
import { useUserStore } from '../stores/useUserStore';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);
  const { user } = useUserStore();
  const { addToCart } = useCartStore();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      if (query.trim().length === 0) {
        setResults([]);
        setIsOpen(false);
        return;
      }
      try {
        const res = await axios.get(`/products/search/autocomplete?q=${query}`);
        setResults(res.data);
        setIsOpen(true);
      } catch (error) {
        console.error("Search error:", error);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchResults();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    if (!user) {
        toast.error("Please login to add products to cart", { id: "login" });
        return;
    }
    addToCart(product);
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-xs sm:max-w-md mx-4 hidden sm:block">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-md leading-5 bg-gray-800 text-gray-300 placeholder-gray-400 focus:outline-none focus:bg-gray-900 focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm transition duration-150 ease-in-out"
          placeholder="Search collections..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { if (results.length > 0) setIsOpen(true); }}
        />
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute z-50 mt-1 w-full bg-gray-800 border border-gray-700 rounded-md shadow-lg overflow-hidden">
          <ul className="max-h-96 overflow-y-auto">
            {results.map((product) => (
              <li 
                key={product._id} 
                onClick={() => {
                    navigate(`/product/${product._id}`);
                    setIsOpen(false);
                    setQuery('');
                }}
                className="flex items-center px-4 py-3 border-b border-gray-700 hover:bg-gray-700 transition duration-150 ease-in-out cursor-pointer"
              >
                <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded-md" />
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-white hover:text-emerald-400">{product.name}</p>
                  <p className="text-sm text-emerald-400">${product.price}</p>
                </div>
                <button
                  onClick={(e) => handleAddToCart(e, product)}
                  className="p-2 text-gray-400 hover:text-emerald-400 transition-colors"
                  title="Add to cart"
                >
                  <ShoppingCart size={18} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
