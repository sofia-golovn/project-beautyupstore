import { useState } from "react";
import { ShoppingCart, User, LogOut, Lock, Search, Heart, Menu, X } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore"; 
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
    const location = useLocation();
    const { user, logout } = useUserStore();
    const { cart, resetCart } = useCartStore(); 
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const isAdmin = user?.role === "admin";

    const cartItemsCount = cart.length;

    const isActive = (path) => location.pathname === path;

    const getNavLinkClass = (path) => 
        `font-medium transition duration-300 flex items-center hover:text-[#A3090A] ${
            isActive(path) ? "text-[#A3090A]" : "text-gray-900"
        }`;

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <header className='fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md shadow-sm z-40 transition-all duration-300 border-b border-gray-100'> 
            <div className='container mx-auto px-6 py-4'>
                <div className='flex justify-between items-center'>
                    
                    <Link to='/' className='text-2xl font-sans font-semibold flex items-center'>
                        <span className='text-[#000000]'>Beauty</span>
                        <span className='text-[#A3090A]'>Up</span>
                    </Link>

                    <nav className='hidden md:flex items-center gap-16 font-sans absolute left-1/2 -translate-x-1/2'>
                        <Link to={"/"} className={getNavLinkClass("/")}>Home</Link>
                        <Link to={"/about"} className={getNavLinkClass("/about")}>About</Link>
                        <Link to={"/category"} className={getNavLinkClass("/category")}>Category</Link>
                        <Link to={"/contact"} className={getNavLinkClass("/contact")}>Contact</Link>
                    </nav>

                    <div className='flex items-center gap-4 md:gap-6 font-sans'>
                        
                        <button className="text-gray-900 hover:text-[#A3090A] transition">
                            <Search size={22} />
                        </button>
                        
                        {user && (
                            <>
                                <Link to={"/wishlist"} className="text-gray-900 hover:text-[#A3090A] relative">
                                    <Heart size={22} />
                                    <span className='absolute -top-2 -right-2 bg-[#74090A] text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full'>0</span>
                                </Link>
                                
                                <Link to={"/cart"} className="text-gray-900 hover:text-[#A3090A] relative">
                                    <ShoppingCart size={22} />
                                    <motion.span 
                                        key={cartItemsCount}
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className='absolute -top-2 -right-2 bg-[#74090A] text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-sm'
                                    >
                                        {cartItemsCount}
                                    </motion.span>
                                </Link>
                            </>
                        )}

                        {isAdmin && (
                            <Link className='hidden md:flex bg-[#74090A] text-white px-4 py-2 rounded-md hover:bg-[#5a0708] transition duration-300 items-center gap-1 font-medium' to={"/secret-dashboard"}>
                                <Lock size={18} /> Dashboard
                            </Link>
                        )}
                        
                        {user ? (
                            <button 
                            onClick={() => { 
                                logout(); 
                                resetCart(); 
                                if(isMenuOpen) toggleMenu(); 
                            }}
                        >
                            <LogOut size={22} />
                        </button>
                        ) : (
                            <Link to="/login" className="text-gray-900 hover:text-[#A3090A]">
                                <User size={22} />
                            </Link>
                        )}

                        <button className='md:hidden text-gray-900 p-1' onClick={toggleMenu}>
                            {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className='md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-xl font-sans overflow-hidden'
                    >
                        <div className='flex flex-col p-6 gap-6'>
                            <nav className="flex flex-col gap-4 text-lg">
                                <Link to="/" onClick={toggleMenu} className={getNavLinkClass("/")}>Home</Link>
                                <Link to="/about" onClick={toggleMenu} className={getNavLinkClass("/about")}>About</Link>
                                <Link to="/category" onClick={toggleMenu} className={getNavLinkClass("/category")}>Category</Link>
                                <Link to="/contact" onClick={toggleMenu} className={getNavLinkClass("/contact")}>Contact</Link>
                            </nav>

                            {isAdmin && (
                                <>
                                    <hr className="border-gray-100" />
                                    <Link to="/secret-dashboard" onClick={toggleMenu} className="flex items-center gap-2 text-[#74090A] font-bold tracking-wide">
                                        <Lock size={18} /> Admin Dashboard
                                    </Link>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Navbar;