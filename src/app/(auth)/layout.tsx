import React from 'react';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen">
      <div className="default-margin h-full relative col-center">
        <div className="">Hello</div>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
