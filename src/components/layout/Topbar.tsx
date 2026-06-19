import { useState, useEffect } from 'react'
import { Bell, Settings, User, Clock, ShieldAlert } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Topbar() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [hasNotification] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatDate = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    const weekDay = weekDays[date.getDay()]
    return `${year}-${month}-${day} ${weekDay}`
  }

  const formatTime = (date: Date) => {
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    return `${hours}:${minutes}:${seconds}`
  }

  return (
    <header className="h-14 bg-background-light border-b border-neutral-700 flex items-center justify-between px-5 flex-shrink-0">
      <div className="flex items-center gap-3">
        <h1 className="text-[15px] font-medium text-neutral-200">
          网络舆情智能研判系统
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-sm bg-neutral-800/50 border border-neutral-700">
          <ShieldAlert className="w-4 h-4 text-warning-light" strokeWidth={1.8} />
          <span className="text-xs text-neutral-300">
            值班人员：
          </span>
          <span className="text-xs font-medium text-neutral-100">
            张明华
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-success-light animate-pulse-soft" />
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-sm bg-neutral-800/50 border border-neutral-700">
          <Clock className="w-4 h-4 text-primary-light" strokeWidth={1.8} />
          <span className="text-xs text-neutral-400 font-mono-num">
            {formatDate(currentTime)}
          </span>
          <span className="text-xs font-semibold text-neutral-100 font-mono-num tracking-wider">
            {formatTime(currentTime)}
          </span>
        </div>

        <div className="h-6 w-px bg-neutral-700 mx-1" />

        <button
          type="button"
          className={cn(
            'relative w-9 h-9 rounded-sm flex items-center justify-center transition-all duration-150',
            'hover:bg-neutral-700/60 text-neutral-400 hover:text-neutral-200'
          )}
        >
          <Bell className="w-4.5 h-4.5" strokeWidth={1.8} />
          {hasNotification && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-danger-light animate-pulse-soft" />
          )}
        </button>

        <button
          type="button"
          className={cn(
            'w-9 h-9 rounded-sm flex items-center justify-center transition-all duration-150',
            'hover:bg-neutral-700/60 text-neutral-400 hover:text-neutral-200'
          )}
        >
          <Settings className="w-4.5 h-4.5" strokeWidth={1.8} />
        </button>

        <div className="ml-1 flex items-center gap-2.5 pl-3 border-l border-neutral-700">
          <div className="w-8 h-8 rounded-sm bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
            <User className="w-4 h-4 text-white" strokeWidth={2} />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-xs font-medium text-neutral-100">管理员</span>
            <span className="text-[10px] text-neutral-500">网信办</span>
          </div>
        </div>
      </div>
    </header>
  )
}
