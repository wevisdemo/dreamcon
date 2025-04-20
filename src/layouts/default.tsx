import React from "react";
import Nav from "../components/Nav";
import AdminNav from "../components/AdminNav";

const DefaultLayout: React.FC<{
  page?: string;
  children: React.ReactNode;
}> = ({ page, children }) => {
  const getNav = (page: string | undefined) => {
    switch (page) {
      case "admin":
        return <AdminNav />;
      case "viewer":
        return <Nav />;
      default:
        return <Nav />;
    }
  };
  return (
    <div className="flex flex-col w-screen h-screen">
      {getNav(page)}
      <main className="pt-[64px] min-h-screen h-full flex flex-col w-full">
        {children}
        {/* <div className="w-full h-full bg-blue2"></div> */}
      </main>
    </div>
  );
};

export default DefaultLayout;
