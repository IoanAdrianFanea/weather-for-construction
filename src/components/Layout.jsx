import React from 'react';
import { BottomNavigation } from './Navigation';

const Layout = ({ children, activeTab, setActiveTab }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <BottomNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 lg:ml-72 pb-20 lg:pb-0 bg-gray-50 dark:bg-gray-900 overflow-hidden">
        {children}
      </main>
    </div>
  );
};

export default Layout;