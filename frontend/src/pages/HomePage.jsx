import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useProductStore } from "../stores/useProductStore";
import { useCategoryStore } from "../stores/useCategoryStore"; 
import FeaturedProducts from "../components/FeaturedProducts";
import CategoryItem from "../components/CategoryItem";

const HomePage = () => {
    const { fetchFeaturedProducts, featuredProducts, loading: productsLoading } = useProductStore();
    const { fetchCategories, categories, loading: categoriesLoading } = useCategoryStore();

    useEffect(() => {
        fetchFeaturedProducts();
        fetchCategories();
    }, [fetchFeaturedProducts, fetchCategories]);

    const isLoading = productsLoading || categoriesLoading;

    return (
        <div className='relative min-h-screen bg-white'>
            <div className="relative min-h-[60vh] flex items-center justify-center pt-20">
                <div className="container mx-auto px-6 flex flex-col items-center text-center">
                    <div className="relative flex flex-col items-center mb-10">
                        <h1 className='font-["Playfair_Display"] text-4xl sm:text-5xl lg:text-6xl 
                        uppercase text-black tracking-[0.2em] leading-none'>
                            Light up your
                        </h1>
                        <span className='font-["Monsieur_La_Doulaise"] text-5xl sm:text-7xl 
                        lg:text-8xl text-[#74090A] lowercase 
                        mt-[-10px] sm:mt-[-20px] ml-20 sm:ml-40 z-10 select-none'>
                            natural beauty
                        </span>
                    </div>

                    <p className="font-sans text-black/90 text-[10px] sm:text-xs tracking-[0.3em] 
                    leading-relaxed max-w-sm mb-12">
                        Explore our premium range of beauty products, meticulously
                        crafted to enhance your natural radiance. Each formula is designed to
                        empower your self-expression, perfect your daily ritual,
                        and inspire a new level of confidence every single day
                    </p>

                    <Link
                        to="/catalog"
                        className="font-sans bg-[#74090A] text-white text-[10px] font-medium 
                        tracking-[0.4em] px-12 py-4 rounded-sm hover:bg-black transition-all duration-500"
                    >
                        Shop now
                    </Link>
                </div>
            </div>

            <div className="py-10 max-w-6xl mx-auto px-4 sm:px-6"> 
                {!productsLoading && featuredProducts && featuredProducts.length > 0 && (
                    <FeaturedProducts featuredProducts={featuredProducts} />
                )}
            </div>

            <section className='py-16 md:py-24 bg-white border-t border-neutral-50'>
                <div className='container mx-auto px-6'>
                    <div className='flex flex-col items-center mb-16'>
                        <div className='flex flex-col items-center gap-1'>
                            <h2 className='font-["Playfair_Display"] text-3xl sm:text-4xl 
                            md:text-5xl uppercase text-black tracking-[0.15em] text-center leading-tight'>
                                Choose your care for 
                            </h2>
                            <span className='font-["Monsieur_La_Doulaise"] text-5xl sm:text-6xl md:text-7xl 
                            text-[#74090A] lowercase mt-[-15px] md:mt-[-25px] ml-16 md:ml-32 select-none'>
                                today
                            </span>
                        </div>
                    </div>

                        <div className='max-w-4xl mx-auto'>
                        <div className='grid grid-cols-2 md:grid-cols-3 gap-6 sm:gap-10'>
                            {!isLoading && categories.length > 0 ? (
                                categories.map((category) => (
                                    <CategoryItem category={category} key={category._id} />
                                ))
                            ) : (
                                !isLoading && (
                                    <p className="col-span-full text-center text-gray-400 text-xs 
                                    tracking-widest uppercase">
                                        Collection coming soon
                                    </p>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;