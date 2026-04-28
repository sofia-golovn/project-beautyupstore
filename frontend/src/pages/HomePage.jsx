import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useProductStore } from "../stores/useProductStore";
import FeaturedProducts from "../components/FeaturedProducts";
import CategoryItem from "../components/CategoryItem";

const categories = [
    { id: 1, href: "/category/face", name: "Face", imageUrl: "/face.png" },
    { id: 2, href: "/category/body", name: "Body", imageUrl: "/body.png" },
    { id: 3, href: "/category/hair", name: "Hair", imageUrl: "/hair.png" },
    { id: 4, href: "/category/sun", name: "Sun", imageUrl: "/sun.png" },
    { id: 5, href: "/category/accessories", name: "Accessories", imageUrl: "/accessories.png" },
    { id: 6, href: "/category/sets", name: "Sets", imageUrl: "/sets.png" },
];

const HomePage = () => {
    const { fetchFeaturedProducts, featuredProducts, loading } = useProductStore();

    useEffect(() => {
        fetchFeaturedProducts();
    }, [fetchFeaturedProducts]);

    return (
        <div className='relative min-h-screen bg-white'>
            {/* Hero Section */}
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

                    <p className="font-sans text-black/90 text-[10px] sm:text-xs tracking-[0.3em] leading-relaxed max-w-sm mb-12">
                        Explore our premium range of beauty products, meticulously
                        crafted to enhance your natural radiance. Each formula is designed to
                        empower your self-expression, perfect your daily ritual,
                        and inspire a new level of confidence every single day
                    </p>

                    <Link
                        to="/category"
                        className="font-sans bg-[#74090A] text-white text-[10px] font-medium 
                        tracking-[0.4em] px-12 py-4 rounded-sm hover:bg-black transition-all duration-500"
                    >
                        Shop now
                    </Link>
                </div>
            </div>

            <div className="py-10 max-w-6xl mx-auto px-4 sm:px-6"> 
                {!loading && featuredProducts && featuredProducts.length > 0 && (
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

                    <div className='max-w-5xl mx-auto'>
                        <div className='grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 lg:gap-12'>
                            {categories.map((category) => (
                                <CategoryItem category={category} key={category.name} />
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;