import React from 'react';
import { Sidebar } from './Sidebar';

export const Layout = ({ children }) => {
  return (
    <div className="flex" style={{backgroundColor: '#0d0f14'}}>
      <Sidebar />
      <main className="flex-1 ml-0 lg:ml-64 p-6 lg:p-8 pt-20 lg:pt-8 min-h-screen" style={{backgroundColor: '#0d0f14'}}>
        {children}
      </main>
    </div>
  );
};
