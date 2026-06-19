import { useState, useRef, useEffect, useMemo } from 'react'
import { Building2, X, Search, ChevronDown } from 'lucide-react'
import { DEPARTMENTS, Department } from '@/data/dictionaries'
import { cn } from '@/lib/utils'
import Tag from '@/components/common/Tag'

export interface DeptSelectorProps {
  value?: string[]
  onChange?: (value: string[]) => void
  label?: string
  required?: boolean
  placeholder?: string
  className?: string
  maxTags?: number
}

export default function DeptSelector({
  value = [],
  onChange,
  label = '责任部门',
  required = false,
  placeholder = '输入或选择责任部门...',
  className,
  maxTags = 10,
}: DeptSelectorProps) {
  const [inputValue, setInputValue] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selectedDepts = useMemo(() => {
    return value
      .map((v) => DEPARTMENTS.find((d) => d.value === v))
      .filter(Boolean) as Department[]
  }, [value])

  const suggestions = useMemo(() => {
    const query = inputValue.trim().toLowerCase()
    const available = DEPARTMENTS.filter((d) => !value.includes(d.value))
    if (!query) return available
    return available.filter(
      (d) =>
        d.label.toLowerCase().includes(query) ||
        d.code.toLowerCase().includes(query)
    )
  }, [inputValue, value])

  const quickDepts = useMemo(() => {
    return DEPARTMENTS.slice(0, 14)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    setHighlightedIndex(0)
  }, [inputValue])

  const addDepartment = (deptValue: string) => {
    if (value.includes(deptValue)) return
    if (value.length >= maxTags) return
    const newValue = [...value, deptValue]
    onChange?.(newValue)
    setInputValue('')
    inputRef.current?.focus()
  }

  const removeDepartment = (deptValue: string) => {
    const newValue = value.filter((v) => v !== deptValue)
    onChange?.(newValue)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isDropdownOpen && suggestions.length > 0) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        setIsDropdownOpen(true)
        return
      }
    }

    if (e.key === 'ArrowDown' && suggestions.length > 0) {
      e.preventDefault()
      setIsDropdownOpen(true)
      setHighlightedIndex((prev) => (prev + 1) % suggestions.length)
    } else if (e.key === 'ArrowUp' && suggestions.length > 0) {
      e.preventDefault()
      setHighlightedIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length)
    } else if (e.key === 'Enter' && isDropdownOpen && suggestions.length > 0) {
      e.preventDefault()
      addDepartment(suggestions[highlightedIndex].value)
      setIsDropdownOpen(false)
    } else if (e.key === 'Escape') {
      setIsDropdownOpen(false)
    } else if (e.key === 'Backspace' && inputValue === '' && value.length > 0) {
      removeDepartment(value[value.length - 1])
    } else if (e.key === 'Tab' && isDropdownOpen && suggestions.length > 0) {
      e.preventDefault()
      addDepartment(suggestions[highlightedIndex].value)
      setIsDropdownOpen(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    setIsDropdownOpen(true)
  }

  return (
    <div className={cn('space-y-2.5', className)} ref={containerRef}>
      <div className="flex items-center gap-1">
        <label className="text-sm font-medium text-neutral-200">{label}</label>
        {required && <span className="text-danger text-xs">*</span>}
        {value.length > 0 && (
          <span className="text-xs text-neutral-500 ml-auto">
            已选 {value.length}/{maxTags}
          </span>
        )}
      </div>

      <div
        className={cn(
          'relative rounded-sm border bg-background-lighter transition-all duration-150',
          'focus-within:border-primary focus-within:ring-1 focus-within:ring-primary-light/50',
          isDropdownOpen ? 'border-primary' : 'border-neutral-600'
        )}
      >
        <div className="flex flex-wrap items-center gap-1.5 p-2 min-h-[40px]">
          {selectedDepts.map((dept) => (
            <Tag
              key={dept.value}
              label={dept.label}
              variant="department"
              onRemove={() => removeDepartment(dept.value)}
            />
          ))}

          <div className="flex-1 flex items-center gap-1 min-w-[120px]">
            {inputValue === '' && (
              <Search className="w-3.5 h-3.5 text-neutral-500 flex-shrink-0 ml-1" strokeWidth={2} />
            )}
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsDropdownOpen(true)}
              placeholder={value.length === 0 ? placeholder : ''}
              disabled={value.length >= maxTags}
              className={cn(
                'flex-1 min-w-[80px] bg-transparent text-sm text-neutral-100',
                'placeholder:text-neutral-500 outline-none',
                'disabled:cursor-not-allowed disabled:opacity-50'
              )}
            />
            {(isDropdownOpen || suggestions.length > 0) && (
              <ChevronDown
                className={cn(
                  'w-4 h-4 text-neutral-500 transition-transform duration-150 mr-1',
                  isDropdownOpen && 'rotate-180'
                )}
              />
            )}
          </div>
        </div>

        {isDropdownOpen && suggestions.length > 0 && (
          <div
            ref={dropdownRef}
            className={cn(
              'absolute z-20 top-full left-0 right-0 mt-1',
              'bg-background-light border border-neutral-600 rounded-sm shadow-card-hover',
              'max-h-56 overflow-y-auto'
            )}
          >
            {suggestions.map((dept, index) => (
              <div
                key={dept.value}
                onMouseEnter={() => setHighlightedIndex(index)}
                onMouseDown={(e) => {
                  e.preventDefault()
                  addDepartment(dept.value)
                  setIsDropdownOpen(false)
                }}
                className={cn(
                  'px-3 py-2 cursor-pointer transition-colors duration-100',
                  'flex items-center justify-between gap-2',
                  index === highlightedIndex
                    ? 'bg-primary/20 text-neutral-50'
                    : 'text-neutral-300 hover:bg-neutral-700/60'
                )}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Building2 className="w-3.5 h-3.5 text-info flex-shrink-0" strokeWidth={2} />
                  <span className="text-sm truncate">{dept.label}</span>
                </div>
                <span className="text-[10px] text-neutral-500 flex-shrink-0 uppercase">
                  {dept.code}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-1.5">
        <div className="text-[11px] text-neutral-500 flex items-center gap-1">
          <span>常用部门快捷选择</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {quickDepts.map((dept) => {
            const isSelected = value.includes(dept.value)
            const isDisabled = !isSelected && value.length >= maxTags
            return (
              <button
                key={dept.value}
                type="button"
                onClick={() => addDepartment(dept.value)}
                disabled={isDisabled}
                className={cn(
                  'px-2 py-1 rounded-sm text-[11px] font-medium transition-all duration-150',
                  'border flex items-center gap-1',
                  isSelected
                    ? 'bg-info/20 text-info-light border-info/50 cursor-default'
                    : isDisabled
                    ? 'bg-neutral-800/30 text-neutral-600 border-neutral-700/50 cursor-not-allowed'
                    : 'bg-neutral-800/60 text-neutral-400 border-neutral-700 hover:bg-info/10 hover:text-info-light hover:border-info/40'
                )}
              >
                {isSelected && <X className="w-3 h-3" strokeWidth={2.5} />}
                <span>{dept.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
