import { useMemo } from 'react'
import { Check } from 'lucide-react'
import { Cluster, UrgencyLevel } from '@/types'
import { URGENCY_LEVELS } from '@/data/dictionaries'
import { cn } from '@/lib/utils'

export interface ThemeListItem {
  id: string
  title: string
  newCount: number
  urgencyLevel: UrgencyLevel
  totalCount?: number
  trend?: 'rising' | 'stable' | 'declining'
}

export interface ThemeListProps {
  items: ThemeListItem[]
  selectedIds: string[]
  onSelect: (id: string) => void
  onToggleCheck?: (id: string) => void
  checkedIds?: string[]
  className?: string
}

const urgencySortOrder: Record<UrgencyLevel, number> = {
  special: 0,
  urgent: 1,
  normal: 2,
  attention: 3,
}

export default function ThemeList({
  items,
  selectedIds,
  onSelect,
  onToggleCheck,
  checkedIds = [],
  className,
}: ThemeListProps) {
  const sortedItems = useMemo(() => {
    return [...items].sort(
      (a, b) => urgencySortOrder[a.urgencyLevel] - urgencySortOrder[b.urgencyLevel]
    )
  }, [items])

  const getUrgencyColor = (level: UrgencyLevel) => {
    const item = URGENCY_LEVELS.find((u) => u.value === level)
    return item?.color || '#64748B'
  }

  return (
    <div
      className={cn(
        'w-[280px] flex-shrink-0 h-full flex flex-col',
        'bg-background-light border-r border-neutral-700',
        className
      )}
    >
      <div className="px-4 py-3 border-b border-neutral-700 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-neutral-100">研判主题</h3>
        <span className="text-xs text-neutral-400">
          共 {sortedItems.length} 项
        </span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {sortedItems.map((item) => {
          const isSelected = selectedIds.includes(item.id)
          const isChecked = checkedIds.includes(item.id)
          const dotColor = getUrgencyColor(item.urgencyLevel)

          return (
            <div
              key={item.id}
              role="button"
              onClick={() => onSelect(item.id)}
              className={cn(
                'group relative px-3 py-2.5 cursor-pointer transition-all duration-150',
                'border-b border-neutral-800/50',
                isSelected
                  ? 'bg-primary/15 border-l-2 border-l-primary'
                  : 'hover:bg-neutral-800/60 border-l-2 border-l-transparent'
              )}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0 shadow-md"
                  style={{ backgroundColor: dotColor }}
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        'text-sm font-medium truncate',
                        isSelected ? 'text-neutral-50' : 'text-neutral-200'
                      )}
                    >
                      {item.title}
                    </span>
                    {item.newCount > 0 && (
                      <span
                        className={cn(
                          'flex-shrink-0 inline-flex items-center justify-center',
                          'min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold',
                          'bg-danger/20 text-danger-light'
                        )}
                      >
                        +{item.newCount}
                      </span>
                    )}
                  </div>
                  {item.totalCount !== undefined && (
                    <div className="mt-0.5 text-[11px] text-neutral-500">
                      总量 {item.totalCount}
                    </div>
                  )}
                </div>

                {onToggleCheck && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onToggleCheck(item.id)
                    }}
                    className={cn(
                      'w-5 h-5 rounded-sm border flex items-center justify-center',
                      'transition-all duration-150 flex-shrink-0',
                      isChecked
                        ? 'bg-primary border-primary shadow-glow'
                        : 'bg-background border-neutral-500 group-hover:border-neutral-400'
                    )}
                  >
                    {isChecked && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
