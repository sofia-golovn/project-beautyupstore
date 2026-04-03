import { Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore } from "../stores/useCartStore";

const CartItem = ({ item, onOpenModal }) => {
    const { removeFromCart, updateQuantity } = useCartStore();
    const lineTotal = (Number(item.price) || 0) * (item.quantity || 1);
    const openDetails = () => onOpenModal?.(item);

    return (
        <div
            className={`group relative flex flex-col h-full ${onOpenModal ? "cursor-pointer" : ""}`}
            role={onOpenModal ? "button" : undefined}
            tabIndex={onOpenModal ? 0 : undefined}
            onClick={onOpenModal ? openDetails : undefined}
            onKeyDown={
                onOpenModal
                    ? (e) => {
                          if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              openDetails();
                          }
                      }
                    : undefined
            }
        >
            <div className="aspect-[3/4] overflow-hidden bg-neutral-50 rounded-[18px] relative mb-4">
                <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        removeFromCart(item._id);
                    }}
                    className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-md rounded-full text-neutral-400 hover:text-[#74090A] transition-all shadow-sm opacity-0 group-hover:opacity-100"
                    aria-label="Remove from bag"
                >
                    <Trash2 size={14} />
                </button>
            </div>

            <div className="flex flex-col flex-grow mb-3">
                <span className="text-[8px] uppercase tracking-widest text-[#74090A] font-bold block mb-1">
                    {item.category}
                </span>
                <h3 className="text-sm md:text-base font-serif text-neutral-900 leading-snug line-clamp-2">
                    {item.name}
                </h3>
                <p className="text-sm font-medium text-neutral-600 mt-1">${item.price}</p>
                <p className="text-[9px] uppercase tracking-[0.15em] text-neutral-400 mt-2 font-medium">
                    Qty {item.quantity} · ${lineTotal.toFixed(2)} total
                </p>
            </div>

            <div
                className="flex items-center justify-center gap-1 rounded-lg border border-neutral-100 bg-neutral-50/80 py-2 px-1"
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
                role="presentation"
            >
                <button
                    type="button"
                    className="p-2 text-neutral-400 hover:text-[#74090A] transition-colors disabled:opacity-30 rounded-md"
                    onClick={(e) => {
                        e.stopPropagation();
                        updateQuantity(item._id, item.quantity - 1);
                    }}
                    disabled={item.quantity <= 1}
                >
                    <Minus size={14} strokeWidth={2.5} />
                </button>
                <span className="min-w-[2rem] text-center text-[10px] font-bold text-neutral-800 tracking-widest">
                    {item.quantity}
                </span>
                <button
                    type="button"
                    className="p-2 text-neutral-400 hover:text-[#74090A] transition-colors rounded-md"
                    onClick={(e) => {
                        e.stopPropagation();
                        updateQuantity(item._id, item.quantity + 1);
                    }}
                >
                    <Plus size={14} strokeWidth={2.5} />
                </button>
            </div>
        </div>
    );
};

export default CartItem;
