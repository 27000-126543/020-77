import { InputHTMLAttributes, forwardRef } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  indeterminate?: boolean
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, checked, onChange, disabled, id, ...props }, ref) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).slice(2, 9)}`

    return (
      <label
        htmlFor={checkboxId}
        className={cn(
          'inline-flex items-center gap-2.5 cursor-pointer select-none',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
      >
        <span className="relative">
          <input
            ref={ref}
            id={checkboxId}
            type="checkbox"
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            className="sr-only"
            {...props}
          />
          <span
            className={cn(
              'w-4 h-4 rounded-sm border-2 flex items-center justify-center transition-all duration-150',
              checked
                ? 'bg-primary border-primary shadow-glow'
                : 'bg-background border-neutral-500 hover:border-neutral-400',
              disabled && checked
                ? 'bg-primary/70 border-primary/70 shadow-none'
                : '',
              !disabled && !checked && 'hover:bg-neutral-800'
            )}
          >
            {checked && (
              <Check
                className="w-3 h-3 text-white"
                strokeWidth={3}
              />
            )}
          </span>
          <span
            className={cn(
              'absolute inset-0 rounded-sm transition-all duration-200',
              'peer-focus-visible:ring-2 peer-focus-visible:ring-primary-light peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background',
              'pointer-events-none'
            )}
          />
        </span>
        {label && (
          <span className={cn(
            'text-sm transition-colors',
            checked ? 'text-neutral-100' : 'text-neutral-300'
          )}>
            {label}
          </span>
        )}
      </label>
    )
  }
)

Checkbox.displayName = 'Checkbox'

export default Checkbox
