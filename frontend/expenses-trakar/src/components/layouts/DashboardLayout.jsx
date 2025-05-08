import React, { useContext } from 'react';
import { UserContext } from '../../context/userContext';
import Navbar from './Navbar';
import SideMenu from './SideMenu';

const DashboardLayout = ({ children, activeMenu }) => {
  const { user } = useContext(UserContext);

  return (
    <div>
      <Navbar activeMenu={activeMenu} />
      
      {user ? (
        <div className="flex">
          <div className="hidden lg:block"> 
            <SideMenu activeMenu={activeMenu} />
          </div>
          <div className="grow mx-5">{children}</div>
        </div>
      ) : (
        <p className="text-center mt-10">Loading...</p> 
      )}
    </div>
  );
};

export default DashboardLayout;
