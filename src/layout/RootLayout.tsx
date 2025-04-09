import React from "react";
import { Outlet } from "react-router-dom";


const RootLayout: React.FC = () => {

  return (
    <>
        <div>Esto es navbar</div>
        <Outlet/>
        <div>Esto es el footer</div>
    </>

  );
};

export default RootLayout;