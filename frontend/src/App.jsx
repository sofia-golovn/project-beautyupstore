import { Route, Routes, Navigate, useLocation } from "react-router-dom"; 
import { useEffect } from "react";

import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Toaster } from "react-hot-toast";
import { useUserStore } from "./stores/useUserStore";
import LoadingSpinner from "./components/LoadingSpinner";

function App() {
  const { user, checkAuth, checkingAuth } = useUserStore();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  
  if (checkingAuth) return <LoadingSpinner />;

  const noFooterRoutes = ["/login", "/signup", "/secret-dashboard"];

  return (
    <div className='min-h-screen bg-white text-gray-900 flex flex-col'>
      
      <div className='relative z-50 flex-grow'>
        <Navbar />
        
        <div className="pt-20">
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/signup' element={!user ? <SignUpPage /> : <Navigate to='/' />} />
            <Route path='/login' element={!user ? <LoginPage /> : <Navigate to='/' />} />
            <Route
              path='/secret-dashboard'
              element={user?.role === "admin" ? <AdminPage /> : <Navigate to='/login' />}
            />
          </Routes>
        </div>
      </div>

      {!noFooterRoutes.includes(location.pathname) && <Footer />}
      
      <Toaster />
    </div>
  );
}

export default App;