import { useRef, useState, useEffect } from 'react'
import {
  FileText,
  Save,
  Send,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  StickyNote,
  Sparkles,
  ClipboardPaste,
} from 'lucide-react'
import { UrgencyLevel } from '@/types'
import { URGENCY_LEVELS } from '@/data/dictionaries'
import { cn } from '@/lib/utils'
import UrgencyPicker from './UrgencyPicker'
import DeptSelector from './DeptSelector'
import Button from '@/components/common/Button'

export interface AnalysisFormValues {
  title: string
  urgencyLevel: UrgencyLevel
  assignedDepartments: string[]
  suggestedCaliber: string
  disposalSuggestion: string
}

export interface AnalysisFormProps {
  initialValues?: Partial<AnalysisFormValues>
  onSave?: (values: AnalysisFormValues) => void
  onSubmit?: (values: AnalysisFormValues) => void
  isSubmitting?: boolean
  isSaving?: boolean
  className?: string
  disabled?: boolean
}

const defaultValues: AnalysisFormValues = {
  title: '',
  urgencyLevel: 'normal',
  assignedDepartments: [],
  suggestedCaliber: '',
  disposalSuggestion: '',
}

export default function AnalysisForm({
  initialValues,
  onSave,
  onSubmit,
  isSubmitting = false,
  isSaving = false,
  className,
  disabled = false,
}: AnalysisFormProps) {
  const [values, setValues] = useState<AnalysisFormValues>({
    ...defaultValues,
    ...initialValues,
  })
  const caliberRef = useRef<HTMLDivElement>(null)
  const [isCaliberFocused, setIsCaliberFocused] = useState(false)
  const [caliberLength, setCaliberLength] = useState(0)

  const stripHtml = (html: string) => {
    const tmp = document.createElement('div')
    tmp.innerHTML = html
    return tmp.textContent || tmp.innerText || ''
  }

  useEffect(() => {
    setValues((prev) => ({ ...prev, ...initialValues }))
    if (caliberRef.current && initialValues?.suggestedCaliber !== undefined) {
      const newHtml = initialValues.suggestedCaliber
      if (caliberRef.current.innerHTML !== newHtml) {
        caliberRef.current.innerHTML = newHtml
        setCaliberLength(stripHtml(newHtml).length)
      }
    } else if (caliberRef.current && !initialValues?.suggestedCaliber) {
      caliberRef.current.innerHTML = ''
      setCaliberLength(0)
    }
  }, [initialValues])

  const getUrgencyLabel = (level: UrgencyLevel) => {
    return URGENCY_LEVELS.find((u) => u.value === level)?.label || level
  }

  const handleInputChange = (field: keyof AnalysisFormValues, value: string | string[] | UrgencyLevel) => {
    setValues((prev) => ({ ...prev, [field]: value }))
  }

  const handleCaliberInput = () => {
    if (caliberRef.current) {
      const html = caliberRef.current.innerHTML
      handleInputChange('suggestedCaliber', html)
      setCaliberLength(stripHtml(html).length)
    }
  }

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    caliberRef.current?.focus()
    handleCaliberInput()
  }

  const handlePasteAsPlainText = () => {
    navigator.clipboard.readText().then((text) => {
      document.execCommand('insertText', false, text)
      handleCaliberInput()
    })
  }

  const handleInsertTemplate = (templateType: 'general' | 'consult' | 'complaint') => {
    const templates = {
      general:
        '<p>针对网民反映的问题，我单位高度重视，<strong>已第一时间安排专人核实情况</strong>。</p><p>目前相关工作正在有序推进中，后续将及时向社会公布进展。感谢网民对我们工作的监督与支持。</p>',
      consult:
        '<p>您好，您所咨询的政策如下：</p><ol><li>根据《<strong>XX办法</strong>》第X条规定，<em>[具体政策内容]</em></li><li>办理流程请参考<u>[相关链接或指引]</u></li></ol><p>如需进一步了解，请拨打咨询电话XXX-XXXXXXX，或前往XX服务窗口现场办理。</p>',
      complaint:
        '<p>收到网民反映后，我单位立即组织核查。</p><p>经查，<u>[情况说明]</u>。对此，我们已采取<strong>[处置措施]</strong>，并将持续加强<em>[后续监管]</em>，切实保障群众合法权益。</p>',
    }
    if (caliberRef.current) {
      caliberRef.current.innerHTML = templates[templateType]
      handleCaliberInput()
    }
  }

  return (
    <div
      className={cn(
        'flex flex-col h-full bg-background-light rounded-sm border border-neutral-700',
        className
      )}
    >
      <div className="px-5 py-4 border-b border-neutral-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-sm bg-primary/20 flex items-center justify-center">
            <FileText className="w-4 h-4 text-primary-light" strokeWidth={2} />
          </div>
          <div>
            <h2 className="text-base font-semibold text-neutral-50">研判处置单</h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              请完整填写以下信息，提交后将进入审批流程
            </p>
          </div>
        </div>
        {values.urgencyLevel && (
          <div
            className={cn(
              'px-2.5 py-1 rounded-sm text-xs font-medium',
              'border'
            )}
            style={{
              backgroundColor: `${URGENCY_LEVELS.find((u) => u.value === values.urgencyLevel)?.color}20`,
              borderColor: `${URGENCY_LEVELS.find((u) => u.value === values.urgencyLevel)?.color}50`,
              color: URGENCY_LEVELS.find((u) => u.value === values.urgencyLevel)?.color,
            }}
          >
            {getUrgencyLabel(values.urgencyLevel)}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
        <div className="space-y-2">
          <div className="flex items-center gap-1">
            <label className="text-sm font-medium text-neutral-200">标题</label>
            <span className="text-danger text-xs">*</span>
          </div>
          <input
            type="text"
            value={values.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="请输入研判主题标题..."
            disabled={disabled}
            className={cn(
              'w-full px-3.5 py-2.5 rounded-sm bg-background-lighter border border-neutral-600',
              'text-sm text-neutral-100 placeholder:text-neutral-500',
              'focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary-light/50',
              'transition-all duration-150',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          />
        </div>

        <UrgencyPicker
          value={values.urgencyLevel}
          onChange={(v) => handleInputChange('urgencyLevel', v)}
          disabled={disabled}
        />

        <DeptSelector
          value={values.assignedDepartments}
          onChange={(v) => handleInputChange('assignedDepartments', v)}
        />

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <label className="text-sm font-medium text-neutral-200">建议口径</label>
              <span className="text-danger text-xs">*</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[11px] text-neutral-500">
                {caliberLength} 字
              </span>
            </div>
          </div>

          <div
            className={cn(
              'rounded-sm border bg-background overflow-hidden transition-all duration-150',
              isCaliberFocused
                ? 'border-primary ring-1 ring-primary-light/50'
                : 'border-neutral-600'
            )}
          >
            <div
              className={cn(
                'flex items-center gap-0.5 px-1.5 py-1.5',
                'bg-background-lighter border-b border-neutral-700',
                disabled && 'opacity-50'
              )}
            >
              <div className="flex items-center gap-0.5 border-r border-neutral-700 pr-1 mr-1">
                <button
                  type="button"
                  onClick={() => execCommand('bold')}
                  disabled={disabled}
                  className="w-7 h-7 rounded-sm flex items-center justify-center text-neutral-400 hover:bg-neutral-700 hover:text-neutral-100 transition-colors disabled:cursor-not-allowed"
                  title="加粗"
                >
                  <Bold className="w-3.5 h-3.5" strokeWidth={2.5} />
                </button>
                <button
                  type="button"
                  onClick={() => execCommand('italic')}
                  disabled={disabled}
                  className="w-7 h-7 rounded-sm flex items-center justify-center text-neutral-400 hover:bg-neutral-700 hover:text-neutral-100 transition-colors disabled:cursor-not-allowed"
                  title="斜体"
                >
                  <Italic className="w-3.5 h-3.5" strokeWidth={2.5} />
                </button>
                <button
                  type="button"
                  onClick={() => execCommand('underline')}
                  disabled={disabled}
                  className="w-7 h-7 rounded-sm flex items-center justify-center text-neutral-400 hover:bg-neutral-700 hover:text-neutral-100 transition-colors disabled:cursor-not-allowed"
                  title="下划线"
                >
                  <Underline className="w-3.5 h-3.5" strokeWidth={2.5} />
                </button>
              </div>

              <div className="flex items-center gap-0.5 border-r border-neutral-700 pr-1 mr-1">
                <button
                  type="button"
                  onClick={() => execCommand('insertUnorderedList')}
                  disabled={disabled}
                  className="w-7 h-7 rounded-sm flex items-center justify-center text-neutral-400 hover:bg-neutral-700 hover:text-neutral-100 transition-colors disabled:cursor-not-allowed"
                  title="无序列表"
                >
                  <List className="w-3.5 h-3.5" strokeWidth={2} />
                </button>
                <button
                  type="button"
                  onClick={() => execCommand('insertOrderedList')}
                  disabled={disabled}
                  className="w-7 h-7 rounded-sm flex items-center justify-center text-neutral-400 hover:bg-neutral-700 hover:text-neutral-100 transition-colors disabled:cursor-not-allowed"
                  title="有序列表"
                >
                  <ListOrdered className="w-3.5 h-3.5" strokeWidth={2} />
                </button>
                <button
                  type="button"
                  onClick={() => execCommand('justifyLeft')}
                  disabled={disabled}
                  className="w-7 h-7 rounded-sm flex items-center justify-center text-neutral-400 hover:bg-neutral-700 hover:text-neutral-100 transition-colors disabled:cursor-not-allowed"
                  title="左对齐"
                >
                  <AlignLeft className="w-3.5 h-3.5" strokeWidth={2} />
                </button>
              </div>

              <div className="flex items-center gap-0.5 border-r border-neutral-700 pr-1 mr-1">
                <button
                  type="button"
                  onClick={handlePasteAsPlainText}
                  disabled={disabled}
                  className="w-7 h-7 rounded-sm flex items-center justify-center text-neutral-400 hover:bg-neutral-700 hover:text-neutral-100 transition-colors disabled:cursor-not-allowed"
                  title="粘贴纯文本"
                >
                  <ClipboardPaste className="w-3.5 h-3.5" strokeWidth={2} />
                </button>
              </div>

              <div className="flex items-center gap-1 ml-auto">
                <button
                  type="button"
                  onClick={() => handleInsertTemplate('general')}
                  disabled={disabled}
                  className="px-2 h-7 rounded-sm text-[11px] font-medium bg-primary/10 text-primary-light hover:bg-primary/20 transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Sparkles className="w-3 h-3" strokeWidth={2} />
                  通用
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertTemplate('consult')}
                  disabled={disabled}
                  className="px-2 h-7 rounded-sm text-[11px] font-medium bg-info/10 text-info-light hover:bg-info/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  咨询
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertTemplate('complaint')}
                  disabled={disabled}
                  className="px-2 h-7 rounded-sm text-[11px] font-medium bg-warning/10 text-warning-light hover:bg-warning/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  投诉
                </button>
              </div>
            </div>

            <div
              ref={caliberRef}
              contentEditable={!disabled}
              suppressContentEditableWarning
              onInput={handleCaliberInput}
              onFocus={() => setIsCaliberFocused(true)}
              onBlur={() => setIsCaliberFocused(false)}
              className={cn(
                'min-h-[140px] px-3.5 py-3 text-sm text-neutral-100 leading-relaxed',
                'outline-none',
                'prose prose-invert prose-sm max-w-none',
                '[&_strong]:text-neutral-50 [&_strong]:font-bold',
                '[&_em]:text-neutral-200',
                '[&_u]:text-warning-light [&_u]:underline-offset-2',
                '[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2',
                '[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2',
                '[&_li]:my-0.5',
                '[&_p]:my-1.5',
                'empty:before:content-[attr(data-placeholder)]',
                'empty:before:text-neutral-500'
              )}
              data-placeholder="请输入对外发布的建议口径，可使用上方工具栏进行格式化编辑..."
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-1">
            <label className="text-sm font-medium text-neutral-200 flex items-center gap-1.5">
              <StickyNote className="w-3.5 h-3.5 text-warning-light" strokeWidth={2} />
              处置建议备注
            </label>
          </div>
          <textarea
            value={values.disposalSuggestion}
            onChange={(e) => handleInputChange('disposalSuggestion', e.target.value)}
            placeholder="请填写内部处置建议和工作安排，如：1. 牵头部门；2. 处置时限；3. 关键动作；4. 上报节点..."
            rows={5}
            disabled={disabled}
            className={cn(
              'w-full px-3.5 py-2.5 rounded-sm bg-background-lighter border border-neutral-600',
              'text-sm text-neutral-100 placeholder:text-neutral-500',
              'focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary-light/50',
              'transition-all duration-150 resize-none',
              'font-mono leading-relaxed',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          />
        </div>
      </div>

      <div className="px-5 py-3.5 border-t border-neutral-700 bg-background-lighter/50 flex items-center justify-between">
        <div className="text-xs text-neutral-500">
          <span className="inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-500" />
            保存为草稿后可继续编辑，提交后将进入审批流程
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="md"
            onClick={() => onSave?.(values)}
            loading={isSaving}
            leftIcon={<Save className="w-4 h-4" strokeWidth={2} />}
            disabled={disabled}
          >
            保存草稿
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => onSubmit?.(values)}
            loading={isSubmitting}
            leftIcon={<Send className="w-4 h-4" strokeWidth={2} />}
            disabled={disabled || !values.title || values.assignedDepartments.length === 0}
          >
            提交审批
          </Button>
        </div>
      </div>
    </div>
  )
}
