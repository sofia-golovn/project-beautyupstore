import { useState, useRef, useEffect } from "react";
import { ShoppingCart, User, LogOut, Lock, Search, Heart, Menu, X } from "lucide-react";
import { useLocation, Link, useNavigate } from "react-router-dom";

import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore"; 
import { useWishlistStore } from "../stores/useWishlistStore";

import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useUserStore();
    const { cart, resetCart } = useCartStore(); 
    const { wishlist } = useWishlistStore();
    
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    const searchInputRef = useRef(null);
    const isAdmin = user?.role === "admin";

    const cartItemsCount = cart.length;
    const wishlistItemsCount = wishlist.length;

    const isActive = (path) => location.pathname === path;

    const getNavLinkClass = (path) => 
        `font-medium transition duration-300 flex items-center hover:text-[#A3090A] ${
            isActive(path) ? "text-[#A3090A]" : "text-gray-900"
        }`;

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/category?search=${encodeURIComponent(searchTerm.trim())}`);
            setIsSearchOpen(false);
            setSearchTerm("");
            if (isMenuOpen) setIsMenuOpen(false);
        }
    };

    const badgeVariants = {
        initial: { scale: 0.8, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        transition: { type: "spring", stiffness: 500, damping: 25 }
    };

    const badgeClassName = "absolute -top-2 -right-2 bg-[#74090A] text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-sm border border-white/10";

    return (
        <header className='fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md 
        shadow-sm z-40 border-b border-gray-100'> 
            <div className='container mx-auto px-4 sm:px-6 py-4'>
                <div className='flex justify-between items-center gap-4'>
                    
                    <div className="flex-1 flex items-center gap-6">
                        <Link to='/' className='text-2xl font-sans font-semibold flex items-center shrink-0'>
                            <span className='text-black'>Beauty</span>
                            <span className='text-[#A3090A]'>Up</span>
                        </Link>
                    </div>

                    <nav className='hidden lg:flex items-center justify-center gap-10 font-sans'>
                        <Link to={"/"} className={getNavLinkClass("/")}>Home</Link>
                        <Link to={"/about"} className={getNavLinkClass("/about")}>About</Link>
                        <Link to={"/category"} className={getNavLinkClass("/category")}>Category</Link>
                        <Link to={"/contact"} className={getNavLinkClass("/contact")}>Contact</Link>
                    </nav>

                    <div className='flex-1 flex items-center justify-end gap-3 sm:gap-6'>
                        
                        <div className="flex items-center">
                            <AnimatePresence>
                                {isSearchOpen && (
                                    <motion.form 
                                        initial={{ width: 0, opacity: 0 }}
                                        animate={{ width: window.innerWidth < 640 ? 110 : 180, opacity: 1 }}
                                        exit={{ width: 0, opacity: 0 }}
                                        onSubmit={handleSearchSubmit}
                                        className="overflow-hidden"
                                    >
                                        <input
                                            ref={searchInputRef}
                                            autoFocus
                                            type="text"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            placeholder="Search..."
                                            className="bg-transparent border-b border-gray-300 
                                            focus:border-[#A3090A] outline-none px-2 py-1 text-sm w-full"
                                        />
                                    </motion.form>
                                )}
                            </AnimatePresence>
                            <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="text-gray-900 
                            hover:text-[#A3090A] transition p-1">
                                {isSearchOpen ? <X size={20} /> : <Search size={22} />}
                            </button>
                        </div>
                        
                        {user && (
                            <div className="hidden md:flex items-center gap-6">
                                <Link to={"/wishlist"} className="text-gray-900 
                                hover:text-[#A3090A] relative transition-colors">
                                    <Heart size={22} />
                                    <motion.span key={`wishlist-${wishlistItemsCount}`} {...badgeVariants} className={badgeClassName}>
                                        {wishlistItemsCount}
                                    </motion.span>
                                </Link>
                                <Link to={"/cart"} className="text-gray-900 
                                hover:text-[#A3090A] relative transition-colors">
                                    <ShoppingCart size={22} />
                                    <motion.span key={`cart-${cartItemsCount}`} {...badgeVariants}
                                        className={badgeClassName}>
                                        {cartItemsCount}
                                    </motion.span>
                                </Link>
                            </div>
                        )}

                        {isAdmin && (
                            <Link className='hidden xl:flex bg-[#74090A] 
                            text-white px-4 py-2 rounded-md hover:bg-[#5a0708] transition duration-300
                            items-center gap-1 font-medium shadow-sm whitespace-nowrap' to={"/secret-dashboard"}>
                                <Lock size={18} /> Dashboard
                            </Link>
                        )}
                        
                        {user ? (
                            <button 
                                className="text-gray-900 hover:text-[#A3090A] transition"
                                onClick={() => { logout(); resetCart(); if(isMenuOpen) toggleMenu(); }}
                            >
                                <LogOut size={22} />
                            </button>
                        ) : (
                            <Link to="/login" className="text-gray-900 hover:text-[#A3090A] transition">
                                <User size={22} />
                            </Link>
                        )}

                        <button className='lg:hidden text-gray-900 p-1 hover:text-[#A3090A] transition'
                            onClick={toggleMenu}>
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
                        className='lg:hidden absolute top-full left-0 w-full bg-white border-b 
                        border-gray-100 shadow-xl overflow-hidden font-sans'
                    >
                        <div className='flex flex-col p-6 gap-6'>
                            
                            {user && (
                                <div className="flex items-center justify-center gap-12">
                                    <Link to={"/wishlist"} onClick={toggleMenu} className="text-gray-900 
                                    relative transition-colors flex flex-col items-center gap-1">
                                        <div className="relative">
                                            <Heart size={24} />
                                            <motion.span key={`mob-wish-${wishlistItemsCount}`} {...badgeVariants}
                                                className={badgeClassName}>
                                                {wishlistItemsCount}
                                            </motion.span>
                                        </div>
                                        <span className="text-[10px] uppercase font-bold text-gray-400">
                                            Wishlist
                                        </span>
                                    </Link>

                                    <Link to={"/cart"} onClick={toggleMenu} className="text-gray-900 
                                    relative transition-colors flex flex-col items-center gap-1">
                                        <div className="relative">
                                            <ShoppingCart size={24} />
                                            <motion.span key={`mob-cart-${cartItemsCount}`} {...badgeVariants}
                                                className={badgeClassName}>
                                                {cartItemsCount}
                                            </motion.span>
                                        </div>
                                        <span className="text-[10px] uppercase font-bold text-gray-400">Cart</span>
                                    </Link>
                                </div>
                            )}

                            <hr className="border-black-500" />

                            <nav className="flex flex-col gap-4 text-lg">
                                <Link to="/" onClick={toggleMenu} className={getNavLinkClass("/")}>Home</Link>
                                <Link to="/about" onClick={toggleMenu} className={getNavLinkClass("/about")}>About</Link>
                                <Link to="/category" onClick={toggleMenu} className={getNavLinkClass("/category")}>Category</Link>
                                <Link to="/contact" onClick={toggleMenu} className={getNavLinkClass("/contact")}>Contact</Link>
                            </nav>

                            {isAdmin && (
                                <>
                                    <hr className="border-black-500" />
                                    <Link to="/secret-dashboard" onClick={toggleMenu}
                                        className="flex items-center gap-2 text-[#74090A] font-bold tracking-wide">
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