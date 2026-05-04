import { Route, Routes, Navigate, useLocation } from "react-router-dom"; 
import { useEffect } from "react";

import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import AboutPage from "./pages/AboutPage";
import CatalogPage from "./pages/CatalogPage";
import ContactPage from "./pages/ContactPage";
import CartPage from "./pages/CartPage";
import WishlistPage from "./pages/WishlistPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import PurchaseSuccessPage from "./pages/PurchaseSuccessPage";
import PurchaseCancelPage from "./pages/PurchaseCancelPage";
import ProfilePage from "./pages/ProfilePage";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import { Toaster } from "react-hot-toast";
import { useUserStore } from "./stores/useUserStore";
import { useCartStore } from "./stores/useCartStore";
import LoadingSpinner from "./components/LoadingSpinner";

function App() {
  const { user, checkAuth, checkingAuth } = useUserStore();
  const { getCartItems } = useCartStore(); 
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (user) {
      getCartItems();
    }
  }, [user, getCartItems]);
  
  if (checkingAuth) return <LoadingSpinner />;

  const noFooterRoutes = ["/login", "/signup", "/secret-dashboard"];

  return (
    <div className='min-h-screen bg-white text-gray-900 flex flex-col'>
      
      <div className='relative z-50 flex-grow'>
        <Navbar />
        
        <div className="pt-20">
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/about' element={<AboutPage />} />
            <Route path='/contact' element={<ContactPage />} />
            <Route 
                path='/profile' 
                element={user ? <ProfilePage key={user._id} /> : <Navigate to='/login' />} 
            />
            
            <Route path='/signup' element={!user ? <SignUpPage /> : <Navigate to='/' />} />
            <Route path='/login' element={!user ? <LoginPage /> : <Navigate to='/' />} />
            <Route path='/forgot-password' element={<ForgotPasswordPage />} />

            <Route
              path='/secret-dashboard'
              element={user?.role === "admin" ? <AdminPage /> : <Navigate to='/login' />}
            />
            
            <Route path='/catalog/:category' element={<CatalogPage />} />
            <Route path='/wishlist' element={user ? <WishlistPage /> : <Navigate to='/login'  />} />
            <Route path='/cart' element={user ? <CartPage /> : <Navigate to='/login' />} />
            
            <Route path='*' element={<Navigate to='/' />} />
            <Route
						path='/purchase-success'
						element={user ? <PurchaseSuccessPage /> : <Navigate to='/login' />}
					/>
					<Route path='/purchase-cancel' element={user ? <PurchaseCancelPage /> : <Navigate to='/login' />} />
          </Routes>
        </div>
      </div>

      {!noFooterRoutes.includes(location.pathname) && <Footer />}
      
      <Toaster />
    </div>
  );
}

export default App;