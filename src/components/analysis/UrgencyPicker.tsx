import { AlertTriangle, AlertCircle, Info, CheckCircle2 } from 'lucide-react'
import { UrgencyLevel } from '@/types'
import { URGENCY_LEVELS } from '@/data/dictionaries'
import { cn } from '@/lib/utils'
import SegmentedControl, { SegmentOption } from '@/components/common/SegmentedControl'

export interface UrgencyPickerProps {
  value?: UrgencyLevel
  onChange?: (value: UrgencyLevel) => void
  showDescription?: boolean
  className?: string
  label?: string
  required?: boolean
  disabled?: boolean
}

const urgencyOptions: SegmentOption[] = [
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
    value: 'normal',
    label: '一般',
    icon: CheckCircle2,
  },
  {
    value: 'attention',
    label: '关注',
    icon: Info,
  },
]

const urgencyDescriptions: Record<UrgencyLevel, string> = {
  special: '重大突发事件，需立即启动应急响应，2小时内上报处置进展',
  urgent: '快速升温议题，存在发酵扩散风险，8小时内必须响应',
  normal: '常规民生诉求，按标准流程办理，24小时内给予反馈',
  attention: '苗头性、倾向性问题，需持续监测关注，防止升级恶化',
}

export default function UrgencyPicker({
  value,
  onChange,
  showDescription = true,
  className,
  label = '紧急度',
  required = false,
  disabled = false,
}: UrgencyPickerProps) {
  const currentDescription = value ? urgencyDescriptions[value] : null
  const currentUrgency = value ? URGENCY_LEVELS.find((u) => u.value === value) : null

  return (
    <div className={cn('space-y-2.5', disabled && 'opacity-50 pointer-events-none', className)}>
      {label && (
        <div className="flex items-center gap-1">
          <label className="text-sm font-medium text-neutral-200">{label}</label>
          {required && <span className="text-danger text-xs">*</span>}
        </div>
      )}

      <SegmentedControl
        value={value}
        options={urgencyOptions}
        onChange={(v) => onChange?.(v as UrgencyLevel)}
      />

      {showDescription && currentDescription && (
        <div
          className={cn(
            'px-3 py-2 rounded-sm border text-xs leading-relaxed',
            'flex items-start gap-2'
          )}
          style={{
            borderColor: currentUrgency ? `${currentUrgency.color}40` : undefined,
            backgroundColor: currentUrgency ? `${currentUrgency.color}10` : undefined,
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1"
            style={{ backgroundColor: currentUrgency?.color }}
          />
          <span
            style={{
              color: currentUrgency?.color,
              opacity: 0.9,
            }}
          >
            {currentDescription}
          </span>
        </div>
      )}
    </div>
  )
}
