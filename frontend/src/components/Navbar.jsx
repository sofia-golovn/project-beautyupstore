import { ShoppingCart, User, LogOut, Lock, Search, Heart } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";

const Navbar = () => {
    const location = useLocation();
    const { user, logout } = useUserStore();
    const isAdmin = user?.role === "admin";

    const isActive = (path) => location.pathname === path;

    const getNavLinkClass = (path) => 
        `font-medium transition duration-300 flex items-center hover:text-[#A3090A] ${
            isActive(path) ? "text-[#A3090A]" : "text-gray-900"
        }`;

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
                        <Link to={"/collection"} className={getNavLinkClass("/collection")}>Collection</Link>
                        <Link to={"/contact"} className={getNavLinkClass("/contact")}>Contact</Link>
                    </nav>

                    <div className='flex items-center gap-6 font-sans'>
                        <button className="text-gray-900 hover:text-[#A3090A] transition"><Search size={22} /></button>
                        
                        {user && (
                            <>
                                <Link to={"/wishlist"} className="text-gray-900 hover:text-[#A3090A] relative">
                                    <Heart size={22} />
                                    <span className='absolute -top-2 -right-2 bg-[#74090A] text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full'>0</span>
                                </Link>
                                <Link to={"/cart"} className="text-gray-900 hover:text-[#A3090A] relative">
                                    <ShoppingCart size={22} />
                                    <span className='absolute -top-2 -right-2 bg-[#74090A] text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full'>0</span>
                                </Link>
                            </>
                        )}

                        {isAdmin && (
                            <Link
                                className='bg-[#74090A] text-white px-4 py-2 rounded-md 
                                hover:bg-[#5a0708] transition duration-300 flex items-center gap-1 font-medium'
                                to={"/secret-dashboard"} >
                                <Lock size={18} />
                                Dashboard
                            </Link>
                        )}
                        
                        {user ? (
                            <button className="text-gray-900 hover:text-[#A3090A]" onClick={logout}>
                                <LogOut size={22} />
                            </button>
                        ) : (
                            <Link 
                               to="/login" 
                               className={getNavLinkClass("/login")}
                            >
                                <User size={22} />
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;