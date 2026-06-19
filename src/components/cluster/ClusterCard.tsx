import { useState } from 'react';
import { MapPin, MessageSquare, Zap, ThumbsUp, Eye, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatNumber } from '@/utils/formatters';
import { URGENCY_LEVELS, PLATFORMS } from '@/data/dictionaries';
import type { Cluster as StoreCluster } from '@/types';
import type { Cluster as MockCluster } from '@/data/mockClusters';

type Cluster = StoreCluster | MockCluster;

const urgencyBlockStyles: Record<string, { bg: string; label: string }> = {
  special: { bg: 'bg-danger', label: '特急' },
  urgent: { bg: 'bg-warning', label: '紧急' },
  normal: { bg: 'bg-yellow-500', label: '一般' },
  attention: { bg: 'bg-primary-light', label: '关注' },
};

interface ClusterCardProps {
  cluster: Cluster;
  onClick?: (cluster: Cluster) => void;
  className?: string;
}

function getUrgencyInfo(cluster: Cluster): { level: string; label: string } {
  if ('urgencyLevel' in cluster) {
    const urgencyItem = URGENCY_LEVELS.find((u) => u.value === cluster.urgencyLevel);
    return {
      level: cluster.urgencyLevel,
      label: urgencyItem?.label || cluster.urgencyLabel || '一般',
    };
  }
  if ('urgency' in cluster) {
    const map: Record<string, string> = {
      高: 'urgent',
      中: 'normal',
      低: 'attention',
    };
    const level = map[cluster.urgency] || 'normal';
    return { level, label: cluster.urgency };
  }
  return { level: 'normal', label: '一般' };
}

function getClusterTitle(cluster: Cluster): string {
  return 'title' in cluster ? cluster.title : cluster.name;
}

function getNewCount(cluster: Cluster): number {
  return cluster.newCount;
}

function getTotalCount(cluster: Cluster): number {
  return 'totalCount' in cluster ? cluster.totalCount : 0;
}

function getSpreadSpeed(cluster: Cluster): number {
  const c = cluster as unknown as Record<string, unknown>;
  if (typeof c.spreadSpeed === 'number') {
    return c.spreadSpeed as number;
  }
  if (typeof c.spreadSpeed === 'string') {
    const map: Record<string, number> = { 快: 85, 中: 55, 慢: 25 };
    return map[c.spreadSpeed as string] || 50;
  }
  if (typeof c.urgencyScore === 'number') {
    return c.urgencyScore as number;
  }
  return 50;
}

function getStreets(cluster: Cluster): string[] {
  if ('districts' in cluster && cluster.districts?.length) {
    return cluster.districts;
  }
  if ('streets' in cluster && cluster.streets?.length) {
    return cluster.streets;
  }
  if ('affectedStreets' in cluster && cluster.affectedStreets?.length) {
    return cluster.affectedStreets;
  }
  return [];
}

function getRepresentativePost(
  cluster: Cluster
): { title: string; summary: string; interactions: number; platform: string } | null {
  type RepPostT = { title?: string; summary?: string; content?: string; interactions?: number; platform?: string };
  let post: RepPostT | undefined;
  if ('representativePosts' in cluster && Array.isArray(cluster.representativePosts) && cluster.representativePosts.length > 0) {
    post = cluster.representativePosts[0] as RepPostT;
  } else if ('representativePost' in cluster && cluster.representativePost) {
    post = cluster.representativePost as RepPostT;
  }
  if (!post) return null;
  return {
    title: post.title || '',
    summary: post.summary || post.content || '',
    interactions: typeof post.interactions === 'number' ? post.interactions : 0,
    platform: post.platform || '',
  };
}

function getPlatformLabel(value: string): string {
  return PLATFORMS.find((p) => p.value === value)?.label || value;
}

function SpreadProgressBar({ value }: { value: number }) {
  const clampedValue = Math.max(0, Math.min(100, value));

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1 text-xs text-neutral-400">
          <Zap className="w-3 h-3" strokeWidth={2} />
          <span>扩散速度</span>
        </div>
        <span className="text-xs font-mono-num font-medium text-neutral-300">
          {clampedValue}%
        </span>
      </div>
      <div className="relative w-full h-2 rounded-sm bg-neutral-700 overflow-hidden">
        <div
          className="h-full rounded-sm transition-all duration-500 ease-out"
          style={{
            width: `${clampedValue}%`,
            background: `linear-gradient(90deg, #10B981 0%, #EAB308 50%, #EF4444 100%)`,
          }}
        />
        <div
          className="absolute top-0 bottom-0 w-px bg-white/30"
          style={{ left: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
}

export default function ClusterCard({
  cluster,
  onClick,
  className,
}: ClusterCardProps) {
  const [hovered, setHovered] = useState(false);
  const urgency = getUrgencyInfo(cluster);
  const urgencyStyle =
    urgencyBlockStyles[urgency.level] || urgencyBlockStyles.normal;

  const title = getClusterTitle(cluster);
  const newCount = getNewCount(cluster);
  const totalCount = getTotalCount(cluster);
  const spreadSpeed = getSpreadSpeed(cluster);
  const streets = getStreets(cluster);
  const repPost = getRepresentativePost(cluster);
  const summary = repPost?.summary || '';

  return (
    <div
      onClick={() => onClick?.(cluster)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        'gov-card cursor-pointer overflow-hidden relative',
        'transition-all duration-200 ease-out',
        hovered && '-translate-y-[2px] shadow-card-hover border-neutral-500',
        className
      )}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-4">
          <h3 className="text-sm font-semibold text-neutral-100 leading-snug line-clamp-1 flex-1 min-w-0">
            {title}
          </h3>
          <span
            className={cn(
              'inline-flex items-center px-2 py-0.5 rounded-sm text-[11px] font-bold text-white flex-shrink-0',
              urgencyStyle.bg
            )}
          >
            {urgencyStyle.label}
          </span>
        </div>

        <div className="flex items-end gap-3 mb-4">
          <div className="relative">
            <span className="text-3xl font-mono-num font-bold text-neutral-100 leading-none">
              +{formatNumber(newCount)}
            </span>
            <span className="absolute -top-1.5 -right-6 inline-flex items-center px-1.5 py-0.5 rounded-sm bg-danger text-white text-[10px] font-bold animate-pulse-soft">
              NEW
            </span>
          </div>
          {totalCount > 0 && (
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-xs text-neutral-500">累计</span>
              <span className="text-sm font-mono-num font-medium text-neutral-400">
                {formatNumber(totalCount)}
              </span>
            </div>
          )}
        </div>

        <div className="mb-4">
          <SpreadProgressBar value={spreadSpeed} />
        </div>

        {streets.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-1 text-xs text-neutral-500 mb-2">
              <MapPin className="w-3 h-3" strokeWidth={2} />
              <span>涉及街道</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {streets.slice(0, 6).map((street, idx) => (
                <span
                  key={idx}
                  className={cn(
                    'inline-flex items-center px-2 py-0.5 rounded-sm text-[11px] font-medium',
                    'bg-neutral-700/50 text-neutral-300 border border-neutral-600/50',
                    'transition-colors duration-150',
                    hovered && 'bg-neutral-700 border-neutral-500/50'
                  )}
                >
                  {street}
                </span>
              ))}
              {streets.length > 6 && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[11px] font-medium bg-neutral-700/30 text-neutral-500 border border-neutral-600/30">
                  +{streets.length - 6}
                </span>
              )}
            </div>
          </div>
        )}

        {repPost && (
          <div className="flex items-start gap-2 p-3 rounded-sm bg-neutral-800/50 border border-neutral-700/50">
            <MessageSquare
              className="w-3.5 h-3.5 text-neutral-500 mt-0.5 flex-shrink-0"
              strokeWidth={2}
            />
            <div className="flex-1 min-w-0 space-y-1.5">
              {repPost.title && (
                <p className="text-xs font-medium text-neutral-200 leading-snug line-clamp-1">
                  {repPost.title}
                </p>
              )}
              <p className="text-xs text-neutral-400 leading-relaxed line-clamp-3">
                {summary}
              </p>
              <div className="flex items-center gap-3 pt-1 text-[11px]">
                {repPost.platform && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-sm bg-primary/15 text-primary-light border border-primary/30 font-medium">
                    {getPlatformLabel(repPost.platform)}
                  </span>
                )}
                {repPost.interactions > 0 && (
                  <span className="inline-flex items-center gap-1 text-neutral-500">
                    <ThumbsUp className="w-3 h-3" strokeWidth={2} />
                    <span className="font-mono-num">{formatNumber(repPost.interactions)}</span>
                  </span>
                )}
                {repPost.interactions > 0 && (
                  <span className="inline-flex items-center gap-1 text-neutral-500">
                    <Eye className="w-3 h-3" strokeWidth={2} />
                    <span className="font-mono-num">{formatNumber(Math.round(repPost.interactions * 5.2))}</span>
                  </span>
                )}
                {repPost.interactions > 100 && (
                  <span className="inline-flex items-center gap-1 text-neutral-500">
                    <Share2 className="w-3 h-3" strokeWidth={2} />
                    <span className="font-mono-num">{formatNumber(Math.round(repPost.interactions * 0.15))}</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
