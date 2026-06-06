import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axios.js';
import { formatCurrency, formatDate } from '../../utils/formatters.js';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';
import { Landmark, ShoppingBag, DollarSign, Loader2, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';

export default function VendorDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [salesTrend, setSalesTrend] = useState([]);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const fetchDashboardData = async () => {
    try {
      const resDash = await axiosInstance.get('/vendor/dashboard');
      setData(resDash.data.data);

      // Fetch sales trend for plotting
      const resSales = await axiosInstance.get('/vendor/analytics/sales');
      setSalesTrend(resSales.data.data || []);
    } catch (err) {
      toast.error('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    try {
      await axiosInstance.put(`/orders/vendor/orders/${orderId}/status`, { status: newStatus });
      toast.success('Order status updated');
      fetchDashboardData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update order status');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-40">
        <div className="w-12 h-12 border-4 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const { isVerified, stats, recentOrders, lowStockProducts } = data || {};

  return (
    <div className="space-y-8">
      {/* Verification Status Alert */}
      {!isVerified ? (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50 rounded-2xl flex items-center space-x-3 shadow-sm">
          <AlertTriangle className="w-6 h-6 shrink-0 text-amber-600" />
          <div>
            <span className="font-bold text-sm">Account Pending Verification</span>
            <p className="text-xs text-amber-700 dark:text-amber-500 mt-0.5">Your profile is currently under review by administrators. You can create products, but they will not be public until verified.</p>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-green-50 dark:bg-green-950/20 text-green-800 dark:text-green-400 border border-green-200 dark:border-green-900/50 rounded-2xl flex items-center space-x-3 shadow-sm">
          <CheckCircle className="w-6 h-6 shrink-0 text-green-600" />
          <div>
            <span className="font-bold text-sm">Account Verified</span>
            <p className="text-xs text-green-700 dark:text-green-500 mt-0.5">Your business is verified. Your products are active and purchasable on the store.</p>
          </div>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {/* Earnings */}
        <div className="p-6 bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Total Earnings</span>
            <span className="text-2xl font-black text-slate-800 dark:text-slate-100">{formatCurrency(stats?.earnings || 0)}</span>
          </div>
          <div className="p-3 bg-brand-50 dark:bg-brand-900/20 rounded-xl text-brand-600">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Orders */}
        <div className="p-6 bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Orders Processed</span>
            <span className="text-2xl font-black text-slate-800 dark:text-slate-100">{stats?.ordersCount || 0}</span>
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-xl text-blue-600">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        {/* Products */}
        <div className="p-6 bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Active Products</span>
            <span className="text-2xl font-black text-slate-800 dark:text-slate-100">{stats?.productsCount || 0}</span>
          </div>
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/20 rounded-xl text-indigo-600">
            <Landmark className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Analytics Chart */}
      {salesTrend.length > 0 && (
        <div className="p-6 bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <h3 className="heading-display text-base font-bold mb-6">Earnings Timeline Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip />
                <Line type="monotone" dataKey="sales" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Bottom Grid: Low Stock Warnings & Manage Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Manage Orders */}
        <div className="lg:col-span-2 p-6 bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4 shadow-sm">
          <h3 className="heading-display text-base font-bold">Recent Customer Orders</h3>
          
          {recentOrders?.length === 0 ? (
            <p className="text-slate-400 text-xs italic">No orders received yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b text-slate-400 font-bold uppercase tracking-wider">
                    <th className="pb-3">Order ID</th>
                    <th className="pb-3">Product Details</th>
                    <th className="pb-3">Revenue</th>
                    <th className="pb-3">Status Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {recentOrders?.map((ord) => (
                    <tr key={ord.id} className="text-slate-600 dark:text-slate-400">
                      <td className="py-4 font-mono font-medium truncate max-w-[80px]">{ord.id}</td>
                      <td className="py-4">
                        <span className="font-bold text-slate-800 dark:text-slate-200 block">{ord.product?.name}</span>
                        <span className="text-[10px] text-slate-400">{ord.quantity} units ordered</span>
                      </td>
                      <td className="py-4 font-bold text-slate-800 dark:text-slate-100">{formatCurrency(parseFloat(ord.price) * ord.quantity)}</td>
                      <td className="py-4">
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold ${
                            ord.status === 'DELIVERED' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                          }`}>
                            {ord.status}
                          </span>
                          
                          {/* Quick transitions */}
                          {['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED'].includes(ord.status) && (
                            <select
                              value={ord.status}
                              disabled={updatingOrderId === ord.id}
                              onChange={(e) => handleUpdateStatus(ord.id, e.target.value)}
                              className="px-1.5 py-1 bg-slate-50 dark:bg-dark-950 border border-slate-300 dark:border-slate-800 rounded font-semibold text-[10px]"
                            >
                              <option value={ord.status} disabled>Update</option>
                              {ord.status === 'PENDING' && <option value="CONFIRMED">CONFIRMED</option>}
                              {ord.status === 'CONFIRMED' && <option value="PROCESSING">PROCESSING</option>}
                              {ord.status === 'PROCESSING' && <option value="SHIPPED">SHIPPED</option>}
                              {ord.status === 'SHIPPED' && <option value="DELIVERED">DELIVERED</option>}
                            </select>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Low Stock Warnings */}
        <div className="p-6 bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4 shadow-sm">
          <h3 className="heading-display text-base font-bold flex items-center space-x-2 text-amber-600">
            <AlertTriangle className="w-5 h-5" />
            <span>Low Stock Alerts</span>
          </h3>

          {lowStockProducts?.length === 0 ? (
            <p className="text-slate-400 text-xs italic">All products are adequately stocked.</p>
          ) : (
            <div className="space-y-3">
              {lowStockProducts?.map((p) => (
                <div key={p.id} className="p-3 bg-amber-50/20 dark:bg-amber-950/10 border border-amber-300 dark:border-amber-900/30 rounded-xl flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 block truncate max-w-[150px]">{p.name}</span>
                    <span className="text-[10px] text-slate-400">SKU: {p.sku || 'N/A'}</span>
                  </div>
                  <span className="px-2 py-0.5 bg-red-100 text-red-800 font-bold rounded">
                    Stock: {p.stock}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
