import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface CompactSelectProps {
  label: string;
  name: string;
  options: { value: string; label: string }[];
  error?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
  className?: string;
}

export const CompactSelect: React.FC<CompactSelectProps> = ({
  label,
  name,
  options,
  error,
  placeholder,
  value,
  onChange,
  required,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen && (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown')) {
      e.preventDefault();
      setIsOpen(true);
      setHighlightedIndex(0);
      return;
    }

    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < options.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : prev);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (highlightedIndex >= 0) {
          handleSelect(options[highlightedIndex].value);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setHighlightedIndex(-1);
        buttonRef.current?.focus();
        break;
    }
  };

  const handleSelect = (optionValue: string) => {
    // Create synthetic event for compatibility with existing form handler
    const syntheticEvent = {
      target: { name, value: optionValue }
    } as React.ChangeEvent<HTMLSelectElement>;
    
    onChange(syntheticEvent);
    setIsOpen(false);
    setHighlightedIndex(-1);
    buttonRef.current?.focus();
  };

  return (
    <div className="flex flex-col gap-1 w-full relative" ref={dropdownRef}>
      <label className="text-xs sm:text-sm font-semibold text-[#0f1f3d] ml-0.5">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>

      {/* Custom Select Button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className={`
          w-full h-11 sm:h-12 px-4 rounded-xl border bg-white text-left
          text-sm sm:text-base
          transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#0657d0]/20 focus:border-[#0657d0]
          ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-200 hover:border-slate-300'}
          ${!value ? 'text-slate-400' : 'text-[#0f1f3d]'}
          ${className}
          flex items-center justify-between
        `}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby={`${name}-label`}
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : (placeholder || 'Select...')}
        </span>
        <ChevronDown 
          className={`w-5 h-5 text-slate-400 flex-shrink-0 ml-2 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 top-full bg-white border border-slate-200 rounded-xl shadow-xl shadow-slate-200/50 overflow-hidden animate-slideDown">
          <div className="max-h-60 overflow-y-auto py-1">
            {options.map((option, index) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={`
                  w-full px-4 py-2.5 text-left text-sm sm:text-base flex items-center justify-between
                  transition-colors duration-150
                  ${highlightedIndex === index ? 'bg-[#0657d0]/5' : ''}
                  ${value === option.value ? 'bg-[#0657d0]/10 text-[#0657d0] font-medium' : 'text-[#0f1f3d] hover:bg-slate-50'}
                `}
                role="option"
                aria-selected={value === option.value}
              >
                <span className="truncate">{option.label}</span>
                {value === option.value && (
                  <Check className="w-4 h-4 text-[#0657d0] flex-shrink-0 ml-2" strokeWidth={2.5} />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Hidden native select for form compatibility */}
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
      >
        <option value="" disabled hidden>{placeholder || 'Select...'}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {error && <span className="text-xs text-red-500 ml-0.5 mt-0.5">{error}</span>}
    </div>
  );
};
