import { useState, useRef, useEffect } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Search,
  X,
  MapPin,
  Phone,
  MessageSquare,
  PlayCircle,
  Users,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppealStore } from '@/store/useAppealStore';
import { DISTRICTS, PLATFORMS } from '@/data/dictionaries';

const TIME_RANGES = [
  { value: 'today', label: '今日' },
  { value: 'yesterday', label: '昨日' },
  { value: 'last3days', label: '近3天' },
  { value: 'last7days', label: '近7天' },
  { value: 'custom', label: '自定义' },
] as const;

const PLATFORM_ICONS: Record<string, typeof Phone> = {
  hotline: Phone,
  message: MessageSquare,
  shortvideo: PlayCircle,
  forum: Users,
};

export default function FilterBar() {
  const {
    timeRange,
    setTimeRange,
    selectedPlatforms,
    togglePlatform,
    setSelectedPlatforms,
    selectedRegions,
    toggleRegion,
    setSelectedRegions,
    searchKeyword,
    setSearchKeyword,
    clearFilters,
  } = useAppealStore();

  const [timeDropdownOpen, setTimeDropdownOpen] = useState(false);
  const [regionPanelOpen, setRegionPanelOpen] = useState(false);
  const [expandedDistricts, setExpandedDistricts] = useState<string[]>([]);

  const timeDropdownRef = useRef<HTMLDivElement>(null);
  const regionPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (timeDropdownRef.current && !timeDropdownRef.current.contains(e.target as Node)) {
        setTimeDropdownOpen(false);
      }
      if (regionPanelRef.current && !regionPanelRef.current.contains(e.target as Node)) {
        setRegionPanelOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDistrictExpand = (districtValue: string) => {
    setExpandedDistricts((prev) =>
      prev.includes(districtValue)
        ? prev.filter((d) => d !== districtValue)
        : [...prev, districtValue]
    );
  };

  const getSelectedRegionLabels = () => {
    const labels: string[] = [];
    DISTRICTS.forEach((district) => {
      if (selectedRegions.includes(district.value)) {
        labels.push(district.label);
      }
      district.streets.forEach((street) => {
        if (selectedRegions.includes(street.value)) {
          labels.push(`${district.label}·${street.label}`);
        }
      });
    });
    return labels;
  };

  const getSelectedPlatformLabels = () => {
    return selectedPlatforms
      .map((p) => PLATFORMS.find((pl) => pl.value === p)?.label)
      .filter(Boolean) as string[];
  };

  const getTimeRangeLabel = () => {
    return TIME_RANGES.find((t) => t.value === timeRange)?.label || '';
  };

  const removeTag = (type: string, value: string) => {
    switch (type) {
      case 'platform':
        togglePlatform(value);
        break;
      case 'region':
        toggleRegion(value);
        break;
      case 'keyword':
        setSearchKeyword('');
        break;
    }
  };

  const hasActiveFilters =
    timeRange !== 'today' ||
    selectedPlatforms.length > 0 ||
    selectedRegions.length > 0 ||
    searchKeyword.trim() !== '';

  const selectedTags = [
    ...(timeRange !== 'today'
      ? [{ type: 'timeRange', value: timeRange, label: `时间：${getTimeRangeLabel()}` }]
      : []),
    ...selectedPlatforms.map((p) => ({
      type: 'platform',
      value: p,
      label: `平台：${PLATFORMS.find((pl) => pl.value === p)?.label}`,
    })),
    ...selectedRegions.map((r) => {
      const labels = getSelectedRegionLabels();
      const district = DISTRICTS.find((d) => d.value === r);
      if (district) {
        return { type: 'region', value: r, label: `区域：${district.label}` };
      }
      for (const d of DISTRICTS) {
        const street = d.streets.find((s) => s.value === r);
        if (street) {
          return { type: 'region', value: r, label: `区域：${d.label}·${street.label}` };
        }
      }
      return { type: 'region', value: r, label: `区域：${r}` };
    }),
    ...(searchKeyword.trim()
      ? [{ type: 'keyword', value: searchKeyword, label: `关键词：${searchKeyword}` }]
      : []),
  ];

  return (
    <div className="bg-primary-dark/60 border-b border-primary/30 backdrop-blur-sm">
      <div className="px-5 py-3">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative" ref={timeDropdownRef}>
            <button
              onClick={() => setTimeDropdownOpen(!timeDropdownOpen)}
              className={cn(
                'flex items-center gap-2 px-3.5 py-2 rounded-sm text-sm transition-all',
                timeRange !== 'today'
                  ? 'bg-primary-light/20 text-primary-light border border-primary-light/40'
                  : 'bg-background/40 text-neutral-300 border border-neutral-600 hover:border-neutral-500'
              )}
            >
              <Clock className="w-4 h-4" />
              <span>{getTimeRangeLabel()}</span>
              {timeDropdownOpen ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
            {timeDropdownOpen && (
              <div className="absolute top-full left-0 mt-1.5 z-50 w-32 bg-background-light border border-neutral-600 rounded-sm shadow-card overflow-hidden">
                {TIME_RANGES.map((range) => (
                  <button
                    key={range.value}
                    onClick={() => {
                      setTimeRange(range.value);
                      setTimeDropdownOpen(false);
                    }}
                    className={cn(
                      'w-full px-3.5 py-2 text-left text-sm transition-colors',
                      timeRange === range.value
                        ? 'bg-primary/20 text-primary-light'
                        : 'text-neutral-300 hover:bg-neutral-700/50'
                    )}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative" ref={regionPanelRef}>
            <button
              onClick={() => setRegionPanelOpen(!regionPanelOpen)}
              className={cn(
                'flex items-center gap-2 px-3.5 py-2 rounded-sm text-sm transition-all',
                selectedRegions.length > 0
                  ? 'bg-primary-light/20 text-primary-light border border-primary-light/40'
                  : 'bg-background/40 text-neutral-300 border border-neutral-600 hover:border-neutral-500'
              )}
            >
              <MapPin className="w-4 h-4" />
              <span>
                区域
                {selectedRegions.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary-light/30 rounded">
                    {selectedRegions.length}
                  </span>
                )}
              </span>
              {regionPanelOpen ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
            {regionPanelOpen && (
              <div className="absolute top-full left-0 mt-1.5 z-50 w-80 max-h-96 bg-background-light border border-neutral-600 rounded-sm shadow-card overflow-y-auto">
                <div className="p-2 border-b border-neutral-700 flex items-center justify-between">
                  <span className="text-xs text-neutral-400">选择区域/街道</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const allDistricts = DISTRICTS.map((d) => d.value);
                        const allStreets = DISTRICTS.flatMap((d) =>
                          d.streets.map((s) => s.value)
                        );
                        const all = [...allDistricts, ...allStreets];
                        const hasAll = all.every((r) => selectedRegions.includes(r));
                        setSelectedRegions(hasAll ? [] : all);
                      }}
                      className="text-xs text-primary-light hover:text-primary transition-colors"
                    >
                      {DISTRICTS.every(
                        (d) =>
                          selectedRegions.includes(d.value) &&
                          d.streets.every((s) => selectedRegions.includes(s.value))
                      )
                        ? '清空'
                        : '全选'}
                    </button>
                  </div>
                </div>
                {DISTRICTS.map((district) => {
                  const districtSelected = selectedRegions.includes(district.value);
                  const allStreetsSelected = district.streets.every((s) =>
                    selectedRegions.includes(s.value)
                  );
                  const someStreetsSelected = district.streets.some((s) =>
                    selectedRegions.includes(s.value)
                  );
                  const isExpanded = expandedDistricts.includes(district.value);

                  return (
                    <div key={district.value} className="border-b border-neutral-700/50 last:border-b-0">
                      <div
                        className={cn(
                          'flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors',
                          districtSelected ? 'bg-primary/10' : 'hover:bg-neutral-700/30'
                        )}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleRegion(district.value);
                          }}
                          className={cn(
                            'w-4 h-4 rounded border flex items-center justify-center transition-colors flex-shrink-0',
                            districtSelected || allStreetsSelected
                              ? 'bg-primary-light border-primary-light'
                              : 'border-neutral-500 hover:border-neutral-400'
                          )}
                        >
                          {(districtSelected || allStreetsSelected) && (
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="white"
                              strokeWidth="3"
                              className="w-2.5 h-2.5"
                            >
                              {someStreetsSelected && !allStreetsSelected ? (
                                <line x1="5" y1="12" x2="19" y2="12" />
                              ) : (
                                <polyline points="20 6 9 17 4 12" />
                              )}
                            </svg>
                          )}
                        </button>
                        <span
                          className="flex-1 text-sm text-neutral-200"
                          onClick={() => toggleDistrictExpand(district.value)}
                        >
                          {district.label}
                        </span>
                        <button
                          onClick={() => toggleDistrictExpand(district.value)}
                          className="text-neutral-400 hover:text-neutral-200 transition-colors"
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      {isExpanded && (
                        <div className="pl-9 pb-2 pr-3 space-y-1">
                          {district.streets.map((street) => {
                            const streetSelected = selectedRegions.includes(street.value);
                            return (
                              <div
                                key={street.value}
                                className={cn(
                                  'flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer transition-colors',
                                  streetSelected
                                    ? 'bg-primary/10'
                                    : 'hover:bg-neutral-700/30'
                                )}
                                onClick={() => toggleRegion(street.value)}
                              >
                                <button
                                  className={cn(
                                    'w-3.5 h-3.5 rounded border flex items-center justify-center transition-colors flex-shrink-0',
                                    streetSelected
                                      ? 'bg-primary-light border-primary-light'
                                      : 'border-neutral-500 hover:border-neutral-400'
                                  )}
                                >
                                  {streetSelected && (
                                    <svg
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="white"
                                      strokeWidth="3"
                                      className="w-2 h-2"
                                    >
                                      <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                  )}
                                </button>
                                <span className="text-sm text-neutral-300">{street.label}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5 bg-background/40 border border-neutral-600 rounded-sm p-1">
            {PLATFORMS.map((platform) => {
              const Icon = PLATFORM_ICONS[platform.value as keyof typeof PLATFORM_ICONS];
              const isSelected = selectedPlatforms.includes(platform.value);
              return (
                <button
                  key={platform.value}
                  onClick={() => togglePlatform(platform.value)}
                  className={cn(
                    'flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm text-xs transition-all',
                    isSelected
                      ? 'text-white shadow-sm'
                      : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-700/50'
                  )}
                  style={isSelected ? { backgroundColor: platform.color } : undefined}
                  title={platform.label}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{platform.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex-1 min-w-[200px] max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="text"
                placeholder="搜索关键词..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full pl-9 pr-9 py-2 bg-background/40 border border-neutral-600 rounded-sm text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-primary-light focus:ring-1 focus:ring-primary-light transition-colors"
              />
              {searchKeyword && (
                <button
                  onClick={() => setSearchKeyword('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-neutral-500 hover:text-neutral-300 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs text-neutral-400 hover:text-neutral-200 transition-colors px-2 py-1"
            >
              清除全部
            </button>
          )}
        </div>
      </div>

      {selectedTags.length > 0 && (
        <div className="px-5 pb-3 flex items-center gap-2 flex-wrap border-t border-primary/20 pt-2">
          <span className="text-xs text-neutral-500">已选：</span>
          {selectedTags.map((tag, index) => (
            <span
              key={`${tag.type}-${tag.value}-${index}`}
              className="inline-flex items-center gap-1 px-2 py-1 bg-primary/15 border border-primary/30 rounded-sm text-xs text-primary-light"
            >
              {tag.label}
              <button
                onClick={() => {
                  if (tag.type === 'timeRange') {
                    setTimeRange('today');
                  } else {
                    removeTag(tag.type, tag.value);
                  }
                }}
                className="ml-1 p-0.5 hover:bg-primary/30 rounded transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
