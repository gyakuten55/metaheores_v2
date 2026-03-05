import React from 'react';

interface ServiceIntroBannerProps {
  image: string;
  title: string;
  subtitle?: string;
  websiteUrl?: string;
}

export const ServiceIntroBanner: React.FC<ServiceIntroBannerProps> = ({ 
  image, 
  title, 
  subtitle,
  websiteUrl 
}) => {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Base Image (100% width) */}
      <div className="w-full h-[240px] md:h-[320px]">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Overlay Text Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-6 md:px-24">
          <div className="max-w-[60%] md:max-w-xl relative z-10">
            <h2 className="text-[13px] md:text-2xl font-black text-gray-800 leading-relaxed md:leading-[1.6] tracking-widest md:drop-shadow-md">
              {title}
            </h2>
            {subtitle && (
              <p className="hidden md:block mt-4 text-gray-600 text-sm font-medium tracking-wider">
                {subtitle}
              </p>
            )}
            {websiteUrl && (
              <div className="mt-4 md:mt-8 flex flex-wrap gap-3">
                <a 
                  href={websiteUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-1.5 md:px-8 md:py-2.5 bg-gray-900 text-white text-[9px] md:text-sm font-bold rounded-full hover:bg-gray-700 transition-all shadow-lg"
                >
                  公式サイト
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-2.5 h-3 md:w-4 md:h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};