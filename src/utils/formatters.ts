export type Sentiment = 'positive' | 'neutral' | 'negative';

export type Urgency = 'critical' | 'urgent' | 'normal' | 'attention';

export function formatTime(date: Date | string | number, pattern: string = 'YYYY-MM-DD HH:mm'): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');

  return pattern
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
}

export function formatRelativeTime(date: Date | string | number): string {
  const d = new Date(date).getTime();
  const now = Date.now();
  const diff = now - d;

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < minute) {
    return '刚刚';
  }
  if (diff < hour) {
    return `${Math.floor(diff / minute)}分钟前`;
  }
  if (diff < day) {
    return `${Math.floor(diff / hour)}小时前`;
  }
  if (diff < 7 * day) {
    return `${Math.floor(diff / day)}天前`;
  }
  return formatTime(date, 'YYYY-MM-DD');
}

export function formatNumber(num: number): string {
  if (num === undefined || num === null || isNaN(num)) return '0';
  if (num >= 100000000) {
    return (num / 100000000).toFixed(1).replace(/\.0$/, '') + '亿';
  }
  if (num >= 10000) {
    return (num / 10000).toFixed(1).replace(/\.0$/, '') + '万';
  }
  return num.toLocaleString('zh-CN');
}

export function formatCompactNumber(num: number): string {
  if (num === undefined || num === null || isNaN(num)) return '0';
  if (num >= 100000000) {
    return (num / 100000000).toFixed(2) + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return String(num);
}

export function formatPercent(value: number, decimals: number = 1): string {
  if (isNaN(value)) return '0%';
  return `${(value * 100).toFixed(decimals)}%`;
}

export const sentimentColors: Record<Sentiment, { bg: string; text: string; border: string; dot: string; label: string }> = {
  positive: {
    bg: 'bg-emerald-500/15',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
    dot: 'bg-emerald-500',
    label: '正面',
  },
  neutral: {
    bg: 'bg-slate-500/15',
    text: 'text-slate-400',
    border: 'border-slate-500/30',
    dot: 'bg-slate-400',
    label: '中性',
  },
  negative: {
    bg: 'bg-red-500/15',
    text: 'text-red-400',
    border: 'border-red-500/30',
    dot: 'bg-red-500',
    label: '负面',
  },
};

export function getSentimentColor(sentiment: Sentiment) {
  return sentimentColors[sentiment] || sentimentColors.neutral;
}

export const urgencyColors: Record<Urgency, { bg: string; text: string; border: string; bar: string; label: string; level: number }> = {
  critical: {
    bg: 'bg-red-500/15',
    text: 'text-red-400',
    border: 'border-red-500/40',
    bar: 'bg-red-500',
    label: '特急',
    level: 4,
  },
  urgent: {
    bg: 'bg-orange-500/15',
    text: 'text-orange-400',
    border: 'border-orange-500/40',
    bar: 'bg-orange-500',
    label: '紧急',
    level: 3,
  },
  normal: {
    bg: 'bg-amber-500/15',
    text: 'text-amber-400',
    border: 'border-amber-500/40',
    bar: 'bg-amber-500',
    label: '一般',
    level: 2,
  },
  attention: {
    bg: 'bg-blue-500/15',
    text: 'text-blue-400',
    border: 'border-blue-500/40',
    bar: 'bg-blue-500',
    label: '关注',
    level: 1,
  },
};

export function getUrgencyColor(urgency: Urgency) {
  return urgencyColors[urgency] || urgencyColors.normal;
}

export const platformColors: Record<string, { bg: string; text: string; label: string }> = {
  hotline: { bg: 'bg-violet-500/15', text: 'text-violet-400', label: '12345热线' },
  message: { bg: 'bg-cyan-500/15', text: 'text-cyan-400', label: '政务留言板' },
  video: { bg: 'bg-pink-500/15', text: 'text-pink-400', label: '短视频评论' },
  forum: { bg: 'bg-indigo-500/15', text: 'text-indigo-400', label: '本地论坛' },
};

export function getPlatformColor(platform: string) {
  return platformColors[platform] || { bg: 'bg-slate-500/15', text: 'text-slate-400', label: platform };
}
