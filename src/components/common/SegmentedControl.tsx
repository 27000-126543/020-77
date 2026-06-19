import { AlertTriangle, AlertCircle, Info, CheckCircle2 } from 'lucide-react'
import { UrgencyLevel } from '@/types'
import { cn } from '@/lib/utils'

export interface SegmentOption {
  value: string
  label: string
  icon?: typeof AlertTriangle
}

export interface SegmentedControlProps {
  value?: UrgencyLevel | string
  options?: SegmentOption[]
  onChange?: (value: UrgencyLevel | string) => void
  className?: string
  size?: 'sm' | 'md'
}

const defaultOptions: SegmentOption[] = [
  {
    value: 'special',
    label: '特急',
    icon: AlertTriangle,
  },
  {
    value: 'urgent',
    label: '紧急',
    icon: AlertCircle,
  },
  {
    value: 'attention',
    label: '关注',
    icon: Info,
  },
  {
    value: 'normal',
    label: '一般',
    icon: CheckCircle2,
  },
]

const urgencyActiveStyles: Record<string, string> = {
  special: 'bg-danger text-white border-danger shadow-glow-danger',
  urgent: 'bg-warning text-neutral-950 border-warning',
  attention: 'bg-info text-white border-info',
  normal: 'bg-primary text-white border-primary shadow-glow',
}

export default function SegmentedControl({
  value,
  options = defaultOptions,
  onChange,
  className,
  size = 'md',
}: SegmentedControlProps) {
  const paddingClass = size === 'sm' ? 'px-2.5 py-1.5' : 'px-4 py-2'
  const textClass = size === 'sm' ? 'text-[11px]' : 'text-xs'
  const iconClass = size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'

  return (
    <div
      className={cn(
        'inline-flex items-center p-0.5 rounded-sm bg-background border border-neutral-600',
        className
      )}
      role="radiogroup"
    >
      {options.map((option, index) => {
        const isActive = value === option.value
        const Icon = option.icon
        const activeStyles = urgencyActiveStyles[option.value] || urgencyActiveStyles.normal

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onChange?.(option.value)}
            className={cn(
              'relative inline-flex items-center justify-center gap-1.5',
              'font-medium rounded-sm border transition-all duration-150',
              'focus:outline-none focus:z-10',
              paddingClass,
              textClass,
              index > 0 && '-ml-px',
              isActive
                ? cn('z-10 border', activeStyles)
                : cn(
                    'border-transparent text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50',
                    'focus:ring-1 focus:ring-neutral-500/50'
                  )
            )}
          >
            {Icon && <Icon className={iconClass} strokeWidth={2} />}
            <span>{option.label}</span>
          </button>
        )
      })}
    </div>
  )
}
