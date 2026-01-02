import { FormInputProps } from '@/types'
import { cn } from '@/src/lib/utils'
import { LucideIcon } from 'lucide-react'

interface ExtendedFormInputProps extends FormInputProps {
  icon?: LucideIcon
  className?: string
  colSpan?: 1 | 2
}

export function FormInput({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  required,
  error,
  icon: Icon,
  className,
  colSpan = 1,
}: ExtendedFormInputProps) {
  const inputId = `input-${label.replace(/\s+/g, '-').toLowerCase()}`
  
  return (
    <div className={cn(colSpan === 2 && "form-grid-full", className)}>
      <label htmlFor={inputId} className="form-label">
        {Icon && <Icon className="form-label-icon" />}
        {label}
        {required && <span className="form-required">*</span>}
      </label>
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className={cn('form-input', error && 'form-input-error')}
      />
      {error && (
        <p id={`${inputId}-error`} className="form-error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

