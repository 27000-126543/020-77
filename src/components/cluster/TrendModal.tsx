import { useState } from 'react';
import { LineChart, PieChart, BarChart3 } from 'lucide-react';
import Modal from '@/components/common/Modal';
import Button from '@/components/common/Button';
import TrendChart from './TrendChart';
import { cn } from '@/lib/utils';
import type { Cluster as StoreCluster } from '@/types';
import type { Cluster as MockCluster } from '@/data/mockClusters';

type Cluster = StoreCluster | MockCluster;
type TabKey = 'line' | 'pie' | 'bar';

interface TrendModalProps {
  open: boolean;
  cluster?: Cluster | null;
  onClose: () => void;
}

const tabs: { key: TabKey; label: string; icon: typeof LineChart }[] = [
  { key: 'line', label: '24h诉求量', icon: LineChart },
  { key: 'pie', label: '平台占比', icon: PieChart },
  { key: 'bar', label: '区域分布', icon: BarChart3 },
];

function getClusterTitle(cluster: Cluster | null | undefined): string {
  if (!cluster) return '聚类趋势分析';
  if ('title' in cluster) return cluster.title;
  return cluster.name;
}

export default function TrendModal({ open, cluster, onClose }: TrendModalProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('line');
  const title = getClusterTitle(cluster);

  return (
    <Modal
      open={open}
      onClose={onClose}
      hideFooter
      className="max-w-[800px] !max-w-[800px]"
      titleClassName="!px-6 !py-4"
    >
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <h3 className="text-base font-semibold text-neutral-100">
            {title}
          </h3>
          <span className="inline-flex items-center px-2 py-0.5 rounded-sm bg-primary/15 text-primary-light text-xs font-medium border border-primary/30">
            趋势分析
          </span>
        </div>

        <div className="flex items-center p-1 rounded-sm bg-background border border-neutral-600">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  'relative flex-1 inline-flex items-center justify-center gap-2',
                  'px-4 py-2.5 text-xs font-medium rounded-sm',
                  'border transition-all duration-150',
                  'focus:outline-none focus:z-10',
                  isActive
                    ? 'z-10 bg-primary-light text-white border-primary-light shadow-glow'
                    : 'border-transparent text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50 focus:ring-1 focus:ring-neutral-500/50'
                )}
              >
                <Icon className="w-4 h-4" strokeWidth={2} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="w-full rounded-sm bg-background/50 border border-neutral-700 p-4">
          <TrendChart type={activeTab} height={340} />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="primary" onClick={onClose}>
            关闭
          </Button>
        </div>
      </div>
    </Modal>
  );
}
