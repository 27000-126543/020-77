import { useMemo } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import StatCard from '@/components/cluster/StatCard';
import ClusterCard from '@/components/cluster/ClusterCard';
import TrendModal from '@/components/cluster/TrendModal';
import { useClusterStore } from '@/store/useClusterStore';

export default function ClusterPage() {
  const {
    overviewStats,
    getSortedClusters,
    getClusterById,
    isTrendModalOpen,
    selectedClusterId,
    openTrendModal,
    closeTrendModal,
  } = useClusterStore();

  const sortedClusters = useMemo(() => getSortedClusters(), [getSortedClusters]);

  const selectedCluster = selectedClusterId
    ? (getClusterById(selectedClusterId) as unknown as (import('@/types').Cluster | import('@/data/mockClusters').Cluster | null)) ?? null
    : null;

  const handleCardClick = (cluster: unknown) => {
    const c = cluster as { id?: string };
    if (c?.id) {
      openTrendModal(c.id);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Topbar />
        <main className="flex-1 overflow-y-auto scrollbar-thin bg-background">
          <div className="p-5 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                type="total"
                value={overviewStats.totalAppeals}
                trend={Math.round(overviewStats.totalTrend * 100)}
              />
              <StatCard
                type="handled"
                value={overviewStats.processedAppeals}
                trend={Math.round(overviewStats.processedTrend * 100)}
              />
              <StatCard
                type="rising"
                value={overviewStats.risingTopics}
                trend={Math.round(overviewStats.risingTrend * 100)}
              />
              <StatCard
                type="pending"
                value={overviewStats.pendingAnalysis}
                trend={Math.round(overviewStats.pendingTrend * 100)}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-neutral-100">
                  主题聚类矩阵
                </h2>
                <span className="text-xs text-neutral-500">
                  共 {sortedClusters.length} 个聚类
                </span>
              </div>

              {sortedClusters.length === 0 ? (
                <div className="flex h-64 items-center justify-center text-neutral-500 text-sm">
                  暂无聚类数据
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {sortedClusters.map((cluster) => (
                    <ClusterCard
                      key={cluster.id}
                      cluster={
                        cluster as unknown as (import('@/types').Cluster | import('@/data/mockClusters').Cluster)
                      }
                      onClick={handleCardClick}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <TrendModal
        open={isTrendModalOpen}
        cluster={selectedCluster}
        onClose={closeTrendModal}
      />
    </div>
  );
}
