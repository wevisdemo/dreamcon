import React from "react";

const DefaultLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div>
      <nav className="fixed top-0 left-0 w-full h-[64px] bg-white flex items-center justify-between px-4 z-20">
        <a href="/">
          <img
            className="h-[40px]"
            src="/dreamcon-logo-blue.png"
            alt="dreamcon-logo"
          />
        </a>
      </nav>
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
