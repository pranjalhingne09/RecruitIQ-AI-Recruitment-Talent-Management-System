import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../common/Navbar';
import { Footer } from '../common/Footer';
import { NotificationDrawer } from '../dashboard/NotificationDrawer';

export const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#080d1a] text-slate-100 selection:bg-indigo-500 selection:text-white">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <NotificationDrawer />
    </div>
  );
};
