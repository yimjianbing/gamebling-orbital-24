import React, { Suspense, useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { NavBar } from './NavBar';
import { inGameContext} from '../../context/InGameContext';

const AppLayout = () => {

  const { inGame } = useContext(inGameContext);
  
  return ( <>
      {inGame 
      ? 
      <Suspense fallback={null}>
          <Outlet />
        </Suspense> 
      : <Suspense fallback={null}>
          <NavBar />
          <Outlet />
        </Suspense> }
        </>

  );
};

export default React.memo(AppLayout);