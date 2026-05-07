import { Link } from "react-router-dom";

const CategoryItem = ({ category }) => {
    return (
        <Link to={category.href} className="group block">
            <div className="flex flex-col items-center">
                <div className="relative aspect-square w-full overflow-hidden bg-gray-100 rounded-sm mb-4">
                    <img
                        src={category.imageUrl}
                        alt={category.name}
                        className="h-full w-full object-cover grayscale-[20%] transition-transform
                        duration-700 ease-out group-hover:scale-110 group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-black/5 opacity-0 transition-opacity duration-300 
                    group-hover:opacity-100"></div>
                </div>

                <h3 className="font-sans text-[11px] sm:text-[13px] uppercase tracking-[0.25em] 
                text-gray-900 transition-colors duration-300 group-hover:text-[#74090A]">
                    {category.name}
                </h3>
                <div className="mt-2 w-0 h-[1px] bg-[#74090A] transition-all duration-300 group-hover:w-8"></div>
            </div>
        </Link>
    );
};

export default CategoryItem;