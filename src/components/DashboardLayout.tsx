
import React from 'react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-green-900/20 matrix-bg">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="scanlines">
          {children}
        </div>
      </div>
    </div>
  );
};
