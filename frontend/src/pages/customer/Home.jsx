import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axios.js';
import { useCartStore } from '../../store/cartStore.js';
import { useAuthStore } from '../../store/authStore.js';
import { formatCurrency } from '../../utils/formatters.js';
import toast from 'react-hot-toast';
import { Search, SlidersHorizontal, Heart, ShoppingCart, Star, X } from 'lucide-react';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [inStock, setInStock] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const { isAuthenticated, role } = useAuthStore();
  const fetchCart = useCartStore((state) => state.fetchCart);

  const categories = [
    { name: 'All Categories', slug: '' },
    { name: 'Electronics', slug: 'electronics' },
    { name: 'Fashion', slug: 'fashion' },
    { name: 'Home & Kitchen', slug: 'home-kitchen' }
  ];

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 8,
        search,
        category,
        sortBy,
        minPrice: minPrice || undefined,
        maxPrice: maxPrice || undefined,
        inStock: inStock ? 'true' : undefined
      };
      
      const response = await axiosInstance.get('/products', { params });
      setProducts(response.data.data.products);
      setTotalPages(response.data.data.totalPages || 1);
    } catch (err) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category, sortBy, inStock, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const handleClearFilters = () => {
    setSearch('');
    setCategory('');
    setSortBy('newest');
    setMinPrice('');
    setMaxPrice('');
    setInStock(false);
    setPage(1);
  };

  const handleAddToCart = async (productId) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }
    if (role !== 'USER') {
      toast.error('Only customers can add items to cart');
      return;
    }

    try {
      await axiosInstance.post('/cart/items', { productId, quantity: 1 });
      await fetchCart();
      toast.success('Product added to cart');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    }
  };

  const handleAddToWishlist = async (productId) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to wishlist');
      return;
    }
    try {
      await axiosInstance.post('/wishlist', { productId });
      toast.success('Product added to wishlist');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to wishlist');
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Banner Section */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-brand-600 to-indigo-600 dark:from-brand-900 dark:to-indigo-950 px-6 py-12 md:py-20 text-white shadow-xl">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="relative max-w-2xl space-y-4">
          <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold uppercase tracking-wider">
            Phase 1 Live
          </span>
          <h1 className="heading-display text-4xl md:text-6xl font-extrabold leading-tight">
            Next-Gen E-Commerce for Fast Growth
          </h1>
          <p className="text-slate-200 text-sm md:text-lg">
            Shop premium electronics, high-grade home essentials, and modern fashion crafted by verified vendors worldwide.
          </p>
        </div>
      </div>

      {/* Filter and search panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products by name or description..."
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-dark-900 border border-slate-300 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all text-sm shadow-sm"
          />
          <button type="submit" className="absolute left-3 top-3 text-slate-400">
            <Search className="w-4 h-4" />
          </button>
        </form>

        {/* Filter controls */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 px-4 py-2.5 border rounded-xl text-sm font-semibold transition-all ${
              showFilters 
                ? 'bg-brand-50 text-brand-600 border-brand-200 dark:bg-brand-950/20 dark:text-brand-400 dark:border-brand-900' 
                : 'bg-white dark:bg-dark-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-800'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
          </button>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2.5 bg-white dark:bg-dark-900 border border-slate-300 dark:border-slate-800 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all shadow-sm"
          >
            <option value="newest">Newest Arrivals</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <div className="p-6 bg-white dark:bg-dark-900 rounded-2xl border border-slate-200 dark:border-slate-800 grid grid-cols-1 md:grid-cols-4 gap-6 animate-fade-in shadow-sm">
          {/* Categories */}
          <div>
            <span className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Category</span>
            <div className="flex flex-col space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => { setCategory(cat.slug); setPage(1); }}
                  className={`text-left px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    category === cat.slug
                      ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/30 dark:text-brand-400'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-dark-800'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-3">
            <span className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Price Range</span>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="Min"
                className="w-full px-3 py-1.5 text-sm bg-slate-50 dark:bg-dark-950 border border-slate-300 dark:border-slate-800 rounded-lg focus:outline-none"
              />
              <span className="text-slate-400">-</span>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Max"
                className="w-full px-3 py-1.5 text-sm bg-slate-50 dark:bg-dark-950 border border-slate-300 dark:border-slate-800 rounded-lg focus:outline-none"
              />
            </div>
          </div>

          {/* Extra Checks */}
          <div className="flex flex-col space-y-3 justify-center">
            <label className="flex items-center space-x-2 text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={inStock}
                onChange={(e) => setInStock(e.target.checked)}
                className="rounded text-brand-600 focus:ring-brand-500"
              />
              <span>In stock items only</span>
            </label>
          </div>

          {/* Reset Filters */}
          <div className="flex items-end">
            <button
              onClick={handleClearFilters}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-dark-800 dark:hover:bg-dark-750 text-slate-700 dark:text-slate-200 font-semibold rounded-lg transition-colors text-sm"
            >
              <X className="w-4 h-4" />
              <span>Reset Filters</span>
            </button>
          </div>
        </div>
      )}

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse space-y-4">
              <div className="aspect-square bg-slate-200 dark:bg-dark-850 rounded-2xl w-full"></div>
              <div className="h-4 bg-slate-200 dark:bg-dark-850 rounded w-2/3"></div>
              <div className="h-4 bg-slate-200 dark:bg-dark-850 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-dark-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
          <p className="text-slate-500 dark:text-slate-400">No products found matching filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => {
            const hasDiscount = parseFloat(product.compareAtPrice) > parseFloat(product.price);
            const isOutOfStock = product.stock <= 0;

            // Media extraction
            const primaryMedia = product.media && product.media.length > 0
              ? product.media.find(m => m.type === 'IMAGE')?.url || product.media[0].url
              : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500';

            return (
              <div
                key={product.id}
                className="group relative flex flex-col bg-white dark:bg-dark-900 rounded-2xl border border-slate-200 dark:border-slate-850 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
              >
                {/* Media Image container */}
                <div className="aspect-square w-full bg-slate-50 dark:bg-dark-950 relative overflow-hidden">
                  <Link to={`/product/${product.id}`}>
                    <img
                      src={primaryMedia.startsWith('http') ? primaryMedia : `http://localhost:5000${primaryMedia}`}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>

                  {/* Slashed off Badge */}
                  {hasDiscount && (
                    <span className="absolute top-3 left-3 bg-brand-600 text-white text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-full shadow-sm">
                      Sale
                    </span>
                  )}

                  {/* Wishlist Button */}
                  <button
                    onClick={() => handleAddToWishlist(product.id)}
                    className="absolute top-3 right-3 p-2 bg-white/80 dark:bg-dark-900/80 hover:bg-white dark:hover:bg-dark-900 rounded-full text-slate-500 hover:text-red-500 shadow-sm transition-colors"
                    title="Add to Wishlist"
                  >
                    <Heart className="w-4 h-4" />
                  </button>
                </div>

                {/* Body Details */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    {/* Category Label */}
                    <div className="flex justify-between items-center text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      <span>{product.category?.name || 'General'}</span>
                      {product.averageRating && (
                        <span className="flex items-center text-amber-500">
                          <Star className="w-3.5 h-3.5 fill-current mr-0.5" />
                          {parseFloat(product.averageRating).toFixed(1)}
                        </span>
                      )}
                    </div>
                    {/* Product Name */}
                    <Link to={`/product/${product.id}`} className="block">
                      <h3 className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors text-sm line-clamp-1">
                        {product.name}
                      </h3>
                    </Link>
                    {/* Description */}
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-auto flex items-center justify-between">
                    {/* Prices */}
                    <div className="flex items-baseline space-x-1.5">
                      <span className="text-base font-bold text-slate-800 dark:text-slate-100">
                        {formatCurrency(product.price)}
                      </span>
                      {hasDiscount && (
                        <span className="text-xs text-slate-400 line-through">
                          {formatCurrency(product.compareAtPrice)}
                        </span>
                      )}
                    </div>

                    {/* Cart Button */}
                    <button
                      onClick={() => handleAddToCart(product.id)}
                      disabled={isOutOfStock}
                      className="p-2 rounded-lg bg-brand-600 hover:bg-brand-700 disabled:bg-slate-200 dark:disabled:bg-dark-800 text-white disabled:text-slate-400 transition-colors cursor-pointer"
                      title={isOutOfStock ? 'Out of stock' : 'Add to Cart'}
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 pt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 border rounded-lg hover:bg-slate-50 dark:hover:bg-dark-800 text-sm font-semibold disabled:opacity-40 transition-colors"
          >
            Previous
          </button>
          <span className="text-sm font-medium text-slate-600 dark:text-slate-450">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 border rounded-lg hover:bg-slate-50 dark:hover:bg-dark-800 text-sm font-semibold disabled:opacity-40 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
