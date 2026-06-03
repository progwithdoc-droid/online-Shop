import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore.js';
import { useCartStore } from '../../store/cartStore.js';
import { useTheme } from '../../hooks/useTheme.js';
import { ShoppingCart, Heart, User, Sun, Moon, LogOut, LayoutDashboard, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, logout, isAuthenticated, role } = useAuthStore();
  const { cartCount } = useCartStore();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (err) {
      toast.error('Failed to logout');
    }
  };

  return (
    <nav className="sticky top-0 z-50 glass shadow-sm transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="heading-display text-2xl font-bold bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent dark:from-brand-400 dark:to-brand-600">
                SparkIT
              </span>
            </Link>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors text-slate-600 dark:text-slate-300"
              title="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* General links */}
            <Link
              to="/"
              className="px-3 py-2 rounded-md text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400"
            >
              Shop
            </Link>

            {isAuthenticated ? (
              <>
                {/* Wishlist */}
                <Link
                  to="/wishlist"
                  className="p-2 rounded-full hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors text-slate-600 dark:text-slate-300 relative"
                  title="Wishlist"
                >
                  <Heart className="w-5 h-5" />
                </Link>

                {/* Cart */}
                <Link
                  to="/cart"
                  className="p-2 rounded-full hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors text-slate-600 dark:text-slate-300 relative"
                  title="Shopping Cart"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-brand-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center font-bold">
                      {cartCount}
                    </span>
                  )}
                </Link>

                {/* Role Specific Dashboards */}
                {role === 'ADMIN' && (
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-md text-sm font-medium bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50 hover:bg-red-100 dark:hover:bg-red-900/50"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Admin Panel</span>
                  </Link>
                )}

                {role === 'VENDOR' && (
                  <Link
                    to="/vendor/dashboard"
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-md text-sm font-medium bg-brand-50 dark:bg-brand-950/30 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-900/50 hover:bg-brand-100 dark:hover:bg-brand-900/50"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Vendor Hub</span>
                  </Link>
                )}

                {role === 'USER' && (
                  <Link
                    to="/vendor-register"
                    className="px-3 py-1.5 rounded-md text-sm font-medium bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50 hover:bg-amber-100 dark:hover:bg-amber-900/50"
                  >
                    Sell on SparkIT
                  </Link>
                )}

                {/* Profile */}
                <Link
                  to="/profile"
                  className="flex items-center space-x-1.5 p-1 rounded-full hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors text-slate-700 dark:text-slate-300"
                  title="Profile"
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar.startsWith('http') ? user.avatar : `http://localhost:5000${user.avatar}`}
                      alt={user.name}
                      className="w-7 h-7 rounded-full object-cover border border-slate-300 dark:border-slate-600"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-brand-100 dark:bg-brand-900 flex items-center justify-center text-brand-600 dark:text-brand-300 text-xs font-bold border border-brand-200 dark:border-brand-800">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                  <span className="hidden md:inline text-sm font-medium truncate max-w-[100px]">
                    {user?.name}
                  </span>
                </Link>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-950/30 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3 py-2 rounded-md text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="ml-2 px-4 py-2 rounded-lg text-sm font-medium bg-brand-600 text-white hover:bg-brand-700 transition-colors shadow-sm"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
