import React from 'react';

export default function Footer() {
  return (
    <footer className="glass border-t mt-auto py-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-slate-500 dark:text-slate-400">
            &copy; {new Date().getFullYear()} SparkIT Inc. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <span className="text-sm text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 cursor-pointer">
              Privacy Policy
            </span>
            <span className="text-sm text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 cursor-pointer">
              Terms of Service
            </span>
            <span className="text-sm text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 cursor-pointer">
              Contact Support
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
