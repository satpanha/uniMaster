import { FormSelectProps } from '@/types'
import { cn } from '@/src/lib/utils'
import { LucideIcon, ChevronDown } from 'lucide-react'

interface ExtendedFormSelectProps extends FormSelectProps {
  icon?: LucideIcon
  className?: string
  colSpan?: 1 | 2
  placeholder?: string
}

export function FormSelect({
  label,
  value,
  onChange,
  options,
  required,
  error,
  disabled,
  icon: Icon,
  className,
  colSpan = 1,
  placeholder,
}: ExtendedFormSelectProps) {
  const selectId = `select-${label.replace(/\s+/g, '-').toLowerCase()}`
  
  return (
    <div className={cn(colSpan === 2 && "form-grid-full", className)}>
      <label htmlFor={selectId} className="form-label">
        {Icon && <Icon className="form-label-icon" />}
        {label}
        {required && <span className="form-required">*</span>}
      </label>
      <div className="relative">
        <select
          id={selectId}
          value={value || ''}
          onChange={(e) => onChange(e.target.value === '' ? null : e.target.value)}
          disabled={disabled}
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${selectId}-error` : undefined}
          className={cn(
            'form-select',
            !value && 'form-select-placeholder',
            error && 'form-input-error'
          )}
        >
          <option value="">
            {placeholder || `Select ${label.toLowerCase()}`}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="form-select-icon" />
      </div>
      {error && (
        <p id={`${selectId}-error`} className="form-error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

