import { Link } from "react-router-dom";

const CategoryItem = ({ category }) => {
    return (
        <Link to={category.href} className='group block'>
            <div className='relative w-full aspect-square overflow-hidden rounded-2xl md:rounded-[30px] mb-4'>
                <img
                    src={category.imageUrl}
                    alt={category.name}
                    className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110'
                />
                <div className='absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-all duration-500' />
                
                <div className='absolute inset-0 flex items-center justify-center'>
                    <h3 className='text-white font-["Playfair_Display"] text-xl sm:text-2xl uppercase tracking-widest'>
                        {category.name}
                    </h3>
                </div>
            </div>
        </Link>
    );
};

export default CategoryItem;