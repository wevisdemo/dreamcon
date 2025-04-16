import React from "react";
import Nav from "../components/Nav";

const DefaultLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div>
      <Nav />
      <main
        className="mt-[64px] overflow-hidden"
        style={{ height: "calc(100vh - 64px)" }}
      >
        {children}
      </main>
    </div>
  );
};

export default DefaultLayout;
