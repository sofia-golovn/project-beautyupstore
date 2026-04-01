import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProductStore } from "../stores/useProductStore";
import { useCartStore } from "../stores/useCartStore"; 
import ProductCard from "../components/ProductCard";
import ProductModal from "../components/ProductModal"; 
import { Filter } from "lucide-react";

const CategoryPage = () => {
    const { category: urlCategory } = useParams();
    const navigate = useNavigate();
    const { products, fetchAllProducts, loading } = useProductStore();
    const { addToCart } = useCartStore(); 
    
    const [selectedCategory, setSelectedCategory] = useState(urlCategory || "All");
    const [sortOrder, setSortOrder] = useState("default");
    const [priceRange, setPriceRange] = useState(200);
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const categories = ["All", "Face", "Body", "Hair", "Sun", "Accessories", "Sets"];

    useEffect(() => {
        fetchAllProducts();
    }, [fetchAllProducts]);

    useEffect(() => {
        if (urlCategory) {
            setSelectedCategory(urlCategory);
        } else {
            setSelectedCategory("All");
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [urlCategory]);

    const handleCategoryClick = (cat) => {
        setSelectedCategory(cat);
        if (cat === "All") {
            navigate("/category");
        } else {
            navigate(`/category/${cat}`);
        }
    };

    const handleOpenModal = (product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const filteredProducts = products
        .filter((p) => (selectedCategory === "All" ? true : p.category.toLowerCase() === selectedCategory.toLowerCase()))
        .filter((p) => p.price <= priceRange)
        .sort((a, b) => {
            if (sortOrder === "az") return a.name.localeCompare(b.name);
            if (sortOrder === "za") return b.name.localeCompare(a.name);
            if (sortOrder === "low-high") return a.price - b.price;
            if (sortOrder === "high-low") return b.price - a.price;
            return 0;
        });

    return (
        <div className='max-w-7xl mx-auto px-6 py-10 min-h-screen bg-white overflow-x-hidden'>
            
            <header className="mb-12 border-b border-neutral-50 pb-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <span className="text-[10px] uppercase tracking-[0.3em] text-[#74090A] font-bold mb-2 block">
                            Category
                        </span>
                        <div className="flex items-center gap-4">
                            <h1 className="text-4xl md:text-6xl font-light tracking-tight text-neutral-900 font-serif capitalize">
                                {selectedCategory}
                            </h1>
                            <button 
                                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                                className="flex items-center gap-2 px-4 py-2 rounded-full border border-neutral-100 hover:bg-neutral-50 transition-all text-neutral-500 hover:text-[#74090A]"
                            >
                                <Filter size={16} />
                                <span className="text-[10px] uppercase font-bold tracking-widest">
                                    {isFiltersOpen ? "Hide Filters" : "Show Filters"}
                                </span>
                            </button>
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-between md:justify-end w-full md:w-auto">
                        <p className="text-neutral-400 text-[10px] tracking-[0.2em] uppercase">
                            {filteredProducts.length} Products Found
                        </p>
                    </div>
                </div>
            </header>

            <div className="flex flex-col md:flex-row gap-12 relative">
                <aside className={`transition-all duration-500 ease-in-out ${
                    isFiltersOpen 
                    ? "w-full md:w-72 opacity-100 visible" 
                    : "w-0 opacity-0 invisible h-0 md:h-auto overflow-hidden"
                }`}>
                    <div className="space-y-12 pr-4 min-w-[250px] md:min-w-0">
                        <div>
                            <h3 className='text-[10px] font-bold text-neutral-400 uppercase 
                            mb-6 tracking-[0.15em] border-b border-neutral-50 pb-2'>
                                Categories
                            </h3>
                            <ul className='space-y-1'>
                                {categories.map((cat) => (
                                    <li key={cat}>
                                        <button
                                            onClick={() => handleCategoryClick(cat)}
                                            className={`w-full text-left py-2 px-3 rounded-xl transition-all duration-300 flex justify-between items-center ${
                                                selectedCategory.toLowerCase() === cat.toLowerCase() 
                                                ? "text-[#74090A] font-bold" 
                                                : "text-neutral-500 hover:text-black"
                                            }`}
                                        >
                                            <span className="text-sm tracking-wide">{cat}</span>
                                            {selectedCategory.toLowerCase() === cat.toLowerCase() && <div className="w-1.5 h-1.5 rounded-full bg-[#74090A]" />}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className='text-[10px] font-bold text-neutral-400 uppercase mb-4 
                            tracking-[0.15em]'>Sort By</h3>
                            <select 
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                                className='w-full p-3 border-b border-neutral-200 bg-transparent text-sm 
                                text-neutral-600 outline-none focus:border-[#74090A]'
                            >
                                <option value="default">Default</option>
                                <option value="az">A to Z</option>
                                <option value="za">Z to A</option>
                                <option value="low-high">Price: Low to High</option>
                                <option value="high-low">Price: High to Low</option>
                            </select>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className='text-[10px] font-bold text-neutral-400 uppercase tracking-[0.15em]'>Price Limit</h3>
                                <span className="text-[#74090A] font-bold text-sm">${priceRange}</span>
                            </div>
                            <input
                                type='range' min='0' max='200' step='1'
                                value={priceRange}
                                onChange={(e) => setPriceRange(Number(e.target.value))}
                                className='w-full h-[2px] bg-neutral-100 appearance-none cursor-pointer accent-[#74090A]'
                            />
                        </div>
                    </div>
                </aside>

                <main className='flex-1 w-full'>
                    {loading ? (
                        <div className="flex justify-center py-20 text-neutral-300 animate-pulse tracking-widest text-[10px] uppercase">
                            Discovering beauty...
                        </div>
                    ) : filteredProducts.length > 0 ? (
                        <div className={`grid gap-x-8 gap-y-16 transition-all duration-500 ${
                            isFiltersOpen 
                            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" 
                            : "grid-cols-1 sm:grid-cols-3 lg:grid-cols-4"
                        }`}>
                            {filteredProducts.map((product) => (
                                <div 
                                    key={product._id} 
                                    onClick={() => handleOpenModal(product)} 
                                    className="cursor-pointer"
                                >
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-32 bg-neutral-50 rounded-[40px] border 
                        border-dashed border-neutral-200">
                            <p className="text-neutral-400 font-light italic">No products found.</p>
                            <button onClick={() => {handleCategoryClick("All"); setPriceRange(200);}} className="mt-4 text-[#74090A] text-[10px] font-bold uppercase tracking-widest">
                                Clear Filters
                            </button>
                        </div>
                    )}
                </main>
            </div>

            <ProductModal 
                product={selectedProduct} 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onAddToCart={addToCart} 
            />
        </div>
    );
};

export default CategoryPage;