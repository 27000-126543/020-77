import { useState } from 'react';
import {
  X,
  MessageSquare,
  Heart,
  Repeat2,
  TrendingUp,
  MapPin,
  User,
  Phone,
  PlayCircle,
  Users,
  Ban,
  Star,
  Link2,
  ChevronRight,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppealStore, type Appeal as StoreAppeal } from '@/store/useAppealStore';
import { useClusterStore } from '@/store/useClusterStore';
import {
  formatTime,
  formatRelativeTime,
  getSentimentColor,
  getPlatformColor,
  formatNumber,
} from '@/utils/formatters';
import { PLATFORMS } from '@/data/dictionaries';

const PLATFORM_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  hotline: Phone,
  message: MessageSquare,
  video: PlayCircle,
  forum: Users,
  shortvideo: PlayCircle,
};

export default function DetailPanel() {
  const {
    selectedAppealId,
    selectAppeal,
    getAppealById,
    toggleExcluded,
    toggleFollowed,
    appeals,
  } = useAppealStore();
  const { clusters } = useClusterStore();
  const [showClusterModal, setShowClusterModal] = useState(false);

  const appeal = selectedAppealId ? getAppealById(selectedAppealId) : null;

  if (!appeal) return null;

  const sentimentStyle = getSentimentColor(appeal.sentiment);
  const platformStyle = getPlatformColor(appeal.platform);
  const PlatformIcon = PLATFORM_ICONS[appeal.platform] || MessageSquare;

  const similarAppeals = appeals
    .filter((a) => {
      if (a.id === appeal.id) return false;
      if (appeal.clusterId && a.clusterId === appeal.clusterId) return true;
      const commonTags = a.tags.filter((t) => appeal.tags.includes(t));
      return commonTags.length > 0;
    })
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 8);

  const handleClose = () => {
    selectAppeal(null);
    setShowClusterModal(false);
  };

  const handleLinkToCluster = (clusterId: string) => {
    setShowClusterModal(false);
  };

  const statusConfig = {
    pending: { label: '待处理', color: 'bg-warning-bg text-warning-light border-warning/30' },
    processing: { label: '处理中', color: 'bg-primary/20 text-primary-light border-primary/30' },
    resolved: { label: '已解决', color: 'bg-success-bg text-success-light border-success/30' },
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-40 backdrop-blur-xs"
        onClick={handleClose}
      />

      <div className="fixed right-0 top-0 bottom-0 z-50 w-[420px] bg-background-light border-l border-neutral-700 shadow-2xl flex flex-col animate-slide-in-right">
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-700 bg-background/50 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <span
              className={cn(
                'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-medium',
                platformStyle.bg,
                platformStyle.text
              )}
            >
              <PlatformIcon className="w-3.5 h-3.5" />
              <span>{platformStyle.label}</span>
            </span>
            <span
              className={cn(
                'inline-flex items-center px-2.5 py-1 rounded-sm text-xs font-medium',
                sentimentStyle.bg,
                sentimentStyle.text
              )}
            >
              <span className={cn('w-1.5 h-1.5 rounded-full mr-1.5', sentimentStyle.dot)} />
              {sentimentStyle.label}
            </span>
            <span
              className={cn(
                'inline-flex items-center px-2.5 py-1 rounded-sm text-xs font-medium border',
                statusConfig[appeal.status].color
              )}
            >
              {statusConfig[appeal.status].label}
            </span>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-sm text-neutral-400 hover:text-neutral-200 hover:bg-neutral-700/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="p-5 space-y-5">
            <div>
              <h2 className="text-lg font-semibold text-neutral-100 leading-relaxed">
                {appeal.title}
              </h2>
              {appeal.tags.length > 0 && (
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {appeal.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2 py-0.5 rounded-sm text-xs bg-neutral-700/50 text-neutral-400 border border-neutral-600/50"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-background/50 rounded-sm p-3 border border-neutral-700/50">
                <div className="flex items-center gap-1.5 text-xs text-neutral-500 mb-1">
                  <Clock className="w-3.5 h-3.5" />
                  发布时间
                </div>
                <div className="text-sm text-neutral-200 font-medium">
                  {formatTime(appeal.publishedAt, 'YYYY-MM-DD')}
                </div>
                <div className="text-xs text-neutral-500 font-mono-num mt-0.5">
                  {formatTime(appeal.publishedAt, 'HH:mm:ss')} · {formatRelativeTime(appeal.publishedAt)}
                </div>
              </div>
              <div className="bg-background/50 rounded-sm p-3 border border-neutral-700/50">
                <div className="flex items-center gap-1.5 text-xs text-neutral-500 mb-1">
                  <MapPin className="w-3.5 h-3.5" />
                  所属区域
                </div>
                <div className="text-sm text-neutral-200 font-medium">{appeal.region}</div>
                <div className="text-xs text-neutral-500 mt-0.5">{appeal.district}</div>
              </div>
            </div>

            <div className="bg-background/50 rounded-sm p-4 border border-neutral-700/50">
              <div className="flex items-center gap-1.5 text-xs text-neutral-500 mb-3">
                <User className="w-3.5 h-3.5" />
                发布者信息
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-light/30 to-info-light/30 flex items-center justify-center border border-neutral-600">
                  <User className="w-5 h-5 text-neutral-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-neutral-200">
                    {appeal.author.name}
                  </div>
                  {appeal.author.anonymized && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="inline-flex items-center text-[10px] px-1.5 py-0.5 rounded bg-neutral-700 text-neutral-500">
                        已脱敏
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[
                { label: '评论', value: appeal.interactions.comments, icon: MessageSquare, color: 'text-blue-400' },
                { label: '点赞', value: appeal.interactions.likes, icon: Heart, color: 'text-rose-400' },
                { label: '转发', value: appeal.interactions.shares, icon: Repeat2, color: 'text-emerald-400' },
                { label: '总互动', value: appeal.interactions.total, icon: TrendingUp, color: 'text-amber-400' },
              ].map(({ label, value, icon: Icon, color }) => (
                <div
                  key={label}
                  className="bg-background/50 rounded-sm p-2.5 border border-neutral-700/50 text-center"
                >
                  <Icon className={cn('w-4 h-4 mx-auto mb-1.5', color)} />
                  <div className="text-sm font-semibold text-neutral-200 font-mono-num">
                    {formatNumber(value)}
                  </div>
                  <div className="text-[10px] text-neutral-500 mt-0.5">{label}</div>
                </div>
              ))}
            </div>

            <div>
              <div className="text-xs text-neutral-500 mb-2 font-medium">完整内容</div>
              <div className="bg-background/40 rounded-sm p-4 border border-neutral-700/50">
                <p className="text-sm text-neutral-300 leading-7 whitespace-pre-wrap">
                  {appeal.content}
                </p>
              </div>
            </div>

            {similarAppeals.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs text-neutral-500 font-medium flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    相似诉求时间线
                    <span className="text-neutral-600">({similarAppeals.length})</span>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute left-[7px] top-2 bottom-2 w-px bg-neutral-700" />
                  <div className="space-y-0">
                    {similarAppeals.map((similar, index) => {
                      const sStyle = getSentimentColor(similar.sentiment);
                      const sPlatform = getPlatformColor(similar.platform);
                      const SPlatformIcon = PLATFORM_ICONS[similar.platform] || MessageSquare;

                      return (
                        <div
                          key={similar.id}
                          onClick={() => {
                            selectAppeal(similar.id);
                          }}
                          className={cn(
                            'relative pl-6 pr-3 py-3 cursor-pointer transition-all rounded-sm group',
                            'hover:bg-neutral-700/30',
                            index !== similarAppeals.length - 1 && 'border-b border-neutral-700/30'
                          )}
                        >
                          <div
                            className={cn(
                              'absolute left-0 top-4 w-3.5 h-3.5 rounded-full border-2 border-background-light flex items-center justify-center z-10',
                              sStyle.dot
                            )}
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-background-light" />
                          </div>

                          <div className="flex items-center gap-2 mb-1.5">
                            <span
                              className={cn(
                                'inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium',
                                sPlatform.bg,
                                sPlatform.text
                              )}
                            >
                              <SPlatformIcon className="w-3 h-3" />
                              {sPlatform.label}
                            </span>
                            <span className="text-[10px] text-neutral-500 font-mono-num">
                              {formatRelativeTime(similar.publishedAt)}
                            </span>
                            <span
                              className={cn(
                                'ml-auto inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium',
                                sStyle.bg,
                                sStyle.text
                              )}
                            >
                              {sStyle.label}
                            </span>
                          </div>

                          <p className="text-xs text-neutral-300 leading-relaxed line-clamp-2 group-hover:text-neutral-200 transition-colors">
                            {similar.summary || similar.content}
                          </p>

                          <div className="flex items-center gap-3 mt-2 text-[10px] text-neutral-500 font-mono-num">
                            <span className="flex items-center gap-1">
                              <MessageSquare className="w-3 h-3" />
                              {formatNumber(similar.interactions.comments)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Heart className="w-3 h-3" />
                              {formatNumber(similar.interactions.likes)}
                            </span>
                          </div>

                          <ChevronRight className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 group-hover:text-neutral-400 opacity-0 group-hover:opacity-100 transition-all" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-neutral-700 p-4 bg-background/80 backdrop-blur-sm">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => toggleExcluded(appeal.id)}
              className={cn(
                'flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-sm text-sm font-medium transition-all',
                appeal.excluded
                  ? 'bg-neutral-600 text-neutral-200 hover:bg-neutral-500'
                  : 'bg-neutral-700/70 text-neutral-300 hover:bg-neutral-600 border border-neutral-600'
              )}
            >
              <Ban className="w-4 h-4" />
              <span>{appeal.excluded ? '取消标记' : '标记无关'}</span>
            </button>
            <button
              onClick={() => toggleFollowed(appeal.id)}
              className={cn(
                'flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-sm text-sm font-medium transition-all',
                appeal.followed
                  ? 'bg-warning text-white hover:bg-warning/90'
                  : 'bg-warning/15 text-warning-light border border-warning/30 hover:bg-warning/25'
              )}
            >
              <Star className={cn('w-4 h-4', appeal.followed && 'fill-white')} />
              <span>{appeal.followed ? '取消关注' : '加入关注'}</span>
            </button>
            <button
              onClick={() => setShowClusterModal(true)}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-sm text-sm font-medium bg-primary-light/15 text-primary-light border border-primary-light/30 hover:bg-primary-light/25 transition-all"
            >
              <Link2 className="w-4 h-4" />
              <span>关联聚类</span>
            </button>
          </div>
        </div>
      </div>

      {showClusterModal && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-[60]"
            onClick={() => setShowClusterModal(false)}
          />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] w-[480px] max-h-[70vh] bg-background-light border border-neutral-600 rounded-md shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-700">
              <h3 className="text-base font-semibold text-neutral-100">选择关联聚类</h3>
              <button
                onClick={() => setShowClusterModal(false)}
                className="p-1 rounded-sm text-neutral-400 hover:text-neutral-200 hover:bg-neutral-700/50 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {clusters.length === 0 ? (
                <div className="text-center py-12 text-neutral-500 text-sm">
                  暂无可用聚类
                </div>
              ) : (
                clusters.map((cluster) => (
                  <button
                    key={cluster.id}
                    onClick={() => handleLinkToCluster(cluster.id)}
                    className={cn(
                      'w-full text-left p-3.5 rounded-sm border transition-all',
                      'bg-background/40 border-neutral-700 hover:border-primary-light/50 hover:bg-primary/5'
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-neutral-200 truncate">
                          {cluster.name}
                        </div>
                        <div className="mt-1 text-xs text-neutral-500">
                          关键词：
                          <span className="text-neutral-400">{cluster.keywords.join('、')}</span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-xs text-neutral-400 font-mono-num">
                          {cluster.totalCount} 条
                        </div>
                        {cluster.newCount > 0 && (
                          <div className="text-[10px] text-danger-light mt-0.5">
                            +{cluster.newCount} 新增
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
