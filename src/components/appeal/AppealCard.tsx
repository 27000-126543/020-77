import { useState } from 'react';
import {
  MessageSquare,
  Heart,
  Repeat2,
  Phone,
  PlayCircle,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppealStore, type Appeal as StoreAppeal } from '@/store/useAppealStore';
import {
  formatRelativeTime,
  formatTime,
  getSentimentColor,
  getPlatformColor,
  formatCompactNumber,
} from '@/utils/formatters';
import { PLATFORMS } from '@/data/dictionaries';

interface AppealCardProps {
  appeal: StoreAppeal;
  isSelected?: boolean;
  onSelect?: (id: string, checked: boolean) => void;
  onClick?: (appeal: StoreAppeal) => void;
}

const PLATFORM_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  hotline: Phone,
  message: MessageSquare,
  video: PlayCircle,
  forum: Users,
  shortvideo: PlayCircle,
};

export default function AppealCard({
  appeal,
  isSelected = false,
  onSelect,
  onClick,
}: AppealCardProps) {
  const { selectAppeal, selectedAppealId, toggleFollowed } = useAppealStore();
  const [hovered, setHovered] = useState(false);

  const sentimentStyle = getSentimentColor(appeal.sentiment);
  const platformStyle = getPlatformColor(appeal.platform);
  const PlatformIcon = PLATFORM_ICONS[appeal.platform] || MessageSquare;

  const isDetailOpen = selectedAppealId === appeal.id;

  const handleCardClick = () => {
    onClick?.(appeal);
    selectAppeal(isDetailOpen ? null : appeal.id);
  };

  const handleCheckboxChange = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect?.(appeal.id, !isSelected);
  };

  return (
    <div
      onClick={handleCardClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        'relative gov-card cursor-pointer overflow-hidden',
        'transition-all duration-200 ease-out',
        hovered && '-translate-y-0.5 shadow-card-hover',
        isDetailOpen && 'ring-2 ring-primary-light/50 border-primary-light/50',
        appeal.excluded && 'opacity-50'
      )}
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px] flex-shrink-0"
        style={{ backgroundColor: sentimentStyle.dot.replace('bg-', '').startsWith('#') ? sentimentStyle.dot : undefined }}
      >
        <div className={cn('w-full h-full', sentimentStyle.dot)} />
      </div>

      <div className="pl-3 pr-3 py-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span
              className={cn(
                'inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-xs font-medium flex-shrink-0',
                platformStyle.bg,
                platformStyle.text
              )}
            >
              <PlatformIcon className="w-3 h-3" />
              <span>{platformStyle.label}</span>
            </span>

            <div className="flex items-center gap-2 text-xs text-neutral-500 flex-shrink-0">
              <span className="text-neutral-400">{formatRelativeTime(appeal.publishedAt)}</span>
              <span className="text-neutral-600">·</span>
              <span className="font-mono-num">{formatTime(appeal.publishedAt, 'MM-DD HH:mm')}</span>
            </div>
          </div>

          <div
            onClick={handleCheckboxChange}
            className={cn(
              'w-4 h-4 rounded-sm border flex items-center justify-center flex-shrink-0 cursor-pointer transition-all mt-0.5',
              isSelected
                ? 'bg-primary-light border-primary-light'
                : 'border-neutral-600 hover:border-neutral-400',
              hovered && !isSelected && 'border-neutral-500'
            )}
          >
            {isSelected && (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="3"
                className="w-2.5 h-2.5"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </div>
        </div>

        <div className="mt-2.5 space-y-1">
          <h4 className="text-sm font-medium text-neutral-200 leading-snug line-clamp-1">
            {appeal.title}
          </h4>
          <p className="text-xs text-neutral-400 leading-relaxed line-clamp-2">
            {appeal.summary || appeal.content}
          </p>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-4 font-mono-num text-xs">
            <span className="flex items-center gap-1 text-neutral-400">
              <MessageSquare className="w-3.5 h-3.5 text-neutral-500" />
              <span>{formatCompactNumber(appeal.interactions.comments)}</span>
            </span>
            <span className="flex items-center gap-1 text-neutral-400">
              <Heart className="w-3.5 h-3.5 text-neutral-500" />
              <span>{formatCompactNumber(appeal.interactions.likes)}</span>
            </span>
            <span className="flex items-center gap-1 text-neutral-400">
              <Repeat2 className="w-3.5 h-3.5 text-neutral-500" />
              <span>{formatCompactNumber(appeal.interactions.shares)}</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={cn(
                'inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-medium',
                sentimentStyle.bg,
                sentimentStyle.text
              )}
            >
              {sentimentStyle.label}
            </span>

            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFollowed(appeal.id);
              }}
              className={cn(
                'p-1 rounded-sm transition-all',
                appeal.followed
                  ? 'text-warning'
                  : 'text-neutral-500 hover:text-warning opacity-0',
                hovered && 'opacity-100'
              )}
              title={appeal.followed ? '取消关注' : '加入关注'}
            >
              <svg
                viewBox="0 0 24 24"
                fill={appeal.followed ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="2"
                className="w-4 h-4"
              >
                <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </button>
          </div>
        </div>

        {appeal.excluded && (
          <div className="absolute top-2 right-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-medium bg-neutral-700/80 text-neutral-400 border border-neutral-600">
              已标记无关
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
