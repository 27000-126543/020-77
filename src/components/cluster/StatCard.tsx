import { FileText, CheckCircle2, TrendingUp, AlertCircle, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatNumber } from '@/utils/formatters';

type StatCardType = 'total' | 'handled' | 'rising' | 'pending';

interface StatCardProps {
  type: StatCardType;
  value: number;
  trend: number;
  trendData?: number[];
  className?: string;
}

const cardConfigs: Record<
  StatCardType,
  {
    label: string;
    icon: LucideIcon;
    iconBg: string;
    iconColor: string;
    valueColor: string;
  }
> = {
  total: {
    label: '今日总量',
    icon: FileText,
    iconBg: 'bg-primary/15',
    iconColor: 'text-primary-light',
    valueColor: 'text-neutral-100',
  },
  handled: {
    label: '已处置',
    icon: CheckCircle2,
    iconBg: 'bg-success/15',
    iconColor: 'text-success-light',
    valueColor: 'text-success-light',
  },
  rising: {
    label: '升温中',
    icon: TrendingUp,
    iconBg: 'bg-danger/15',
    iconColor: 'text-danger-light',
    valueColor: 'text-danger-light',
  },
  pending: {
    label: '待研判',
    icon: AlertCircle,
    iconBg: 'bg-warning/15',
    iconColor: 'text-warning-light',
    valueColor: 'text-warning-light',
  },
};

function MiniTrendChart({ data, isUp }: { data: number[]; isUp: boolean }) {
  const width = 80;
  const height = 32;
  const padding = 2;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data
    .map((val, idx) => {
      const x = padding + (idx * (width - padding * 2)) / (data.length - 1);
      const y = height - padding - ((val - min) / range) * (height - padding * 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  const areaPoints = `${padding},${height - padding} ${points} ${width - padding},${height - padding}`;
  const strokeColor = isUp ? '#EF4444' : '#10B981';
  const gradientId = `gradient-${isUp ? 'up' : 'down'}-${Math.random().toString(36).slice(2, 8)}`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-20 h-8"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={strokeColor} stopOpacity="0.3" />
          <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill={`url(#${gradientId})`} />
      <polyline
        points={points}
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function StatCard({
  type,
  value,
  trend,
  trendData = [12, 18, 15, 22, 28, 25, 31, 38, 35, 42, 48, 45],
  className,
}: StatCardProps) {
  const config = cardConfigs[type];
  const Icon = config.icon;
  const isUp = trend > 0;
  const isZero = trend === 0;

  const defaultTrendData: Record<StatCardType, number[]> = {
    total: [45, 52, 48, 61, 58, 72, 68, 85, 79, 92, 88, 95],
    handled: [30, 35, 42, 38, 51, 48, 55, 62, 58, 68, 72, 78],
    rising: [5, 8, 6, 12, 9, 15, 11, 18, 14, 22, 25, 28],
    pending: [20, 18, 25, 22, 30, 28, 35, 32, 40, 38, 42, 45],
  };

  const data = trendData.length > 0 ? trendData : defaultTrendData[type];

  return (
    <div
      className={cn(
        'gov-card p-4 flex flex-col gap-3',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'w-10 h-10 rounded-sm flex items-center justify-center',
              config.iconBg
            )}
          >
            <Icon className={cn('w-5 h-5', config.iconColor)} strokeWidth={2} />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-neutral-400 font-medium">
              {config.label}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {!isZero && (
            <>
              <span
                className={cn(
                  'text-base font-bold leading-none',
                  isUp ? 'text-danger-light' : 'text-success-light'
                )}
              >
                {isUp ? '↑' : '↓'}
              </span>
              <span
                className={cn(
                  'text-xs font-mono-num font-medium',
                  isUp ? 'text-danger-light' : 'text-success-light'
                )}
              >
                {Math.abs(trend)}%
              </span>
            </>
          )}
        </div>
      </div>

      <div className="flex items-end justify-between">
        <span
          className={cn(
            'text-3xl font-mono-num font-semibold leading-none tracking-tight',
            config.valueColor
          )}
        >
          {formatNumber(value)}
        </span>
        <MiniTrendChart data={data} isUp={isUp || isZero} />
      </div>
    </div>
  );
}
