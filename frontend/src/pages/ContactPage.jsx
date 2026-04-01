import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, Instagram, Twitter } from "lucide-react";
import { useState } from "react";

const ContactPage = () => {
    const [email, setEmail] = useState("");

    const handleSubscribe = (e) => {
        e.preventDefault();
        // TO-DO!!!Інтеграцію з Resend
        alert(`Дякуємо за підписку: ${email}`);
        setEmail("");
    };

    return (
        <div className='pt-24 md:pt-32 pb-20 min-h-screen bg-white font-sans text-gray-900 overflow-x-hidden'>
            <div className='container mx-auto px-4 sm:px-6 max-w-6xl'>
                
                <div className="relative flex flex-col items-center mb-16 md:mb-24 text-center">
                    <h1 className='font-["Playfair_Display"] text-3xl sm:text-5xl lg:text-6xl uppercase text-black tracking-[0.2em] leading-tight'>
                        Get in
                    </h1>
                    <span className='font-["Monsieur_La_Doulaise"] text-5xl sm:text-7xl lg:text-8xl text-[#74090A] lowercase mt-[-5px] sm:mt-[-20px] z-10 select-none'>
                        touch with us
                    </span>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24'>
                    
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className='space-y-8 md:space-y-10'
                    >
                        <div className='flex items-start gap-4'>
                            <MapPin size={22} className='text-[#74090A] shrink-0 mt-1' />
                            <p className='text-base md:text-lg tracking-wide'>412 West Broadway, New York, NY 10012, USA</p>
                        </div>

                        <div className='flex items-center gap-4'>
                            <Phone size={22} className='text-[#74090A] shrink-0' />
                            <p className='text-base md:text-lg tracking-wide'>+1 (212) 555-0198</p>
                        </div>

                        <div className='flex items-center gap-4'>
                            <Mail size={22} className='text-[#74090A] shrink-0' />
                            <p className='text-base md:text-lg tracking-wide break-words'>beautyup@gmail.com</p>
                        </div>

                        <div className='flex items-start gap-4'>
                            <Clock size={22} className='text-[#74090A] shrink-0 mt-1' />
                            <div className='text-base md:text-lg tracking-wide text-black font-normal'>
                                <p>Mon-Sat: 10:00 AM – 8:00 PM</p>
                                <p>Sun: 11:00 AM – 6:00 PM</p>
                            </div>
                        </div>

                        <div className='flex gap-6 pt-4'>
                            <a href="https://instagram.com" target="_blank" rel="noreferrer" className='hover:text-[#74090A] transition-colors'>
                                <Instagram size={26} />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noreferrer" className='hover:text-[#74090A] transition-colors'>
                                <Twitter size={26} />
                            </a>
                        </div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className='bg-gray-50 p-6 sm:p-10 rounded-sm border border-gray-100'
                    >
                        <h2 className='font-["Playfair_Display"] text-xl md:text-2xl uppercase tracking-widest mb-4 text-black'>
                            Stay updated
                        </h2>
                        <p className='text-gray-600 mb-8 text-sm leading-relaxed'>
                            Subscribe to our newsletter to receive updates on new BeautyUp collections and exclusive offers.
                        </p>
                        
                        <form onSubmit={handleSubscribe} className='flex flex-col gap-4'>
                            <input 
                                type="email" 
                                required
                                placeholder="Your email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className='w-full border-b border-gray-300 p-3 focus:outline-none 
                                focus:border-[#74090A] bg-transparent transition-colors italic text-base'
                            />
                            
                            <button 
                                type="submit"
                                className='w-full bg-[#5E0304] brightness-125 text-white font-medium transition-all duration-300 
                                uppercase text-xs py-4 tracking-[0.2em] rounded-md 
                                hover:brightness-100 border-none outline-none ring-0 antialiased shadow-none'
                            >
                                Subscribe
                            </button>
                        </form>
                    </motion.div>

                </div>
            </div>
        </div>
    );
};

export default ContactPage;