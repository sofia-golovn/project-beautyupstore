import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import ProductModal from "./ProductModal"; 
import { useCartStore } from "../stores/useCartStore"; 

const FeaturedProducts = ({ featuredProducts }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(4);
    
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { addToCart } = useCartStore();

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) setItemsPerPage(2);
            else if (window.innerWidth < 1024) setItemsPerPage(2);
            else if (window.innerWidth < 1280) setItemsPerPage(3);
            else setItemsPerPage(4);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const openModal = (e, product) => {
        e.preventDefault(); 
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const nextSlide = () => {
        setCurrentIndex((prev) => {
            if (prev >= featuredProducts.length - itemsPerPage) return prev;
            return prev + 1;
        });
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev <= 0 ? 0 : prev - 1));
    };

    const isStart = currentIndex === 0;
    const isEnd = currentIndex >= featuredProducts.length - itemsPerPage;

    return (
        <section className='py-12 md:py-20 bg-white relative overflow-visible'>
            <div className='container mx-auto px-4 md:px-6 relative z-10'>
                
                <div className='flex flex-col items-center justify-center mb-10 md:mb-16'>
                    <h2 className='font-["Playfair_Display"] text-3xl md:text-5xl uppercase tracking-[0.2em] 
                    text-black font-light'>
                        Our
                    </h2>
                    <p className='font-sans text-[10px] md:text-[12px] uppercase tracking-[0.6em] 
                    text-[#74090A] font-medium mt-2'>
                        Bestsellers
                    </p>
                </div>

                <div className='relative group/slider'>
                    <div className='overflow-hidden rounded-[20px] md:rounded-[40px]'>
                        <div
                            className='flex transition-transform duration-700 ease-[cubic-bezier(0.45,0,0.55,1)]'
                            style={{ transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)` }}
                        >
                            {featuredProducts?.map((product) => (
                                <div key={product._id} className='w-1/2 lg:w-1/3 xl:w-1/4 
                                flex-shrink-0 px-1.5 md:px-4'>
                                    <div 
                                        onClick={(e) => openModal(e, product)} 
                                        className='group block cursor-pointer'
                                    >
                                        <div className='relative aspect-[3/4] overflow-hidden rounded-[20px] 
                                        md:rounded-[40px] mb-4 md:mb-6'>
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className='w-full h-full object-cover transition-transform 
                                                duration-1000 group-hover:scale-110'
                                            />
                                            <div className='absolute inset-0 bg-black/5 
                                            group-hover:bg-black/20 transition-colors duration-500' />
                                        </div>

                                        <div className='text-center px-1 md:px-2'>
                                            <h3 className='font-["Playfair_Display"] text-sm md:text-lg 
                                            text-black capitalize tracking-wide mb-1 line-clamp-1'>
                                                {product.name}
                                            </h3>
                                            <p className='text-[#74090A] font-montserrat text-xs md:text-sm 
                                            tracking-widest opacity-80'>
                                                ${product.price.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={prevSlide}
                        disabled={isStart}
                        className={`absolute top-1/2 -translate-y-1/2 -left-2 md:-left-12 lg:-left-16 z-20 p-1 md:p-2 transition-all duration-500
                        ${isStart ? "opacity-0 pointer-events-none" : "opacity-100 hover:scale-125 text-[#74090A]"}`}
                    >
                        <ChevronLeft className='w-8 h-8 md:w-10 md:h-10 stroke-[1px]' />
                    </button>

                    <button
                        onClick={nextSlide}
                        disabled={isEnd}
                        className={`absolute top-1/2 -translate-y-1/2 -right-2 md:-right-12 lg:-right-16 z-20 p-1 md:p-2 transition-all duration-500
                        ${isEnd ? "opacity-0 pointer-events-none" : "opacity-100 hover:scale-125 text-[#74090A]"}`}
                    >
                        <ChevronRight className='w-8 h-8 md:w-10 md:h-10 stroke-[1px]' />
                    </button>
                </div>

                <div className='mt-10 md:mt-16 text-center'>
                    <Link to='/category' className='inline-block group'>
                        <span className='font-sans text-[10px] md:text-xs 
                        uppercase tracking-[0.3em] text-[#74090A]
                        group-hover:opacity-80 transition-opacity duration-300 font-medium'>
                            See all
                        </span>
                        <div className='h-[1px] w-full bg-[#74090A]/40 mt-1.5 
                        group-hover:bg-[#74090A] transition-all duration-500'></div>
                    </Link>
                </div>
            </div>

            <ProductModal 
                product={selectedProduct} 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onAddToCart={addToCart} 
            />
        </section>
    );
};

export default FeaturedProducts;