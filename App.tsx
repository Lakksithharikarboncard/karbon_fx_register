// App.tsx
import React from 'react';
import { ProductShowcase } from './components/ProductShowcase';
import { SignupForm } from './components/SignupForm';

export default function App() {
  return (
    <div className="w-screen h-screen flex flex-col md:flex-row overflow-hidden">
      {/* Left Panel - Full width on mobile, half width on desktop */}
      <div className="w-full md:w-1/2 h-auto md:h-full">
        <ProductShowcase />
      </div>
      
      {/* Right Panel - Full width on mobile, half width on desktop */}
      <div className="w-full md:w-1/2 h-full bg-slate-50 overflow-y-auto">
        <SignupForm />
      </div>
    </div>
  );
}
