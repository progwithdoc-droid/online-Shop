import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout.jsx';
import ProtectedRoute from './components/layout/ProtectedRoute.jsx';
import RoleRoute from './components/layout/RoleRoute.jsx';

// Auth Pages
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';
import VendorRegister from './pages/auth/VendorRegister.jsx';

// Customer Pages
import Home from './pages/customer/Home.jsx';
import ProductDetails from './pages/customer/ProductDetails.jsx';
import Cart from './pages/customer/Cart.jsx';
import Wishlist from './pages/customer/Wishlist.jsx';
import Checkout from './pages/customer/Checkout.jsx';
import Orders from './pages/customer/Orders.jsx';
import Profile from './pages/customer/Profile.jsx';

// Vendor Pages
import VendorDashboard from './pages/vendor/VendorDashboard.jsx';
import VendorProducts from './pages/vendor/VendorProducts.jsx';
import VendorComplaints from './pages/vendor/VendorComplaints.jsx';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminVendors from './pages/admin/AdminVendors.jsx';
import AdminUsers from './pages/admin/AdminUsers.jsx';
import AdminComplaints from './pages/admin/AdminComplaints.jsx';

// Common Pages
import Unauthorized from './pages/common/Unauthorized.jsx';
import NotFound from './pages/common/NotFound.jsx';

// State hydration
import { useCartStore } from './store/cartStore.js';
import { useAuthStore } from './store/authStore.js';

function App() {
  const { isAuthenticated, role } = useAuthStore();
  const fetchCart = useCartStore((state) => state.fetchCart);

  useEffect(() => {
    // Re-fetch cart on boot if authenticated
    if (isAuthenticated && role === 'USER') {
      fetchCart();
    }
  }, [isAuthenticated, role]);

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
          <Route path="/register" element={isAuthenticated ? <Navigate to="/" replace /> : <Register />} />
          <Route path="/vendor-register" element={role === 'VENDOR' ? <Navigate to="/vendor/dashboard" replace /> : <VendorRegister />} />
          
          {/* Protected Customer Routes */}
          <Route path="/cart" element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          } />
          
          <Route path="/wishlist" element={
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          } />
          
          <Route path="/checkout" element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } />
          
          <Route path="/orders" element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />

          {/* Protected Vendor Routes */}
          <Route path="/vendor" element={
            <RoleRoute allowedRoles={['VENDOR']}>
              <Navigate to="/vendor/dashboard" replace />
            </RoleRoute>
          } />
          <Route path="/vendor/dashboard" element={
            <RoleRoute allowedRoles={['VENDOR']}>
              <VendorDashboard />
            </RoleRoute>
          } />
          <Route path="/vendor/products" element={
            <RoleRoute allowedRoles={['VENDOR']}>
              <VendorProducts />
            </RoleRoute>
          } />
          <Route path="/vendor/complaints" element={
            <RoleRoute allowedRoles={['VENDOR']}>
              <VendorComplaints />
            </RoleRoute>
          } />

          {/* Protected Admin Routes */}
          <Route path="/admin" element={
            <RoleRoute allowedRoles={['ADMIN']}>
              <Navigate to="/admin/dashboard" replace />
            </RoleRoute>
          } />
          <Route path="/admin/dashboard" element={
            <RoleRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </RoleRoute>
          } />
          <Route path="/admin/vendors" element={
            <RoleRoute allowedRoles={['ADMIN']}>
              <AdminVendors />
            </RoleRoute>
          } />
          <Route path="/admin/users" element={
            <RoleRoute allowedRoles={['ADMIN']}>
              <AdminUsers />
            </RoleRoute>
          } />
          <Route path="/admin/complaints" element={
            <RoleRoute allowedRoles={['ADMIN']}>
              <AdminComplaints />
            </RoleRoute>
          } />

          {/* Common Fallbacks */}
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
