import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, Instagram, Twitter } from "lucide-react";

const ContactPage = () => {
    return (
        <div className='pt-24 md:pt-32 pb-20 min-h-screen bg-white font-sans text-gray-900 overflow-x-hidden'>
            <div className='container mx-auto px-4 sm:px-6 max-w-6xl'>
                
                <div className="relative flex flex-col items-center mb-16 md:mb-24 text-center">
                    <h1 className='font-["Playfair_Display"] text-3xl sm:text-5xl lg:text-6xl 
                    uppercase text-black tracking-[0.2em] leading-tight'>
                        Get in
                    </h1>
                    <span className='font-["Monsieur_La_Doulaise"] text-5xl sm:text-7xl lg:text-8xl 
                    text-[#74090A] lowercase mt-[-5px] sm:mt-[-20px] z-10 select-none'>
                        touch with us
                    </span>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-center'>
                    
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className='space-y-8 md:space-y-10'
                    >
                        <div className='flex items-start gap-4'>
                            <MapPin size={22} className='text-[#74090A] shrink-0 mt-1' />
                            <p className='text-base md:text-lg tracking-wide'>
                                412 West Broadway, New York, NY 10012, USA</p>
                        </div>

                        <div className='flex items-center gap-4'>
                            <Phone size={22} className='text-[#74090A] shrink-0' />
                            <p className='text-base md:text-lg tracking-wide'>
                                +1 (212) 555-0198</p>
                        </div>

                        <div className='flex items-center gap-4'>
                            <Mail size={22} className='text-[#74090A] shrink-0' />
                            <p className='text-base md:text-lg tracking-wide break-words'>
                                beautyup@gmail.com</p>
                        </div>

                        <div className='flex items-start gap-4'>
                            <Clock size={22} className='text-[#74090A] shrink-0 mt-1' />
                            <div className='text-base md:text-lg tracking-wide text-black font-normal'>
                                <p>Mon-Sat: 10:00 AM – 8:00 PM</p>
                                <p>Sun: 11:00 AM – 6:00 PM</p>
                            </div>
                        </div>

                        <div className='flex gap-6 pt-4'>
                            <a href="https://instagram.com" target="_blank" rel="noreferrer"
                                className='hover:text-[#74090A] transition-colors'>
                                <Instagram size={26} />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noreferrer"
                                className='hover:text-[#74090A] transition-colors'>
                                <Twitter size={26} />
                            </a>
                        </div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className='w-full overflow-hidden 
                        rounded-sm shadow-sm border border-gray-100'
                    >
                        <img 
                            src="/office.jpg" 
                            alt="BeautyUp Office Interior" 
                            className='w-full h-full object-cover object-center 
                            transform hover:scale-105 transition-transform duration-700 ease-in-out'
                        />
                        <div className="absolute inset-0 bg-black/5"></div>
                    </motion.div>

                </div>
            </div>
        </div>
    );
};

export default ContactPage;