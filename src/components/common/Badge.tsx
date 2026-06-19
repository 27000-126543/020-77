import { ReactNode } from 'react'
import { AlertTriangle, AlertCircle, Info, CheckCircle2 } from 'lucide-react'
import { SentimentType, UrgencyLevel, PlatformKey } from '@/types'
import { cn } from '@/lib/utils'

type BadgeType = 'sentiment' | 'platform' | 'urgency'

export interface BadgeProps {
  type?: BadgeType
  value?: string
  label?: string
  icon?: ReactNode
  showIcon?: boolean
  className?: string
}

const sentimentStyles: Record<SentimentType, string> = {
  positive: 'sentiment-positive',
  neutral: 'sentiment-neutral',
  negative: 'sentiment-negative',
}

const sentimentLabels: Record<SentimentType, string> = {
  positive: '正面',
  neutral: '中性',
  negative: '负面',
}

const urgencyStyles: Record<UrgencyLevel, string> = {
  special: 'urgency-critical',
  urgent: 'urgency-urgent',
  normal: 'urgency-normal',
  attention: 'urgency-attention',
}

const urgencyLabels: Record<UrgencyLevel, string> = {
  special: '特急',
  urgent: '紧急',
  normal: '一般',
  attention: '关注',
}

const urgencyIcons: Record<UrgencyLevel, ReactNode> = {
  special: <AlertTriangle className="w-3 h-3" strokeWidth={2.2} />,
  urgent: <AlertCircle className="w-3 h-3" strokeWidth={2.2} />,
  normal: <CheckCircle2 className="w-3 h-3" strokeWidth={2.2} />,
  attention: <Info className="w-3 h-3" strokeWidth={2.2} />,
}

const platformStyles: Record<PlatformKey, string> = {
  hotline: 'bg-info-bg text-info-light border border-info/30',
  message: 'bg-success-bg text-success-light border border-success/30',
  shortvideo: 'bg-warning-bg text-warning-light border border-warning/30',
  forum: 'bg-primary/20 text-primary-light border border-primary/30',
}

const platformLabels: Record<PlatformKey, string> = {
  hotline: '12345热线',
  message: '政务短信',
  shortvideo: '短视频',
  forum: '网络论坛',
}

export default function Badge({
  type = 'urgency',
  value,
  label,
  icon,
  showIcon = true,
  className,
}: BadgeProps) {
  if (!value && !label) return null

  let styles = ''
  let displayLabel = label || value || ''
  let displayIcon = icon

  if (type === 'sentiment') {
    const sentimentValue = value as SentimentType
    styles = sentimentStyles[sentimentValue] || sentimentStyles.neutral
    displayLabel = label || sentimentLabels[sentimentValue] || value || ''
  } else if (type === 'urgency') {
    const urgencyValue = value as UrgencyLevel
    styles = urgencyStyles[urgencyValue] || urgencyStyles.normal
    displayLabel = label || urgencyLabels[urgencyValue] || value || ''
    if (showIcon && !displayIcon && urgencyValue in urgencyIcons) {
      displayIcon = urgencyIcons[urgencyValue]
    }
  } else if (type === 'platform') {
    const platformValue = value as PlatformKey
    styles = platformStyles[platformValue] || platformStyles.forum
    displayLabel = label || platformLabels[platformValue] || value || ''
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-[11px] font-medium border',
        styles,
        className
      )}
    >
      {displayIcon}
      <span>{displayLabel}</span>
    </span>
  )
}
