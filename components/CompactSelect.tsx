import React from 'react';
import { ChevronDown } from 'lucide-react';

interface CompactSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
  error?: string;
  placeholder?: string;
}

export const CompactSelect: React.FC<CompactSelectProps> = ({ label, options, error, placeholder, className, ...props }) => {
  return (
    <div className="flex flex-col gap-0.5 md:gap-1 w-full">
      <label className="text-xs md:text-sm font-medium text-slate-700 ml-0.5">
        {label}
      </label>
      <div className="relative">
        <select
          className={`
            w-full h-9 md:h-11 pl-3 pr-8 rounded-lg border bg-white appearance-none
            text-sm md:text-base text-slate-900 
            transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500
            ${error ? 'border-red-300 focus:border-red-500' : 'border-slate-200 hover:border-slate-300'}
            ${!props.value ? 'text-slate-500' : ''}
            ${className}
          `}
          {...props}
        >
          <option value="" disabled hidden>{placeholder || 'Select...'}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="text-slate-900">
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
      </div>
      {error && <span className="text-[10px] md:text-xs text-red-500 ml-0.5 leading-none">{error}</span>}
    </div>
  );
};