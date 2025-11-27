import React from 'react';
import { ProductShowcase } from './components/ProductShowcase';
import { SignupForm } from './components/SignupForm';

/**
 * App Component
 * Implements the strict split-screen layout requirement.
 * - Desktop: Left (45%) / Right (55%)
 * - Mobile: Top (20%) / Bottom (80%) - Adjusted to give form maximum space
 * - Uses flexbox to fill 100vh exactly without scrolling.
 */
const App: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row h-screen w-screen overflow-hidden bg-slate-900 text-slate-800 font-sans">
      
      {/* 
        Left Section: Product Advertisements 
        Mobile: Takes 20% height (Condensed)
        Desktop: Takes 45% width
      */}
      <section className="h-[20%] md:h-full w-full md:w-[45%] bg-slate-900 text-white relative overflow-hidden shrink-0 border-b md:border-b-0 md:border-r border-white/5">
        <ProductShowcase />
      </section>

      {/* 
        Right Section: Signup Form
        Mobile: Takes 80% height
        Desktop: Takes 55% width
      */}
      <section className="h-[80%] md:h-full w-full md:w-[55%] bg-[#f2f4f7] flex items-center justify-center p-4 md:p-8 lg:p-12 overflow-hidden shrink-0 relative">
        <div className="w-full max-w-md h-full flex flex-col justify-center">
          <SignupForm />
        </div>
      </section>

    </div>
  );
};

export default App;