import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axios.js';
import { formatCurrency } from '../../utils/formatters.js';
import toast from 'react-hot-toast';
import { ShoppingBag, Plus, Trash2, Edit, Camera, Film, Loader2, X, Eye } from 'lucide-react';

export default function VendorProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modals state
  const [showFormModal, setShowFormModal] = useState(false);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Product details form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [compareAtPrice, setCompareAtPrice] = useState('');
  const [stock, setStock] = useState('');
  const [sku, setSku] = useState('');
  const [returnWindowDays, setReturnWindowDays] = useState(7);
  const [categoryId, setCategoryId] = useState('');
  const [savingProduct, setSavingProduct] = useState(false);

  // Media files state
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [uploadingMedia, setUploadingMedia] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/vendor/products');
      const prodList = res.data.data || [];
      setProducts(prodList);

      // Extract unique categories from products to populate dropdown
      const uniqueCats = [];
      prodList.forEach(p => {
        if (p.category && !uniqueCats.find(c => c.id === p.category.id)) {
          uniqueCats.push(p.category);
        }
      });
      
      // If we don't have categories, let's fetch a list of general products to find categories
      if (uniqueCats.length === 0) {
        const resAll = await axiosInstance.get('/products');
        resAll.data.data.products.forEach(p => {
          if (p.category && !uniqueCats.find(c => c.id === p.category.id)) {
            uniqueCats.push(p.category);
          }
        });
      }
      setCategories(uniqueCats);
    } catch (err) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenCreateModal = () => {
    setSelectedProduct(null);
    setName('');
    setDescription('');
    setPrice('');
    setCompareAtPrice('');
    setStock('');
    setSku('');
    setReturnWindowDays(7);
    setCategoryId(categories[0]?.id || '');
    setShowFormModal(true);
  };

  const handleOpenEditModal = (p) => {
    setSelectedProduct(p);
    setName(p.name);
    setDescription(p.description || '');
    setPrice(p.price);
    setCompareAtPrice(p.compareAtPrice || '');
    setStock(p.stock);
    setSku(p.sku || '');
    setReturnWindowDays(p.returnWindowDays);
    setCategoryId(p.categoryId || '');
    setShowFormModal(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setSavingProduct(true);
    try {
      const payload = {
        name,
        description: description || undefined,
        price: parseFloat(price),
        compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
        stock: parseInt(stock),
        sku: sku || undefined,
        returnWindowDays: parseInt(returnWindowDays),
        categoryId: categoryId || null
      };

      if (selectedProduct) {
        // Edit existing product
        await axiosInstance.put(`/products/${selectedProduct.id}`, payload);
        toast.success('Product updated successfully');
      } else {
        // Create new product
        const res = await axiosInstance.post('/products', payload);
        toast.success('Product created successfully! Upload media next.');
        // Auto open media upload for new product
        setSelectedProduct(res.data.data);
        setShowMediaModal(true);
      }
      setShowFormModal(false);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product details');
    } finally {
      setSavingProduct(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product? (This can be undone by admins)')) return;
    try {
      await axiosInstance.delete(`/products/${productId}`);
      toast.success('Product deleted successfully');
      fetchProducts();
    } catch (err) {
      toast.error('Failed to delete product');
    }
  };

  const handleOpenMediaModal = (product) => {
    setSelectedProduct(product);
    setSelectedImages([]);
    setSelectedVideo(null);
    setShowMediaModal(true);
  };

  const handleUploadMedia = async (e) => {
    e.preventDefault();
    if (selectedImages.length === 0 && !selectedVideo) {
      toast.error('Please select at least one image or video to upload');
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < selectedImages.length; i++) {
      formData.append('images', selectedImages[i]);
    }
    if (selectedVideo) {
      formData.append('video', selectedVideo);
    }

    setUploadingMedia(true);
    try {
      await axiosInstance.post(`/products/${selectedProduct.id}/media`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Media uploaded successfully!');
      setShowMediaModal(false);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload media. Ensure size limits (images < 2MB, video < 10MB)');
    } finally {
      setUploadingMedia(false);
    }
  };

  const handleDeleteMedia = async (productId, mediaId) => {
    if (!window.confirm('Delete this media?')) return;
    try {
      await axiosInstance.delete(`/products/${productId}/media/${mediaId}`);
      toast.success('Media deleted successfully');
      fetchProducts();
      // Reload details inside media modal if it's active
      const res = await axiosInstance.get(`/products/${productId}`);
      setSelectedProduct(res.data.data);
    } catch (err) {
      toast.error('Failed to delete media');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-baseline border-b pb-4">
        <h1 className="heading-display text-3xl font-extrabold text-slate-800 dark:text-slate-100">
          My Products
        </h1>
        <button
          onClick={handleOpenCreateModal}
          className="flex items-center space-x-2 px-4 py-2.5 bg-brand-650 hover:bg-brand-700 text-white font-bold rounded-xl shadow-md transition-colors cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          <span>Add Product</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-40">
          <Loader2 className="w-12 h-12 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-dark-900 rounded-2xl border border-dashed">
          <p className="text-slate-500 italic">No products registered yet. Click Add Product above to start selling!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => {
            const hasMedia = product.media && product.media.length > 0;
            const primaryImage = hasMedia
              ? product.media.find(m => m.type === 'IMAGE')?.url || product.media[0].url
              : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200';

            return (
              <div
                key={product.id}
                className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-850 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between"
              >
                <div className="aspect-video w-full bg-slate-50 dark:bg-dark-950 relative border-b">
                  <img
                    src={primaryImage.startsWith('http') ? primaryImage : `http://localhost:5000${primaryImage}`}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Status Indicator */}
                  <span className={`absolute top-3 left-3 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                    product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-105 text-red-800'
                  }`}>
                    {product.isActive ? 'Active' : 'Draft'}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{product.category?.name || 'General'}</span>
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 line-clamp-1">{product.name}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2">{product.description}</p>
                  </div>

                  <div className="flex justify-between items-baseline text-xs font-semibold">
                    <span className="text-slate-500">Stock: <span className="font-bold text-slate-805 dark:text-slate-200">{product.stock} units</span></span>
                    <span className="text-sm font-bold text-brand-650">{formatCurrency(product.price)}</span>
                  </div>

                  <div className="pt-2 border-t flex justify-between space-x-2">
                    <button
                      onClick={() => handleOpenMediaModal(product)}
                      className="px-2.5 py-1.5 border hover:bg-slate-50 dark:hover:bg-dark-850 text-xs font-semibold rounded-lg flex items-center transition-colors cursor-pointer"
                      title="Manage Media Gallery"
                    >
                      <Camera className="w-3.5 h-3.5 mr-1" />
                      Gallery ({product.media?.length || 0})
                    </button>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleOpenEditModal(product)}
                        className="p-1.5 border hover:bg-slate-50 dark:hover:bg-dark-850 text-slate-500 rounded-lg transition-colors cursor-pointer"
                        title="Edit Details"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-1.5 border hover:bg-red-50 dark:hover:bg-red-950/20 text-red-500 rounded-lg transition-colors cursor-pointer"
                        title="Delete Product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 1. Form Modal (Create or Edit Product details) */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveProduct}
            className="w-full max-w-2xl bg-white dark:bg-dark-900 border p-6 rounded-2xl space-y-4 shadow-2xl overflow-y-auto max-h-[90vh]"
          >
            <div>
              <h3 className="heading-display text-lg font-bold">{selectedProduct ? 'Edit Product Details' : 'Create New Product'}</h3>
              <p className="text-xs text-slate-400">Products are active immediately but will only display to customers if vendor is verified.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Product Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Apex smart watch"
                  className="w-full px-3 py-2 bg-slate-55 dark:bg-dark-950 border rounded-lg text-sm focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Category</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-55 dark:bg-dark-950 border rounded-lg text-sm focus:outline-none"
                >
                  <option value="">No Category</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Price (USD)</label>
                <input
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="49.99"
                  className="w-full px-3 py-2 bg-slate-55 dark:bg-dark-950 border rounded-lg text-sm focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Compare-at Price (slashed price)</label>
                <input
                  type="number"
                  step="0.01"
                  value={compareAtPrice}
                  onChange={(e) => setCompareAtPrice(e.target.value)}
                  placeholder="79.99"
                  className="w-full px-3 py-2 bg-slate-55 dark:bg-dark-950 border rounded-lg text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Stock Quantity</label>
                <input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="100"
                  className="w-full px-3 py-2 bg-slate-55 dark:bg-dark-950 border rounded-lg text-sm focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">SKU ID</label>
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="APX-WT-900"
                  className="w-full px-3 py-2 bg-slate-55 dark:bg-dark-950 border rounded-lg text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Return Window Days</label>
                <input
                  type="number"
                  value={returnWindowDays}
                  onChange={(e) => setReturnWindowDays(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-55 dark:bg-dark-950 border rounded-lg text-sm focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Product characteristics details..."
                className="w-full px-3 py-2 bg-slate-55 dark:bg-dark-950 border rounded-lg text-sm focus:outline-none resize-none"
              />
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowFormModal(false)}
                className="flex-1 py-2.5 border rounded-lg text-sm font-semibold hover:bg-slate-5"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={savingProduct}
                className="flex-1 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold rounded-lg text-sm"
              >
                {savingProduct ? 'Saving...' : 'Save Details'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 2. Media Modal (Manage Gallery & Upload media) */}
      {showMediaModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white dark:bg-dark-900 border p-6 rounded-2xl space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b pb-4">
              <div>
                <h3 className="heading-display text-lg font-bold">Product Media Gallery</h3>
                <p className="text-xs text-slate-450">{selectedProduct?.name}</p>
              </div>
              <button onClick={() => setShowMediaModal(false)} className="p-1 hover:bg-slate-100 rounded-full">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* List current media */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current Media ({selectedProduct?.media?.length || 0})</h4>
              {selectedProduct?.media?.length === 0 ? (
                <p className="text-xs text-slate-405 italic">No images or videos uploaded for this product yet.</p>
              ) : (
                <div className="grid grid-cols-4 gap-2">
                  {selectedProduct?.media?.map((med) => (
                    <div key={med.id} className="relative aspect-square border rounded-lg overflow-hidden group">
                      <img src={med.type === 'VIDEO' ? 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100' : (med.url.startsWith('http') ? med.url : `http://localhost:5000${med.url}`)} alt="" className="w-full h-full object-cover" />
                      {med.type === 'VIDEO' && (
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-white">
                          <Film className="w-5 h-5" />
                        </div>
                      )}
                      
                      {/* Delete button hover overlay */}
                      <button
                        onClick={() => handleDeleteMedia(selectedProduct.id, med.id)}
                        className="absolute inset-0 bg-red-600/70 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Upload media form */}
            <form onSubmit={handleUploadMedia} className="space-y-4 pt-4 border-t">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Upload New Media</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Images field */}
                <div className="p-4 border border-dashed rounded-xl space-y-2">
                  <span className="text-xs font-bold flex items-center text-slate-600">
                    <Camera className="w-4 h-4 mr-1 text-slate-500" />
                    Select Images (Max 8)
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => setSelectedImages(Array.from(e.target.files))}
                    className="w-full text-xs text-slate-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
                  />
                  {selectedImages.length > 0 && (
                    <span className="text-[10px] text-brand-600 block">{selectedImages.length} images selected</span>
                  )}
                </div>

                {/* Video field */}
                <div className="p-4 border border-dashed rounded-xl space-y-2">
                  <span className="text-xs font-bold flex items-center text-slate-600">
                    <Film className="w-4 h-4 mr-1 text-slate-500" />
                    Select Video (Max 1)
                  </span>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => setSelectedVideo(e.target.files?.[0] || null)}
                    className="w-full text-xs text-slate-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
                  />
                  {selectedVideo && (
                    <span className="text-[10px] text-brand-600 block">{selectedVideo.name} selected</span>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={uploadingMedia}
                className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold rounded-lg text-sm cursor-pointer"
              >
                {uploadingMedia ? 'Uploading Files...' : 'Upload Media Files'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
