import React from 'react';
import AdminNav from '../components/layout/AdminNav';
import Nav from '../components/layout/Nav';

const DefaultLayout: React.FC<{
  admin?: boolean;
  children: React.ReactNode;
}> = ({ admin, children }) => {
  return (
    <div className="flex h-screen w-screen flex-col">
      {admin ? <AdminNav /> : <Nav />}
      <main className="flex h-full min-h-screen w-full flex-col pt-16">
        {children}
      </main>
    </div>
  );
};

export default DefaultLayout;
