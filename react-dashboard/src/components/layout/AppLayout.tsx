import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useStore } from '../../store/useStore';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { ui } = useStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className={`flex-1 transition-all duration-300 ${
          ui.sidebarOpen ? 'ml-0' : 'ml-0'
        }`}>
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};