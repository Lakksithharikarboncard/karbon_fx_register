// components/ProductShowcase.tsx
import React from 'react';

export const ProductShowcase: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-col justify-center items-start p-6 sm:p-8 md:p-12 lg:p-16 relative overflow-hidden bg-gradient-to-br from-[#0f1f3d] via-[#1a2947] to-[#0f1f3d]">
      
      {/* Abstract Background Pattern - Karbon Blue Orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#0657d0]/15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#0657d0]/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-[#0657d0]/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Subtle Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,87,208,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,87,208,0.03)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none"></div>

      {/* Content Container */}
      <div className="z-10 flex flex-col items-start text-left space-y-4 sm:space-y-6 md:space-y-8 w-full max-w-xl">
        
        {/* Logo / Brand Header - Always visible */}
        <div className="mb-1 sm:mb-2">
          <img 
            src="https://cdn.prod.website-files.com/670ceff4b2fa1be44c3929a5/670fabd3a219e41ad2476906_Karbon%20Business%20white%20logo.avif"
            alt="Karbon Business"
            className="h-6 sm:h-7 md:h-8 lg:h-10 w-auto filter drop-shadow-lg"
          />
        </div>

        {/* Hero Headline - Hidden on mobile, shown on tablet+ */}
        <h1 className="hidden sm:block text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold leading-tight text-white">
          Accept Global Payments at{' '}
          <span className="bg-gradient-to-r from-[#0657d0] to-[#4a9eff] bg-clip-text text-transparent">
            Flat 1% Fee
          </span>
        </h1>

        {/* Key Benefits Grid - Hidden on mobile, shown on tablet+ */}
        <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6 w-full pt-2">
          
          {/* Benefit 1 */}
          <div className="flex flex-col space-y-1.5 sm:space-y-2 group">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-gradient-to-br from-[#0657d0] to-[#0f1f3d] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#0657d0]/20 group-hover:shadow-[#0657d0]/40 transition-shadow duration-300">
                <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-sm sm:text-base md:text-lg font-semibold text-white group-hover:text-[#4a9eff] transition-colors duration-300">
                0% Forex Markup
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-7 sm:pl-8">
              Best rates for inward remittance with zero markup on currency conversion
            </p>
          </div>

          {/* Benefit 2 */}
          <div className="flex flex-col space-y-1.5 sm:space-y-2 group">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-gradient-to-br from-[#0657d0] to-[#0f1f3d] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#0657d0]/20 group-hover:shadow-[#0657d0]/40 transition-shadow duration-300">
                <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-sm sm:text-base md:text-lg font-semibold text-white group-hover:text-[#4a9eff] transition-colors duration-300">
                1% Transaction Fee
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-7 sm:pl-8">
              Transparent pricing with no hidden charges—see exactly what you'll receive
            </p>
          </div>

          {/* Benefit 3 */}
          <div className="flex flex-col space-y-1.5 sm:space-y-2 group">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-gradient-to-br from-[#0657d0] to-[#0f1f3d] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#0657d0]/20 group-hover:shadow-[#0657d0]/40 transition-shadow duration-300">
                <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-sm sm:text-base md:text-lg font-semibold text-white group-hover:text-[#4a9eff] transition-colors duration-300">
                24–48 Hour Settlement
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-7 sm:pl-8">
              Get started in 10 minutes and receive payments within 1–2 business days
            </p>
          </div>

          {/* Benefit 4 */}
          <div className="flex flex-col space-y-1.5 sm:space-y-2 group">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-gradient-to-br from-[#0657d0] to-[#0f1f3d] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#0657d0]/20 group-hover:shadow-[#0657d0]/40 transition-shadow duration-300">
                <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-sm sm:text-base md:text-lg font-semibold text-white group-hover:text-[#4a9eff] transition-colors duration-300">
                24/7 Support
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-7 sm:pl-8">
              Real-time assistance for all your payment needs, anytime, anywhere
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
