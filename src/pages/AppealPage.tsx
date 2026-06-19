import { useMemo, useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import FilterBar from '@/components/appeal/FilterBar';
import AppealCard from '@/components/appeal/AppealCard';
import DetailPanel from '@/components/appeal/DetailPanel';
import { useAppealStore, type Appeal as StoreAppeal } from '@/store/useAppealStore';

export default function AppealPage() {
  const {
    appeals,
    searchKeyword,
    selectedPlatforms,
    selectedRegions,
    timeRange,
    showExcluded,
    selectedAppealId,
  } = useAppealStore();

  const [selectedCardIds, setSelectedCardIds] = useState<string[]>([]);

  const filteredAppeals = useMemo(() => {
    return appeals.filter((appeal) => {
      if (!showExcluded && appeal.excluded) return false;

      if (selectedPlatforms.length > 0 && !selectedPlatforms.includes(appeal.platform)) {
        return false;
      }

      if (selectedRegions.length > 0) {
        const inRegion = selectedRegions.some(
          (r) => appeal.region.includes(r) || appeal.district.includes(r)
        );
        if (!inRegion) return false;
      }

      if (searchKeyword.trim()) {
        const kw = searchKeyword.trim().toLowerCase();
        if (
          !appeal.title.toLowerCase().includes(kw) &&
          !appeal.content.toLowerCase().includes(kw) &&
          !appeal.summary.toLowerCase().includes(kw)
        ) {
          return false;
        }
      }

      if (timeRange !== 'last7days' && timeRange !== 'custom') {
        const now = Date.now();
        const published = new Date(appeal.publishedAt).getTime();
        const hoursDiff = (now - published) / (1000 * 60 * 60);

        if (timeRange === 'today' && hoursDiff > 24) return false;
        if (timeRange === 'yesterday' && (hoursDiff < 24 || hoursDiff > 48)) return false;
        if (timeRange === 'last3days' && hoursDiff > 72) return false;
      }

      return true;
    });
  }, [appeals, selectedPlatforms, selectedRegions, searchKeyword, timeRange, showExcluded]);

  const handleCardSelect = (id: string, checked: boolean) => {
    setSelectedCardIds((prev) =>
      checked ? [...prev, id] : prev.filter((i) => i !== id)
    );
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Topbar />
        <FilterBar />
        <main className="flex-1 overflow-y-auto scrollbar-thin bg-background">
          <div className="p-5">
            {filteredAppeals.length === 0 ? (
              <div className="flex h-64 items-center justify-center text-neutral-500 text-sm">
                暂无匹配的诉求数据
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredAppeals.map((appeal: StoreAppeal) => (
                  <AppealCard
                    key={appeal.id}
                    appeal={appeal}
                    isSelected={selectedCardIds.includes(appeal.id)}
                    onSelect={handleCardSelect}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
      {selectedAppealId && <DetailPanel />}
    </div>
  );
}
