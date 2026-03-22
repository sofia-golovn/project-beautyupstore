import React from "react";

const Footer = () => {
	return (
		<footer className='bg-[#5E0304] py-4 border-t border-black/10'>
			<div className='container mx-auto px-6 flex justify-center items-baseline gap-x-2'>
				
				<p className='font-["Playfair_Display"] text-[10px] sm:text-xs text-white/70 uppercase tracking-[0.2em] whitespace-nowrap'>
					Light up your
				</p>
				
				<p className='font-["Monsieur_La_Doulaise"] text-2xl sm:text-3xl text-white/60 lowercase whitespace-nowrap'>
					natural beauty
				</p>
				
			</div>
		</footer>
	);
};

export default Footer;