import React from "react";
import { Mail, Phone } from "lucide-react";

const Footer = () => {
    return (
        <footer className='bg-[#5E0304] py-6 border-t border-black/10 mt-auto'>
            <div className='container mx-auto px-6 max-w-5xl flex flex-col 
            md:flex-row justify-between items-center gap-y-4'>
                
                <div className='flex items-baseline gap-x-2'>
                    <p className='font-["Playfair_Display"] text-[10px] sm:text-xs 
                    text-white/60 uppercase tracking-[0.2em] whitespace-nowrap'>
                        Light up your
                    </p>
                    <p className='font-["Monsieur_La_Doulaise"] text-2xl sm:text-2xl 
                    text-white/50 lowercase whitespace-nowrap'>
                        natural beauty
                    </p>
                </div>

                <div className='flex flex-col items-center md:items-end gap-y-1'>
                    <a 
                        href="mailto:webstorebeautyup@gmail.com" 
                        className="flex items-center gap-x-2 text-white/70 
                        hover:text-white transition-colors duration-300 text-[10px] sm:text-xs tracking-wide"
                    >
                        <span className="font-sans">webstorebeautyup@gmail.com</span>
                        <Mail size={12} className="text-white/30" />
                    </a>

                    <a 
                        href="tel:+12125550198" 
                        className="flex items-center gap-x-2 text-white/70 
                        hover:text-white transition-colors duration-300 text-[10px] sm:text-xs tracking-wide"
                    >
                        <span className="font-sans">+1 (212) 555-0198</span>
                        <Phone size={12} className="text-white/30" />
                    </a>
                </div>
                
            </div>
        </footer>
    );
};

export default Footer;