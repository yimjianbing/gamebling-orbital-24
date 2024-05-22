import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { NavBar } from './NavBar';

const AppLayout = () => {
  return (
    <Suspense fallback={null}>
        <NavBar />
        <Outlet />
    </Suspense>
  );
};

export default React.memo(AppLayout);