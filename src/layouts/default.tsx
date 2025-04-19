import React from "react";
import Nav from "../components/Nav";

const DefaultLayout: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <div className="flex flex-col w-screen h-screen">
      <Nav />
      <main className="mt-[64px] min-h-screen h-full flex w-full">
        {children}
        {/* <div className="w-full h-full bg-blue2"></div> */}
      </main>
    </div>
  );
};

export default DefaultLayout;
