import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import axios from "../lib/axios";
import toast from "react-hot-toast";
import LoadingSpinner from "./LoadingSpinner";
import ProductModal from "./ProductModal"; 
import { useCartStore } from "../stores/useCartStore";

const PeopleAlsoBought = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { addToCart } = useCartStore();

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const res = await axios.get("/products/recommendations");
                setRecommendations(res.data);
            } catch (error) {
                toast.error(error.response?.data?.message || "An error occurred");
            } finally {
                setIsLoading(false);
            }
        };
        fetchRecommendations();
    }, []);

    const openModal = (product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    if (isLoading) return <LoadingSpinner />;

    return (
        <div className='mt-12'>
            <span className='text-[9px] uppercase tracking-[0.3em] text-[#74090A] font-bold mb-2 block px-2 md:px-0'>
                You may also like
            </span>
            <h3 className='text-lg md:text-xl font-light text-neutral-900 font-serif tracking-tight px-2 md:px-0'>
                People also bought
            </h3>

            <div className='mt-8 grid grid-cols-2 gap-3 md:gap-8 lg:grid-cols-3 px-2 md:px-0'>
                {recommendations.map((product) => (
                    <div 
                        key={product._id} 
                        onClick={() => openModal(product)} 
                        className='cursor-pointer'
                    >
                        <ProductCard product={product} />
                    </div>
                ))}
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

export default PeopleAlsoBought;