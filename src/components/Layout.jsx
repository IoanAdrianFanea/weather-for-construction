import React from 'react';
import { BottomNavigation } from './BottomNavigation';

const Layout = ({ children, activeTab, setActiveTab }) => {
  return (
    <div className="w-full max-w-md mx-auto bg-white min-h-screen flex flex-col">
      <main className="flex-grow pb-20">
        {children}
      </main>
      <BottomNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default Layout;