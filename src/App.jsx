import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Shop from './pages/Shop';
import Sidebar from './components/Sidebar';
import Profile from './pages/Profile';
import Home from './pages/Home';
import Login from './Login';
import Purchase_history from './components/Purchase_history';
import Clubs from './pages/Clubs';
import Reyting from './pages/Reyting';
import Posts from './pages/Posts';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const App = () => {
  const location = useLocation();
  const hideSidebarRoutes = ['/login'];
  const shouldShowSidebar = !hideSidebarRoutes.includes(location.pathname);
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(() => {
    const savedState = localStorage.getItem("sidebarState");
    return savedState !== "hide";
  });

  useEffect(() => {
    const checkMobile = () => {
      const isNowMobile = window.innerWidth < 768;
      setIsMobile(isNowMobile);
      if (isNowMobile) {
        setIsOpen(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleSidebar = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    localStorage.setItem("sidebarState", newState ? "open" : "hide");
  };

  return (
    <div className='flex flex-col min-h-screen md:flex-row'>
      {shouldShowSidebar && <Sidebar isMobile={isMobile} isOpen={isOpen} toggleSidebar={toggleSidebar} />}

      <div className={`flex-grow pb-20 md:pb-0 ${shouldShowSidebar ? (isOpen ? 'md:ml-[250px]' : 'md:ml-[80px]') : ''} transition-all duration-300`}>
        {!isMobile && (
          <button
            className="fixed mt-[280px] mr-[100px] h-[200px] w-[40px] bg-indigo-500 z-50 text-white p-2  shadow-lg hover:bg-indigo-600 transition-all"
            onClick={toggleSidebar}
            style={{
              clipPath: 'polygon(0% 0%, 100% 50%, 0% 100%)',
            }}
          >
            {isOpen ? <ArrowLeft /> : <ArrowRight />}
          </button>
        )}
        <Routes>
          <Route path="/profile" element={<Profile />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/login" element={<Login />} />
          <Route path='/history' element={<Purchase_history />} />
          <Route path="/clubs" element={<Clubs />} />
          <Route path="/rating" element={<Reyting />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;