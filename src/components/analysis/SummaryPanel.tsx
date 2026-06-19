import { useRef, useState } from 'react'
import {
  Printer,
  Copy,
  Download,
  FileText,
  TrendingUp,
  AlertCircle,
  Users,
  MessageSquareQuote,
  Calendar,
  Clock,
  User,
  Check,
  Share2,
} from 'lucide-react'
import { UrgencyLevel } from '@/types'
import { URGENCY_LEVELS } from '@/data/dictionaries'
import { cn } from '@/lib/utils'

export interface RisingTopic {
  id: string
  title: string
  urgencyLevel: UrgencyLevel
  newCount: number
  growthRate: number
  departments: string[]
}

export interface KeyAppeal {
  id: string
  title: string
  region: string
  sentiment: 'positive' | 'neutral' | 'negative'
  summary: string
}

export interface ResponsibilityItem {
  department: string
  topics: string[]
}

export interface CaliberItem {
  topicTitle: string
  caliber: string
}

export interface SummaryData {
  title?: string
  date?: string
  generatedAt?: string
  generatedBy?: string
  risingTopics: RisingTopic[]
  keyAppeals: KeyAppeal[]
  responsibilities: ResponsibilityItem[]
  calibers: CaliberItem[]
  remarks?: string
}

export interface SummaryPanelProps {
  data: SummaryData
  className?: string
  onPrint?: () => void
  onCopy?: () => void
  onExport?: () => void
}

const sentimentStyles: Record<string, { label: string; className: string }> = {
  positive: {
    label: '正面',
    className: 'bg-success/20 text-success-light border-success/40',
  },
  neutral: {
    label: '中性',
    className: 'bg-neutral-600/30 text-neutral-300 border-neutral-500/40',
  },
  negative: {
    label: '负面',
    className: 'bg-danger/20 text-danger-light border-danger/40',
  },
}

export default function SummaryPanel({
  data,
  className,
  onPrint,
  onCopy,
  onExport,
}: SummaryPanelProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return new Date().toLocaleDateString('zh-CN')
    return new Date(dateStr).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    })
  }

  const formatTime = (timeStr?: string) => {
    if (!timeStr) return '--:--'
    return new Date(timeStr).toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getUrgencyInfo = (level: UrgencyLevel) => {
    return URGENCY_LEVELS.find((u) => u.value === level) || URGENCY_LEVELS[2]
  }

  const handleCopy = async () => {
    if (!contentRef.current) return
    try {
      const text = contentRef.current.innerText
      await navigator.clipboard.writeText(text)
      setCopied(true)
      onCopy?.()
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('复制失败:', err)
    }
  }

  const handlePrint = () => {
    onPrint?.()
    window.print()
  }

  const handleExport = () => {
    if (!contentRef.current) {
      onExport?.()
      return
    }
    const content = `
${data.title || '舆情研判值班摘要'}
${'='.repeat(50)}
日期: ${formatDate(data.date)}
生成时间: ${formatTime(data.generatedAt)}
值班员: ${data.generatedBy || '当前值班员'}

【一、升温TOP3】
${data.risingTopics
  .map(
    (t, i) =>
      `${i + 1}. ${t.title}（${getUrgencyInfo(t.urgencyLevel).label}）
   新增: ${t.newCount}条 | 增速: ${(t.growthRate * 100).toFixed(0)}% | 责任部门: ${t.departments.join('、')}`
  )
  .join('\n\n')}

【二、重点诉求】
${data.keyAppeals
  .map(
    (a, i) =>
      `${i + 1}. ${a.title}
   区域: ${a.region} | 情感: ${sentimentStyles[a.sentiment]?.label || a.sentiment}
   摘要: ${a.summary}`
  )
  .join('\n\n')}

【三、责任分工】
${data.responsibilities
  .map((r, i) => `${i + 1}. ${r.department}：${r.topics.join('、')}`)
  .join('\n')}

【四、建议口径汇总】
${data.calibers
  .map((c, i) => `${i + 1}. 【${c.topicTitle}】\n${c.caliber}`)
  .join('\n\n')}

${data.remarks ? `【备注】\n${data.remarks}\n` : ''}
${'='.repeat(50)}
`
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `舆情研判值班摘要_${data.date || new Date().toISOString().split('T')[0]}.txt`
    a.click()
    URL.revokeObjectURL(url)
    onExport?.()
  }

  return (
    <div className={cn('relative h-full flex flex-col', className)}>
      <div className="flex items-center justify-between px-4 py-3 bg-background-light border border-neutral-700 border-b-0 rounded-t-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-sm bg-primary/20 flex items-center justify-center">
            <FileText className="w-4 h-4 text-primary-light" strokeWidth={2} />
          </div>
          <div>
            <h2 className="text-base font-semibold text-neutral-50">值班摘要预览</h2>
            <p className="text-xs text-neutral-500 mt-0.5">A4排版格式 · 可直接打印或导出</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-xs text-neutral-500 mr-2">生成于 {formatTime(data.generatedAt)}</span>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 bg-neutral-900/50 border border-neutral-700 rounded-b-sm relative">
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 print:hidden">
          <div className="flex flex-col items-center gap-1.5 p-2 bg-background-light border border-neutral-600 rounded-sm shadow-card-hover">
            <button
              type="button"
              onClick={handlePrint}
              className="w-9 h-9 rounded-sm flex items-center justify-center text-neutral-400 hover:bg-neutral-700 hover:text-neutral-100 transition-colors group"
              title="打印"
            >
              <Printer className="w-4 h-4" strokeWidth={2} />
              <span className="absolute left-full ml-2 px-2 py-1 bg-neutral-800 text-white text-xs rounded-sm whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                打印
              </span>
            </button>
            <div className="w-5 h-px bg-neutral-700" />
            <button
              type="button"
              onClick={handleCopy}
              className="w-9 h-9 rounded-sm flex items-center justify-center text-neutral-400 hover:bg-neutral-700 hover:text-neutral-100 transition-colors group relative"
              title="复制"
            >
              {copied ? (
                <Check className="w-4 h-4 text-success-light" strokeWidth={2.5} />
              ) : (
                <Copy className="w-4 h-4" strokeWidth={2} />
              )}
              <span className="absolute left-full ml-2 px-2 py-1 bg-neutral-800 text-white text-xs rounded-sm whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                {copied ? '已复制' : '复制文本'}
              </span>
            </button>
            <div className="w-5 h-px bg-neutral-700" />
            <button
              type="button"
              onClick={handleExport}
              className="w-9 h-9 rounded-sm flex items-center justify-center text-neutral-400 hover:bg-neutral-700 hover:text-neutral-100 transition-colors group"
              title="导出"
            >
              <Download className="w-4 h-4" strokeWidth={2} />
              <span className="absolute left-full ml-2 px-2 py-1 bg-neutral-800 text-white text-xs rounded-sm whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                导出TXT
              </span>
            </button>
            <div className="w-5 h-px bg-neutral-700" />
            <button
              type="button"
              onClick={() => {
                onExport?.()
                navigator.clipboard?.writeText(window.location.href)
              }}
              className="w-9 h-9 rounded-sm flex items-center justify-center text-neutral-400 hover:bg-neutral-700 hover:text-neutral-100 transition-colors group"
              title="分享"
            >
              <Share2 className="w-4 h-4" strokeWidth={2} />
              <span className="absolute left-full ml-2 px-2 py-1 bg-neutral-800 text-white text-xs rounded-sm whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                分享链接
              </span>
            </button>
          </div>
        </div>

        <div
          ref={contentRef}
          className={cn(
            'mx-auto bg-white text-neutral-900 shadow-2xl',
            'w-[210mm] min-h-[297mm]',
            'p-[20mm] print:p-[15mm]'
          )}
          style={{
            fontFamily:
              '"Noto Sans SC", "Source Han Sans CN", "PingFang SC", "Microsoft YaHei", sans-serif',
          }}
        >
          <header className="text-center pb-6 mb-6 border-b-2 border-neutral-800">
            <h1 className="text-2xl font-bold text-neutral-900 tracking-wider mb-3">
              {data.title || '舆情研判值班摘要'}
            </h1>
            <div className="flex items-center justify-center gap-6 text-sm text-neutral-600">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-4 h-4" strokeWidth={2} />
                {formatDate(data.date)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-4 h-4" strokeWidth={2} />
                {formatTime(data.generatedAt)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <User className="w-4 h-4" strokeWidth={2} />
                {data.generatedBy || '当前值班员'}
              </span>
            </div>
          </header>

          <section className="mb-7">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-neutral-300">
              <div className="w-1 h-5 bg-danger rounded-sm" />
              <TrendingUp className="w-5 h-5 text-danger" strokeWidth={2.5} />
              <h2 className="text-lg font-bold text-neutral-900">一、升温TOP3</h2>
            </div>

            <div className="space-y-3">
              {data.risingTopics.slice(0, 3).map((topic, index) => {
                const urgency = getUrgencyInfo(topic.urgencyLevel)
                return (
                  <div
                    key={topic.id}
                    className="relative pl-12 pr-4 py-3 rounded-sm border border-neutral-200 bg-neutral-50"
                  >
                    <div
                      className="absolute left-0 top-0 bottom-0 w-2 rounded-l-sm"
                      style={{ backgroundColor: urgency.color }}
                    />
                    <span className="absolute left-3 top-3 w-6 h-6 rounded-full bg-neutral-800 text-white text-xs font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <h3 className="text-base font-semibold text-neutral-900 truncate">
                            {topic.title}
                          </h3>
                          <span
                            className="flex-shrink-0 px-2 py-0.5 rounded-sm text-[10px] font-bold text-white"
                            style={{ backgroundColor: urgency.color }}
                          >
                            {urgency.label}
                          </span>
                        </div>
                        <div className="text-xs text-neutral-500">
                          责任部门：{topic.departments.join('、') || '待分配'}
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <div className="text-lg font-bold text-danger">
                          +{topic.newCount}
                        </div>
                        <div className="text-[10px] text-danger font-medium">
                          ↑ {(topic.growthRate * 100).toFixed(0)}%
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          <section className="mb-7">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-neutral-300">
              <div className="w-1 h-5 bg-warning rounded-sm" />
              <AlertCircle className="w-5 h-5 text-warning" strokeWidth={2.5} />
              <h2 className="text-lg font-bold text-neutral-900">二、重点诉求</h2>
            </div>

            <div className="space-y-3">
              {data.keyAppeals.map((appeal, index) => {
                const sentiment = sentimentStyles[appeal.sentiment] || sentimentStyles.neutral
                return (
                  <div
                    key={appeal.id}
                    className="p-3 rounded-sm border border-neutral-200 bg-neutral-50"
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="flex-shrink-0 w-5 h-5 rounded-sm bg-warning/20 text-warning text-xs font-bold flex items-center justify-center mt-0.5">
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <h3 className="text-sm font-semibold text-neutral-900 truncate">
                            {appeal.title}
                          </h3>
                          <span
                            className={cn(
                              'flex-shrink-0 px-1.5 py-0.5 rounded-sm text-[10px] font-medium border',
                              sentiment.className
                            )}
                          >
                            {sentiment.label}
                          </span>
                        </div>
                        <div className="text-[11px] text-neutral-500 mb-1.5">
                          📍 {appeal.region}
                        </div>
                        <p className="text-xs text-neutral-700 leading-relaxed">
                          {appeal.summary}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          <section className="mb-7">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-neutral-300">
              <div className="w-1 h-5 bg-info rounded-sm" />
              <Users className="w-5 h-5 text-info" strokeWidth={2.5} />
              <h2 className="text-lg font-bold text-neutral-900">三、责任分工</h2>
            </div>

            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-neutral-100 border-b border-neutral-300">
                  <th className="text-left px-3 py-2.5 font-semibold text-neutral-800 border border-neutral-300 w-[30%]">
                    责任部门
                  </th>
                  <th className="text-left px-3 py-2.5 font-semibold text-neutral-800 border border-neutral-300">
                    负责议题
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.responsibilities.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-neutral-200 last:border-b-0 hover:bg-neutral-50"
                  >
                    <td className="px-3 py-2.5 border border-neutral-300 font-medium text-neutral-900 align-top">
                      {item.department}
                    </td>
                    <td className="px-3 py-2.5 border border-neutral-300 text-neutral-700 align-top">
                      {item.topics.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {item.topics.map((topic, i) => (
                            <span
                              key={i}
                              className="inline-block px-1.5 py-0.5 bg-info/10 text-info border border-info/30 rounded-sm text-xs"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-neutral-400 text-xs">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-neutral-300">
              <div className="w-1 h-5 bg-primary rounded-sm" />
              <MessageSquareQuote className="w-5 h-5 text-primary" strokeWidth={2.5} />
              <h2 className="text-lg font-bold text-neutral-900">四、建议口径汇总</h2>
            </div>

            <div className="space-y-4">
              {data.calibers.map((item, index) => (
                <div
                  key={index}
                  className="relative pl-4 p-3 rounded-sm border-l-4 border-primary bg-primary/5"
                >
                  <div className="flex items-start gap-2 mb-2">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                    <h3 className="text-sm font-semibold text-neutral-900 pt-0.5">
                      {item.topicTitle}
                    </h3>
                  </div>
                  <div className="ml-7 text-xs text-neutral-700 leading-relaxed whitespace-pre-wrap">
                    {item.caliber}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {data.remarks && (
            <section className="mt-7 pt-5 border-t border-dashed border-neutral-300">
              <div className="text-xs text-neutral-600 leading-relaxed">
                <span className="font-semibold text-neutral-800">【备注】</span>
                {data.remarks}
              </div>
            </section>
          )}

          <footer className="mt-8 pt-4 border-t border-neutral-200 text-[10px] text-neutral-400 text-center">
            本文档由舆情研判系统自动生成 · {formatDate(data.date)} · 仅供内部工作使用
          </footer>
        </div>
      </div>
    </div>
  )
}
