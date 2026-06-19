import { NavLink } from 'react-router-dom'
import { Inbox, LayoutDashboard, FileCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

const menuItems = [
  {
    path: '/appeals',
    label: '诉求汇入',
    icon: Inbox,
  },
  {
    path: '/clusters',
    label: '聚类看板',
    icon: LayoutDashboard,
  },
  {
    path: '/analysis',
    label: '研判记录',
    icon: FileCheck,
  },
]

export default function Sidebar() {
  return (
    <aside className="w-[200px] h-screen bg-neutral-950 border-r border-neutral-800 flex flex-col flex-shrink-0">
      <div className="h-14 flex items-center px-5 border-b border-neutral-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-sm bg-primary flex items-center justify-center">
            <LayoutDashboard className="w-4.5 h-4.5 text-white" strokeWidth={2.2} />
          </div>
          <span className="text-[15px] font-semibold text-neutral-100 tracking-wide">
            网信研判台
          </span>
        </div>
      </div>

      <nav className="flex-1 py-3 px-2.5 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-primary text-white shadow-glow'
                  : 'text-neutral-400 hover:bg-neutral-800/60 hover:text-neutral-200'
              )
            }
          >
            <item.icon
              className={cn(
                'w-[18px] h-[18px] flex-shrink-0',
                'transition-transform duration-150'
              )}
              strokeWidth={1.8}
            />
            <span className="tracking-wide">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-neutral-800">
        <div className="px-2 py-3 rounded-sm bg-neutral-900/50 border border-neutral-800">
          <div className="text-[11px] text-neutral-500 mb-1">系统版本</div>
          <div className="text-xs text-neutral-400 font-mono-num">v1.0.0</div>
        </div>
      </div>
    </aside>
  )
}
