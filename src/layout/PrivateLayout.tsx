import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from '../hooks/useAuth';
import CenteredSpin from '../components/CenteredSpin';

const PrivateLayout: React.FC = () => {
  
  const { isAuth, checkAuth, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const aux = async () => {
      await checkAuth();
      setLoading(false);
    }
    if(localStorage.getItem('user')){
      aux();
    }else{
      logout()
      setLoading(false);
    }

    
  }, [isAuth, checkAuth, location.pathname, logout])


  if (loading === true) {
    return (
      <CenteredSpin/>
    );
  }

  if (!loading) {
    if(isAuth){
      return <Outlet/>;
    }else{
      return <Navigate to="/login" replace />;
    }
    
  }

  
};

export default PrivateLayout;
