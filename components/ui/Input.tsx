'use client';

import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, id, ...props }, ref) => {
    const inputId = id || (label ? `input-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);
    
    return (
      <div>
        {label && (
          <label htmlFor={inputId} className="form-label">
            {label}
            {props.required && <span className="form-required">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'form-input',
            error && 'form-input-error',
            className
          )}
          aria-invalid={!!error}
          {...props}
        />
        {error && <p className="form-error">{error}</p>}
        {helperText && !error && <p className="text-muted text-xs mt-1">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

