import { Link } from "react-router-dom";

const CategoryItem = ({ category }) => {
    return (
        <div className='relative overflow-hidden h-[340px] w-full rounded-[40px] group bg-white border border-gray-100/50 shadow-sm transition-all duration-500 hover:shadow-xl'>
            <Link to={"/category" + category.href}>
                <div className='w-full h-full cursor-pointer relative'>
                    
                    <div className='absolute inset-0 bg-gradient-to-b from-transparent via-black/5 to-black/40 z-10 transition-opacity duration-700 group-hover:opacity-80' />
                    
                    <img
                        src={category.imageUrl}
                        alt={category.name}
                        className='w-full h-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-110'
                        loading='lazy'
                    />

                        <div className='absolute inset-0 flex flex-col items-center justify-end pb-10 z-20'>
    
						<h3 className='text-white/60 font-["Playfair_Display"] 
						text-2xl md:text-3xl capitalize tracking-widest 
						leading-none transition-all duration-500 group-hover:text-white/80 group-hover:scale-105'>
							{category.name}
						</h3>

						<div className='mt-3 w-1 h-1 bg-white/60 rounded-full opacity-0 
						group-hover:opacity-80 transition-all duration-500 
						scale-0 group-hover:scale-125' />
						
					</div>
                </div>
            </Link>
        </div>
    );
};

export default CategoryItem;