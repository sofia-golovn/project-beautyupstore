const LoadingSpinner = () => {
    return (
        <div className='flex flex-col items-center justify-center min-h-screen bg-white'>
            <div className='relative flex items-center justify-center'>
                {/* Зовнішнє нерухоме кільце — дуже світле бордове */}
                <div className='w-16 h-16 border-[#74090A]/10 border-2 rounded-full' />
                
                {/* Активне кільце, що обертається */}
                <div className='w-16 h-16 border-[#74090A] border-t-2 animate-spin rounded-full absolute' />
                
                {/* Маленька нерухома крапка в центрі для акценту */}
                <div className='w-1 h-1 bg-[#74090A] rounded-full absolute' />
            </div>
            
            {/* Елегантний текст під спінером */}
            <div className="mt-6">
                <span className="text-[10px] uppercase tracking-[0.4em] text-neutral-400 font-medium animate-pulse">
                    Loading Beauty
                </span>
            </div>
            <div className='sr-only'>Loading</div>
        </div>
    );
};

export default LoadingSpinner;