import { X, MapPin, Building2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type TagVariant = 'street' | 'department' | 'default'

export interface TagProps {
  label: string
  variant?: TagVariant
  removable?: boolean
  onRemove?: () => void
  showIcon?: boolean
  className?: string
}

const variantStyles: Record<TagVariant, string> = {
  street:
    'bg-success-bg/60 text-success-light border border-success/30 hover:border-success/50',
  department:
    'bg-info-bg/60 text-info-light border border-info/30 hover:border-info/50',
  default:
    'bg-neutral-700/60 text-neutral-300 border border-neutral-600 hover:border-neutral-500',
}

const variantIcons: Record<TagVariant, typeof X> = {
  street: MapPin,
  department: Building2,
  default: MapPin,
}

export default function Tag({
  label,
  variant = 'default',
  removable = true,
  onRemove,
  showIcon = true,
  className,
}: TagProps) {
  const Icon = variantIcons[variant]

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-1 rounded-sm text-xs font-medium transition-colors duration-150',
        variantStyles[variant],
        className
      )}
    >
      {showIcon && <Icon className="w-3 h-3 flex-shrink-0" strokeWidth={2} />}
      <span className="max-w-[120px] truncate">{label}</span>
      {removable && onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onRemove?.()
          }}
          className={cn(
            'ml-0.5 w-4 h-4 rounded-sm flex items-center justify-center',
            'hover:bg-white/10 transition-colors duration-150',
            'focus:outline-none focus:ring-1 focus:ring-white/20'
          )}
          aria-label={`移除${label}`}
        >
          <X className="w-3 h-3" strokeWidth={2.5} />
        </button>
      )}
    </span>
  )
}
