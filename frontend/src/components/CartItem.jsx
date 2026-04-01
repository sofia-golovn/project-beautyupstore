import { Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore } from "../stores/useCartStore";

const CartItem = ({ item }) => {
    const { removeFromCart, updateQuantity } = useCartStore();

    return (
        <div className='bg-white py-8'>
            <div className='flex flex-col md:flex-row md:gap-10'>
                
                <div className='shrink-0 mb-6 md:mb-0'>
                    <img 
                        className='h-40 w-32 md:h-44 md:w-36 rounded-2xl object-cover bg-neutral-50 shadow-sm' 
                        src={item.image} 
                        alt={item.name}
                    />
                </div>

                <div className='flex-1 flex flex-col justify-between'>
                    <div>
                        <div className="flex justify-between items-start mb-2">
                            <h3 className='text-xl font-serif tracking-tight text-neutral-900 leading-snug'>
                                {item.name}
                            </h3>
                            
                            <p className='hidden md:block text-lg font-light text-[#74090A]'>
                                ${item.price}
                            </p>
                        </div>
                        
                        <p className='text-sm text-neutral-500 font-light leading-relaxed max-w-2xl'>
                            {item.description}
                        </p>
                    </div>

                    <div className='flex items-center justify-between mt-8'>
                        <div className='flex items-center border border-neutral-100 rounded-full px-2 py-1 bg-neutral-50/50'>
                            <button
                                className='p-2 text-neutral-400 hover:text-[#74090A] transition-colors disabled:opacity-30'
                                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                            >
                                <Minus size={14} strokeWidth={2.5} />
                            </button>
                            
                            <span className='px-4 text-xs font-bold text-neutral-800 min-w-[30px] text-center'>
                                {item.quantity}
                            </span>

                            <button
                                className='p-2 text-neutral-400 hover:text-[#74090A] transition-colors'
                                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            >
                                <Plus size={14} strokeWidth={2.5} />
                            </button>
                        </div>

                        <div className="flex items-center gap-8">
                            <p className='md:hidden text-lg font-light text-neutral-900'>
                                ${item.price}
                            </p>
                            
                            <button
                                className='group flex items-center gap-2 text-neutral-300 hover:text-red-800 transition-all'
                                onClick={() => removeFromCart(item._id)}
                            >
                                <span className="text-[10px] uppercase tracking-widest font-bold opacity-0 group-hover:opacity-100 transition-opacity">Remove</span>
                                <Trash2 size={18} strokeWidth={1.2} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartItem;