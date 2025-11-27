import React from 'react';

interface CompactInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const CompactInput: React.FC<CompactInputProps> = ({ label, error, className, ...props }) => {
  return (
    <div className="flex flex-col gap-0.5 md:gap-1 w-full">
      <label className="text-xs md:text-sm font-medium text-slate-700 ml-0.5">
        {label}
        {props.required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        className={`
          w-full h-9 md:h-11 px-3 rounded-lg border bg-white
          text-sm md:text-base text-slate-900 placeholder:text-slate-400
          transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500
          ${error ? 'border-red-300 focus:border-red-500' : 'border-slate-200 hover:border-slate-300'}
          ${className}
        `}
        {...props}
      />
      {error && <span className="text-[10px] md:text-xs text-red-500 ml-0.5 leading-none">{error}</span>}
    </div>
  );
};