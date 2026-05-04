import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useProductStore } from "../stores/useProductStore";
import { useCartStore } from "../stores/useCartStore"; 
import { useWishlistStore } from "../stores/useWishlistStore";
import ProductCard from "../components/ProductCard";
import ProductModal from "../components/ProductModal"; 
import { Filter, ChevronLeft, ChevronRight, RotateCcw, ShoppingBag, Heart, X } from "lucide-react";

const CategoryPage = () => {
    const { category: urlCategory } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    
    const queryParams = new URLSearchParams(location.search);
    const searchTerm = queryParams.get("search") || "";

    const { 
        products, 
        categories, 
        fetchAllCategories, 
        fetchProductsByCategory, 
        fetchAllProducts, 
        fetchMaxPrice,
        maxPriceInDb,  
        loading,
        currentPage,
        totalPages,
        setPage 
    } = useProductStore();
    
    const { addToCart } = useCartStore(); 
    const { toggleWishlist: toggleInStore, wishlist } = useWishlistStore();

    const [selectedCategory, setSelectedCategory] = useState(urlCategory || "All");
    const [sortOrder, setSortOrder] = useState("default");
    const [priceRange, setPriceRange] = useState(200);
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const loadInitialData = async () => {
            await fetchMaxPrice();
            await fetchAllCategories();
        };
        loadInitialData();
    }, [fetchMaxPrice, fetchAllCategories]);

    useEffect(() => {
        if (maxPriceInDb) setPriceRange(maxPriceInDb);
    }, [maxPriceInDb]);

    useEffect(() => {
        setPage(1); 
    }, [selectedCategory, priceRange, sortOrder, searchTerm, setPage]);

    useEffect(() => {
        const filters = {
            minPrice: 0,
            maxPrice: priceRange,
            sort: sortOrder,
            search: searchTerm
        };

        const delayDebounceFn = setTimeout(() => {
            if (selectedCategory === "All") {
                fetchAllProducts(currentPage, filters);
            } else {
                fetchProductsByCategory(selectedCategory.toLowerCase(), currentPage, filters);
            }
        }, 400);

        return () => clearTimeout(delayDebounceFn);
    }, [selectedCategory, currentPage, priceRange, sortOrder, searchTerm, fetchAllProducts, fetchProductsByCategory]);
    
    useEffect(() => {
        const category = urlCategory || "All";
        setSelectedCategory(category);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [urlCategory]);

    const handleGlobalReset = () => {
        setSelectedCategory("All");
        setSortOrder("default");
        setPriceRange(maxPriceInDb || 200);
        setPage(1);
        const searchPart = searchTerm ? `?search=${searchTerm}` : "";
        navigate(`/category${searchPart}`);
    };

    const handleCategoryClick = (cat) => {
        setSelectedCategory(cat);
        setPage(1);
        const searchPart = searchTerm ? `?search=${searchTerm}` : "";
        if (cat === "All") {
            navigate(`/category${searchPart}`);
        } else {
            navigate(`/category/${cat}${searchPart}`);
        }
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleOpenModal = (product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const toggleWishlist = (e, product) => {
        e.stopPropagation(); 
        if (typeof toggleInStore === "function") {
            toggleInStore(product);
        }
    };

    const isTechnicalFiltersApplied = selectedCategory !== "All" || sortOrder !== "default" || (maxPriceInDb && priceRange !== maxPriceInDb);

    return (
        <div className='max-w-7xl mx-auto px-4 md:px-6 py-2 min-h-screen bg-white overflow-x-hidden pt-12 md:pt-16'>
            
            <header className="mb-2 border-b border-neutral-50 pb-2">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 h-3">
                        <span className="text-[8px] md:text-[9px] uppercase tracking-[0.2em] 
                        text-neutral-400 font-bold">
                            {searchTerm ? `Search Results for "${searchTerm}"` : "Category"}
                        </span>
                        {searchTerm && (
                            <button 
                                onClick={() => navigate("/category")} 
                                className="text-neutral-400 hover:text-[#74090A] transition-colors"
                                title="Clear search"
                            >
                                <X size={10} />
                            </button>
                        )}
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <h1 className="text-2xl md:text-5xl font-light tracking-tight text-neutral-900 
                            font-serif capitalize">
                                {selectedCategory}
                            </h1>
                            {isTechnicalFiltersApplied && (
                                <button 
                                    onClick={handleGlobalReset} 
                                    className="text-neutral-300 hover:text-[#74090A] transition-all 
                                    active:rotate-180 duration-500"
                                    title="Reset filters"
                                >
                                    <RotateCcw size={16} />
                                </button>
                            )}
                        </div>

                        <button 
                            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                            className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full border 
                            border-neutral-100 text-neutral-500 hover:text-[#74090A] transition-all"
                        >
                            <Filter size={14} />
                            <span className="text-[9px] md:text-[10px] uppercase font-bold tracking-widest">
                                {isFiltersOpen ? "Hide Filter" : "Filter"}
                            </span>
                        </button>
                    </div>
                </div>
            </header>

            <div className="flex flex-col md:flex-row gap-6 md:gap-12 relative">
                <aside className={`transition-all duration-500 ease-in-out ${isFiltersOpen ?
                    "w-full md:w-64 opacity-100 visible mb-6 md:mb-0" :
                    "w-0 opacity-0 invisible h-0 overflow-hidden"}`}>
                    <div className="space-y-8 md:space-y-12 pr-4 min-w-[250px]">
                        <div>
                            <h3 className='text-[10px] font-bold text-neutral-400 uppercase mb-4 
                            tracking-[0.15em] border-b border-neutral-50 pb-2'>Categories</h3>
                            <ul className='flex flex-wrap md:flex-col gap-2'>
                                {categories.map((cat) => (
                                    <li key={cat} className="flex-shrink-0">
                                        <button
                                            onClick={() => handleCategoryClick(cat)}
                                            className={`text-left py-1.5 px-3 rounded-xl transition-all ${selectedCategory.toLowerCase() === cat.toLowerCase() ? "text-[#74090A] font-bold bg-[#74090A]/5" : "text-neutral-500 hover:text-black"}`}
                                        >
                                            <span className="text-xs md:text-sm tracking-wide">{cat}</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-1 gap-6">
                            <div>
                                <h3 className='text-[10px] font-bold text-neutral-400 uppercase mb-3 tracking-[0.15em]'>
                                    Sort
                                </h3>
                                <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}
                                    className='w-full py-2 border-b border-neutral-200 bg-transparent text-xs 
                                    outline-none'>
                                    <option value="default">Newest First</option>
                                    <option value="az">A to Z</option>
                                    <option value="za">Z to A</option>
                                    <option value="low-high">Price: Low to High</option>
                                    <option value="high-low">Price: High to Low</option>
                                </select>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className='text-[10px] font-bold text-neutral-400 uppercase tracking-[0.15em]'>
                                        Max Price
                                    </h3>
                                    <span className="text-[#74090A] font-bold text-sm">${priceRange}</span>
                                </div>
                                <input 
                                    type='range' 
                                    min='0' 
                                    max={maxPriceInDb || 500} 
                                    step='1' 
                                    value={priceRange} 
                                    onChange={(e) => setPriceRange(Number(e.target.value))} 
                                    className='w-full h-[2px] bg-neutral-100 appearance-none accent-[#74090A]' 
                                />
                            </div>
                        </div>
                    </div>
                </aside>

                <main className='flex-1 w-full'>
                    {loading ? (
                        <div className="flex justify-center py-20 text-neutral-300 animate-pulse tracking-widest 
                        text-[10px] uppercase">Loading...</div>
                    ) : products.length > 0 ? (
                        <>
                                <div className={`grid gap-x-3 md:gap-x-8 gap-y-10 md:gap-y-16 transition-all duration-500 
                                grid-cols-2 ${isFiltersOpen ? "lg:grid-cols-3" : "lg:grid-cols-4"}`}>
                                {products.map((product) => (
                                    <div key={product._id} className="flex flex-col group h-full">
                                        <div onClick={() => handleOpenModal(product)}
                                            className="cursor-pointer flex-grow">
                                            <ProductCard product={product} />
                                        </div>
                                        
                                        <div className="flex items-center gap-1.5 mt-3 md:hidden px-0.5">
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                                                className="flex-1 bg-[#74090A] text-white py-2 rounded-lg flex 
                                                items-center justify-center gap-2 active:scale-95 transition-transform"
                                            >
                                                <ShoppingBag size={14} />
                                                <span className="text-[10px] font-bold uppercase tracking-tighter">
                                                    Add
                                                </span>
                                            </button>
                                            <button 
                                                onClick={(e) => toggleWishlist(e, product)}
                                                className={`p-2 rounded-lg border transition-colors ${wishlist.some(item => item._id === product._id) ? "bg-[#74090A]/10 border-[#74090A] text-[#74090A]" : "border-neutral-100 text-neutral-400"}`}
                                            >
                                                <Heart size={16} fill={wishlist.some(item => item._id === product._id) ? "currentColor" : "none"} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {totalPages > 1 && (
                                <div className='flex justify-center items-center mt-12 gap-2 md:gap-4 pb-10'>
                                    <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)} className='p-2 disabled:opacity-30'><ChevronLeft size={18} /></button>
                                    <div className='flex gap-1'>
                                        {[...Array(totalPages)].map((_, i) => (
                                            <button key={i + 1} onClick={() => handlePageChange(i + 1)}
                                                className={`w-8 h-8 md:w-9 md:h-9 rounded-md text-[10px] font-bold ${currentPage === i + 1 ? "bg-[#74090A] text-white" : "bg-neutral-50 text-neutral-400"}`}>
                                                {i + 1}
                                            </button>
                                        ))}
                                    </div>
                                    <button disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)} className='p-2 disabled:opacity-30'><ChevronRight size={18} /></button>
                                </div>
                            )}
                        </>
                    ) : (
                         <div className="text-center py-20 bg-neutral-50 rounded-[20px] border border-dashed 
                        border-neutral-200">
                            <p className="text-neutral-400 font-light italic text-sm">No products found.</p>
                        </div>
                    )}
                </main>
            </div>

            <ProductModal product={selectedProduct} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddToCart={addToCart} />
        </div>
    );
};

export default CategoryPage;