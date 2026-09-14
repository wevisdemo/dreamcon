import React from 'react';
import Nav from '../components/layout/Nav';
import AdminNav from '../components/layout/AdminNav';

const DefaultLayout: React.FC<{
  admin?: boolean;
  children: React.ReactNode;
}> = ({ admin, children }) => {
  return (
    <div className="flex flex-col w-screen h-screen">
      {admin ? <AdminNav /> : <Nav />}
      <main className="pt-16 min-h-screen h-full flex flex-col w-full">
        {children}
      </main>
    </div>
  );
};

export default DefaultLayout;
