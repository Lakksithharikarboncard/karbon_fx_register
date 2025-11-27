// components/CompactInput.tsx
import React, { useState } from 'react';

interface CompactInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const CompactInput: React.FC<CompactInputProps> = ({ label, error, className, type, onChange, value, ...props }) => {
  const isPhoneField = type === 'tel' || props.name === 'phone';

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isPhoneField || !onChange) {
      onChange?.(e);
      return;
    }

    let inputValue = e.target.value;
    
    // Always ensure +91 prefix
    if (!inputValue.startsWith('+91')) {
      inputValue = '+91';
    }

    // Extract only the digits after +91
    const digitsOnly = inputValue.slice(3).replace(/\D/g, '');
    
    // Limit to 10 digits
    const limitedDigits = digitsOnly.slice(0, 10);
    
    // Format: +91 XXXXX XXXXX (with space after 5 digits)
    let formattedValue = '+91';
    if (limitedDigits.length > 0) {
      formattedValue += ' ' + limitedDigits.slice(0, 5);
      if (limitedDigits.length > 5) {
        formattedValue += ' ' + limitedDigits.slice(5);
      }
    }

    // Create new event with formatted value
    const newEvent = {
      ...e,
      target: {
        ...e.target,
        value: formattedValue
      }
    };

    onChange(newEvent as React.ChangeEvent<HTMLInputElement>);
  };

  const handlePhoneFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (isPhoneField && (!value || value === '')) {
      // Set initial +91 prefix on focus if empty
      const syntheticEvent = {
        target: { name: props.name, value: '+91 ' }
      } as React.ChangeEvent<HTMLInputElement>;
      onChange?.(syntheticEvent);
    }
    props.onFocus?.(e);
  };

  const handlePhoneKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isPhoneField) return;

    const currentValue = (value as string) || '';
    const cursorPosition = (e.target as HTMLInputElement).selectionStart || 0;

    // Prevent deleting the +91 prefix
    if ((e.key === 'Backspace' || e.key === 'Delete') && cursorPosition <= 3) {
      e.preventDefault();
    }

    // Prevent typing in the prefix area
    if (cursorPosition < 3 && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.key !== 'Tab') {
      e.preventDefault();
    }
  };

  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-xs sm:text-sm font-semibold text-[#0f1f3d] ml-0.5">
        {label}
        {props.required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={isPhoneField ? handlePhoneChange : onChange}
        onFocus={isPhoneField ? handlePhoneFocus : props.onFocus}
        onKeyDown={isPhoneField ? handlePhoneKeyDown : props.onKeyDown}
        data-clarity-unmask="true"
        className={`
          w-full h-11 sm:h-12 px-4 rounded-xl border bg-white
          text-sm sm:text-base text-[#0f1f3d] placeholder:text-slate-400
          transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#0657d0]/20 focus:border-[#0657d0]
          ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-200 hover:border-slate-300'}
          ${className}
        `}
        {...props}
      />
      {error && <span className="text-xs text-red-500 ml-0.5 mt-0.5">{error}</span>}
    </div>
  );
};
