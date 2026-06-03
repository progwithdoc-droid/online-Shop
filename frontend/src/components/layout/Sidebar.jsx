import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  AlertTriangle, 
  Users, 
  CheckSquare, 
  ArrowLeft 
} from 'lucide-react';

export default function Sidebar({ role }) {
  const isVendor = role === 'VENDOR';
  const isAdmin = role === 'ADMIN';

  const vendorLinks = [
    { to: '/vendor/dashboard', label: 'Analytics Dashboard', icon: LayoutDashboard },
    { to: '/vendor/products', label: 'My Products', icon: ShoppingBag },
    { to: '/vendor/complaints', label: 'Complaints Hub', icon: AlertTriangle },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Admin Dashboard', icon: LayoutDashboard },
    { to: '/admin/vendors', label: 'Vendor Verifications', icon: CheckSquare },
    { to: '/admin/users', label: 'User Operations', icon: Users },
    { to: '/admin/complaints', label: 'Platform Complaints', icon: AlertTriangle },
  ];

  const links = isVendor ? vendorLinks : isAdmin ? adminLinks : [];

  return (
    <aside className="w-64 glass min-h-[calc(100vh-4rem)] border-r shadow-sm transition-all duration-200 hidden md:block">
      <div className="p-6 flex flex-col h-full justify-between">
        <div className="space-y-6">
          <div className="px-3">
            <h2 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              {role} Panel
            </h2>
          </div>
          <nav className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-brand-600 text-white shadow-md'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-dark-100 dark:hover:bg-dark-800'
                    }`
                  }
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span>{link.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
          <NavLink
            to="/"
            className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-dark-100 dark:hover:bg-dark-800 transition-all"
          >
            <ArrowLeft className="w-5 h-5 shrink-0" />
            <span>Return to Store</span>
          </NavLink>
        </div>
      </div>
    </aside>
  );
}
