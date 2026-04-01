import { motion } from "framer-motion";
import { ShieldCheck, Heart, MapPin } from "lucide-react";

const AboutPage = () => {
    return (
        <div className='pt-28 pb-20 min-h-screen bg-white font-sans text-gray-900 overflow-x-hidden'>
            <div className='container mx-auto px-6 max-w-5xl'>
                
                <div className="relative flex flex-col items-center mb-16 md:mb-24 text-center">
                    <h1 className='font-["Playfair_Display"] text-4xl sm:text-5xl lg:text-6xl uppercase text-black tracking-[0.2em] leading-none'>
                        Our
                    </h1>
                    <span className='font-["Monsieur_La_Doulaise"] text-5xl sm:text-7xl lg:text-8xl text-[#74090A] lowercase mt-[-10px] sm:mt-[-20px] z-10 select-none'>
                        story & values
                    </span>
                </div>

                <div className='flex flex-col md:flex-row items-center justify-between gap-12 md:gap-20 mb-32'>
                    
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className='w-full md:w-2/5'
                    >
                        <div className='aspect-[4/5] max-w-[320px] mx-auto bg-gray-50 rounded-sm overflow-hidden shadow-sm'>
                             <img 
                                src="/about.jpg" 
                                alt="BeautyUp Story" 
                                className="w-full h-full object-cover transition-all duration-700"
                             />
                        </div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className='w-full md:w-3/5 space-y-8'
                    >
                        <div className="space-y-6">
                            <h3 className='text-[10px] uppercase tracking-[0.4em] text-gray-400 font-bold'>
                                Our Philosophy
                            </h3>
                            
                            <p className='text-[#74090A] font-["Playfair_Display"] text-2xl md:text-4xl italic leading-tight'>
                                "The perfect routine didn't exist, so we created it."
                            </p>
                        </div>

                        <div className="space-y-6 text-gray-600 leading-relaxed text-base font-light">
                            <p>
                                BeautyUp was born out of a simple frustration: the endless search for skincare that actually works. We struggled to find products that balanced clinical effectiveness with clean, gentle ingredients.
                            </p>
                            <p>
                                What started as a personal quest has grown into a community-driven brand. We collaborated with leading experts to ensure that every formula we release is something we are proud to use ourselves.
                            </p>
                        </div>
                    </motion.div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-12 pt-16 border-t border-gray-100'>
                    
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-col items-center text-center space-y-4"
                    >
                        <Heart size={22} className="text-[#74090A] shrink-0" />
                        <div className="space-y-2">
                            <h4 className='font-sans text-xs uppercase tracking-[0.2em] font-bold text-black'>
                                Ethical Soul
                            </h4>
                            <p className='text-xs text-gray-500 font-light leading-relaxed max-w-[200px]'>
                                100% Cruelty-free and vegan-friendly formulas.
                            </p>
                        </div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="flex flex-col items-center text-center space-y-4"
                    >
                        <MapPin size={22} className="text-[#74090A] shrink-0" />
                        <div className="space-y-2">
                            <h4 className='font-sans text-xs uppercase tracking-[0.2em] font-bold text-black'>
                                NYC Heritage
                            </h4>
                            <p className='text-xs text-gray-500 font-light leading-relaxed max-w-[200px]'>
                                Inspired by Broadway. Designed for the modern rhythm.
                            </p>
                        </div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col items-center text-center space-y-4"
                    >
                        <ShieldCheck size={22} className="text-[#74090A] shrink-0" />
                        <div className="space-y-2">
                            <h4 className='font-sans text-xs uppercase tracking-[0.2em] font-bold text-black'>
                                Purity
                            </h4>
                            <p className='text-xs text-gray-500 font-light leading-relaxed max-w-[200px]'>
                                Transparent ingredients. No hidden chemicals.
                            </p>
                        </div>
                    </motion.div>
                    
                </div>
            </div>
        </div>
    );
};

export default AboutPage;