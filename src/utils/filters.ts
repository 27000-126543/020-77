export interface FilterableItem {
  platform?: string;
  region?: string;
  area?: string;
  district?: string;
  createdAt?: Date | string | number;
  publishedAt?: Date | string | number;
  title?: string;
  content?: string;
  summary?: string;
  excluded?: boolean;
  status?: string;
}

export type TimeRange = 'today' | 'yesterday' | 'last3days' | 'last7days' | 'custom';

export interface TimeRangeFilter {
  range: TimeRange;
  start?: Date | string | number;
  end?: Date | string | number;
}

export function filterByPlatform<T extends FilterableItem>(
  items: T[],
  platforms: string[] | null
): T[] {
  if (!platforms || platforms.length === 0) return items;
  return items.filter((item) => item.platform && platforms.includes(item.platform));
}

export function filterByRegion<T extends FilterableItem>(
  items: T[],
  regions: string[] | null
): T[] {
  if (!regions || regions.length === 0) return items;
  return items.filter((item) => {
    const itemRegion = item.region || item.area || item.district;
    return itemRegion && regions.includes(itemRegion);
  });
}

function getTimeRangeBoundaries(range: TimeRangeFilter): { start: number; end: number } {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const day = 24 * 60 * 60 * 1000;

  switch (range.range) {
    case 'today':
      return { start: today, end: now.getTime() };
    case 'yesterday':
      return { start: today - day, end: today };
    case 'last3days':
      return { start: today - 2 * day, end: now.getTime() };
    case 'last7days':
      return { start: today - 6 * day, end: now.getTime() };
    case 'custom':
      if (range.start && range.end) {
        return {
          start: new Date(range.start).getTime(),
          end: new Date(range.end).getTime() + day - 1,
        };
      }
      return { start: 0, end: Infinity };
    default:
      return { start: 0, end: Infinity };
  }
}

export function filterByTime<T extends FilterableItem>(
  items: T[],
  timeRange: TimeRangeFilter | null
): T[] {
  if (!timeRange || timeRange.range === 'custom') {
    if (!timeRange || !timeRange.start || !timeRange.end) return items;
  }

  const { start, end } = getTimeRangeBoundaries(timeRange);

  return items.filter((item) => {
    const timeField = item.publishedAt || item.createdAt;
    if (!timeField) return false;
    const itemTime = new Date(timeField).getTime();
    return itemTime >= start && itemTime <= end;
  });
}

export function filterByKeyword<T extends FilterableItem>(
  items: T[],
  keyword: string | null
): T[] {
  if (!keyword || keyword.trim() === '') return items;
  const kw = keyword.trim().toLowerCase();
  return items.filter((item) => {
    const haystack = [item.title, item.content, item.summary]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    return haystack.includes(kw);
  });
}

export function filterByExcludedStatus<T extends FilterableItem>(
  items: T[],
  showExcluded: boolean = false
): T[] {
  if (showExcluded) return items;
  return items.filter((item) => !item.excluded);
}

export function filterByStatus<T extends FilterableItem>(
  items: T[],
  statuses: string[] | null
): T[] {
  if (!statuses || statuses.length === 0) return items;
  return items.filter((item) => item.status && statuses.includes(item.status));
}

export interface CombinedFilters {
  platforms?: string[] | null;
  regions?: string[] | null;
  timeRange?: TimeRangeFilter | null;
  keyword?: string | null;
  showExcluded?: boolean;
  statuses?: string[] | null;
}

export function applyFilters<T extends FilterableItem>(
  items: T[],
  filters: CombinedFilters
): T[] {
  let result = items;

  if (filters.platforms !== undefined) {
    result = filterByPlatform(result, filters.platforms);
  }
  if (filters.regions !== undefined) {
    result = filterByRegion(result, filters.regions);
  }
  if (filters.timeRange !== undefined) {
    result = filterByTime(result, filters.timeRange);
  }
  if (filters.keyword !== undefined) {
    result = filterByKeyword(result, filters.keyword);
  }
  if (filters.showExcluded !== undefined) {
    result = filterByExcludedStatus(result, filters.showExcluded);
  }
  if (filters.statuses !== undefined) {
    result = filterByStatus(result, filters.statuses);
  }

  return result;
}
