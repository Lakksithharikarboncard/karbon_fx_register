import React from 'react';

export const ProductShowcase: React.FC = () => {
  return (
    <div className="h-full w-full flex flex-col justify-center items-center p-4 md:p-12 relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      
      {/* Abstract Background Pattern */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

      {/* Content Container */}
      <div className="z-10 flex flex-col items-center md:items-start text-center md:text-left space-y-6 w-full max-w-lg">
        
        {/* Logo / Brand Header */}
        <div className="mb-4 w-full flex justify-center md:justify-start">
          <img 
            src="https://cdn.prod.website-files.com/670ceff4b2fa1be44c3929a5/670fabd3a219e41ad2476906_Karbon%20Business%20white%20logo.avif"
            alt="Karbon Business"
            className="h-8 md:h-10 w-auto"
          />
        </div>

        {/* Hero Headline */}
        <h2 className="text-2xl md:text-4xl lg:text-5xl font-extrabold leading-tight text-slate-100 hidden md:block">
          Receive International Payments in India—Fast & Affordable
        </h2>
        {/* Mobile-only condensed headline */}
        <h2 className="text-xl font-bold text-slate-100 md:hidden px-4 leading-tight">
          Receive International Payments in India—Fast & Affordable
        </h2>

      </div>
    </div>
  );
};
