import { create } from 'zustand';
import type { Urgency, Sentiment } from '../utils/formatters';

export interface TrendPoint {
  time: string;
  count: number;
}

export interface RegionDistribution {
  name: string;
  value: number;
}

export interface PlatformDistribution {
  platform: string;
  count: number;
}

export interface RepresentativePost {
  id: string;
  title: string;
  content: string;
  interactions: number;
  platform: string;
  publishedAt: string;
}

export interface Cluster {
  id: string;
  name: string;
  keywords: string[];
  totalCount: number;
  newCount: number;
  growthRate: number;
  spreadSpeed: number;
  urgency: Urgency;
  regions: string[];
  districts: string[];
  platforms: string[];
  primarySentiment: Sentiment;
  sentimentDistribution: {
    positive: number;
    neutral: number;
    negative: number;
  };
  representativePosts: RepresentativePost[];
  trend24h: TrendPoint[];
  regionDistribution: RegionDistribution[];
  platformDistribution: PlatformDistribution[];
  appealIds: string[];
  analyzed: boolean;
  createdAt: string;
  updatedAt: string;
}

function generateTrend24h(baseCount: number, volatility: number = 0.4): TrendPoint[] {
  const points: TrendPoint[] = [];
  const now = new Date();
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    const hour = String(time.getHours()).padStart(2, '0');
    const variation = 1 + (Math.random() - 0.5) * volatility;
    const peakHour = 18 - Math.abs(time.getHours() - 12) * 0.05;
    points.push({
      time: `${hour}:00`,
      count: Math.max(0, Math.round(baseCount * variation * peakHour / 24)),
    });
  }
  return points;
}

const mockClusters: Cluster[] = [
  {
    id: 'c001',
    name: '供暖不达标问题',
    keywords: ['供暖', '温度', '暖气', '供热', '物业'],
    totalCount: 128,
    newCount: 36,
    growthRate: 0.42,
    spreadSpeed: 78,
    urgency: 'critical',
    regions: ['朝阳区', '海淀区', '东城区', '丰台区'],
    districts: ['望京街道', '八里庄街道', '中关村街道'],
    platforms: ['hotline', 'message', 'shortvideo', 'forum'],
    primarySentiment: 'negative',
    sentimentDistribution: { positive: 8, neutral: 25, negative: 95 },
    representativePosts: [
      {
        id: 'a001',
        title: 'XX小区供暖温度不达标问题',
        content: '您好，我是XX街道XX小区3号楼的居民，近一周来家里暖气温度始终在16度左右...',
        interactions: 191,
        platform: 'hotline',
        publishedAt: new Date(Date.now() - 0.5 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'rp002',
        title: '暖气冰凉没人管，投诉无门！',
        content: '从11月15号供暖开始到现在，家里温度就没上过18度，打了无数个电话...',
        interactions: 856,
        platform: 'shortvideo',
        publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      },
    ],
    trend24h: generateTrend24h(128, 0.5),
    regionDistribution: [
      { name: '朝阳区', value: 45 },
      { name: '海淀区', value: 32 },
      { name: '东城区', value: 28 },
      { name: '丰台区', value: 23 },
    ],
    platformDistribution: [
      { platform: 'hotline', count: 56 },
      { platform: 'message', count: 38 },
      { platform: 'forum', count: 22 },
      { platform: 'shortvideo', count: 12 },
    ],
    appealIds: ['a001'],
    analyzed: false,
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 0.3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'c002',
    name: '路面积水排水不畅',
    keywords: ['积水', '排水', '路面', '市政', '下雨'],
    totalCount: 67,
    newCount: 18,
    growthRate: 0.18,
    spreadSpeed: 45,
    urgency: 'urgent',
    regions: ['海淀区', '朝阳区', '石景山区'],
    districts: ['中关村街道', '望京街道', '八角街道'],
    platforms: ['message', 'forum', 'video'],
    primarySentiment: 'negative',
    sentimentDistribution: { positive: 2, neutral: 12, negative: 53 },
    representativePosts: [
      {
        id: 'a002',
        title: '关于XX路积水问题的反映',
        content: 'XX路与XX路交叉口每逢下雨就严重积水，最深处可达50公分...',
        interactions: 385,
        platform: 'message',
        publishedAt: new Date(Date.now() - 1.2 * 60 * 60 * 1000).toISOString(),
      },
    ],
    trend24h: generateTrend24h(67, 0.6),
    regionDistribution: [
      { name: '海淀区', value: 28 },
      { name: '朝阳区', value: 22 },
      { name: '石景山区', value: 17 },
    ],
    platformDistribution: [
      { platform: 'message', count: 31 },
      { platform: 'forum', count: 24 },
      { platform: 'shortvideo', count: 12 },
    ],
    appealIds: ['a002'],
    analyzed: true,
    createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'c003',
    name: '广场舞噪音扰民',
    keywords: ['广场舞', '噪音', '扰民', '公园', '喇叭'],
    totalCount: 234,
    newCount: 58,
    growthRate: 0.33,
    spreadSpeed: 62,
    urgency: 'urgent',
    regions: ['东城区', '西城区', '朝阳区'],
    districts: ['和平里街道', '德胜街道', '三里屯街道'],
    platforms: ['video', 'forum', 'message', 'hotline'],
    primarySentiment: 'negative',
    sentimentDistribution: { positive: 12, neutral: 34, negative: 188 },
    representativePosts: [
      {
        id: 'a003',
        title: '实拍！XX公园广场舞噪音扰民',
        content: '每天早上6点不到，XX公园就开始放高音喇叭跳广场舞...',
        interactions: 2768,
        platform: 'shortvideo',
        publishedAt: new Date(Date.now() - 2.5 * 60 * 60 * 1000).toISOString(),
      },
    ],
    trend24h: generateTrend24h(234, 0.45),
    regionDistribution: [
      { name: '东城区', value: 89 },
      { name: '西城区', value: 76 },
      { name: '朝阳区', value: 69 },
    ],
    platformDistribution: [
      { platform: 'shortvideo', count: 102 },
      { platform: 'forum', count: 68 },
      { platform: 'message', count: 38 },
      { platform: 'hotline', count: 26 },
    ],
    appealIds: ['a003'],
    analyzed: false,
    createdAt: new Date(Date.now() - 120 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'c004',
    name: '学区划片争议',
    keywords: ['划片', '学区', '小学', '入学', '教育'],
    totalCount: 89,
    newCount: 24,
    growthRate: 0.55,
    spreadSpeed: 71,
    urgency: 'urgent',
    regions: ['西城区', '海淀区', '东城区'],
    districts: ['德胜街道', '学院路街道', '和平里街道'],
    platforms: ['forum', 'message', 'hotline'],
    primarySentiment: 'neutral',
    sentimentDistribution: { positive: 15, neutral: 48, negative: 26 },
    representativePosts: [
      {
        id: 'a004',
        title: 'XX小学划片区不合理',
        content: '各位领导好，我家住在XX小区，按往年划片应该上XX小学...',
        interactions: 316,
        platform: 'forum',
        publishedAt: new Date(Date.now() - 3.8 * 60 * 60 * 1000).toISOString(),
      },
    ],
    trend24h: generateTrend24h(89, 0.55),
    regionDistribution: [
      { name: '西城区', value: 36 },
      { name: '海淀区', value: 31 },
      { name: '东城区', value: 22 },
    ],
    platformDistribution: [
      { platform: 'forum', count: 45 },
      { platform: 'message', count: 28 },
      { platform: 'hotline', count: 16 },
    ],
    appealIds: ['a004'],
    analyzed: false,
    createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'c005',
    name: '地铁站外黑车运营',
    keywords: ['黑车', '地铁', '运营', '拉客', '交通'],
    totalCount: 156,
    newCount: 42,
    growthRate: 0.27,
    spreadSpeed: 55,
    urgency: 'normal',
    regions: ['丰台区', '朝阳区', '昌平区'],
    districts: ['丽泽街道', '三里屯街道', '回龙观街道'],
    platforms: ['video', 'forum', 'message'],
    primarySentiment: 'negative',
    sentimentDistribution: { positive: 5, neutral: 22, negative: 129 },
    representativePosts: [
      {
        id: 'a006',
        title: 'XX地铁站外黑车猖獗运营',
        content: 'XX地铁站B出口每天都有十几辆黑车在拉客，漫天要价...',
        interactions: 2436,
        platform: 'shortvideo',
        publishedAt: new Date(Date.now() - 5.2 * 60 * 60 * 1000).toISOString(),
      },
    ],
    trend24h: generateTrend24h(156, 0.5),
    regionDistribution: [
      { name: '丰台区', value: 62 },
      { name: '朝阳区', value: 51 },
      { name: '昌平区', value: 43 },
    ],
    platformDistribution: [
      { platform: 'shortvideo', count: 78 },
      { platform: 'forum', count: 48 },
      { platform: 'message', count: 30 },
    ],
    appealIds: ['a006'],
    analyzed: true,
    createdAt: new Date(Date.now() - 96 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'c006',
    name: '小区违建问题',
    keywords: ['违建', '搭建', '小区', '安全', '物业'],
    totalCount: 78,
    newCount: 12,
    growthRate: 0.08,
    spreadSpeed: 28,
    urgency: 'normal',
    regions: ['昌平区', '朝阳区', '海淀区'],
    districts: ['回龙观街道', '天通苑', '上地街道'],
    platforms: ['message', 'forum', 'hotline'],
    primarySentiment: 'negative',
    sentimentDistribution: { positive: 3, neutral: 15, negative: 60 },
    representativePosts: [
      {
        id: 'a010',
        title: 'XX小区违规搭建严重',
        content: 'XX小区顶层违建现象严重，几乎家家户户都在楼顶搭了阳光房...',
        interactions: 1055,
        platform: 'message',
        publishedAt: new Date(Date.now() - 9.1 * 60 * 60 * 1000).toISOString(),
      },
    ],
    trend24h: generateTrend24h(78, 0.35),
    regionDistribution: [
      { name: '昌平区', value: 32 },
      { name: '朝阳区', value: 26 },
      { name: '海淀区', value: 20 },
    ],
    platformDistribution: [
      { platform: 'message', count: 38 },
      { platform: 'forum', count: 25 },
      { platform: 'hotline', count: 15 },
    ],
    appealIds: ['a010'],
    analyzed: false,
    createdAt: new Date(Date.now() - 168 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'c007',
    name: '市政设施损坏',
    keywords: ['路灯', '井盖', '损坏', '市政', '维修'],
    totalCount: 45,
    newCount: 8,
    growthRate: 0.05,
    spreadSpeed: 18,
    urgency: 'attention',
    regions: ['丰台区', '东城区', '西城区'],
    districts: ['右安门街道', '交道口街道', '月坛街道'],
    platforms: ['hotline', 'message'],
    primarySentiment: 'negative',
    sentimentDistribution: { positive: 2, neutral: 10, negative: 33 },
    representativePosts: [
      {
        id: 'a012',
        title: 'XX路路灯坏了一个多月没人修',
        content: 'XX路从XX路口到XX巷这段的路灯坏了快两个月了...',
        interactions: 502,
        platform: 'hotline',
        publishedAt: new Date(Date.now() - 11.8 * 60 * 60 * 1000).toISOString(),
      },
    ],
    trend24h: generateTrend24h(45, 0.3),
    regionDistribution: [
      { name: '丰台区', value: 19 },
      { name: '东城区', value: 14 },
      { name: '西城区', value: 12 },
    ],
    platformDistribution: [
      { platform: 'hotline', count: 26 },
      { platform: 'message', count: 19 },
    ],
    appealIds: ['a012'],
    analyzed: true,
    createdAt: new Date(Date.now() - 240 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 11 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'c008',
    name: '医院挂号难问题',
    keywords: ['挂号', '医院', '看病', '黄牛', '号源'],
    totalCount: 312,
    newCount: 89,
    growthRate: 0.38,
    spreadSpeed: 68,
    urgency: 'critical',
    regions: ['西城区', '东城区', '海淀区'],
    districts: ['月坛街道', '和平里街道', '中关村街道'],
    platforms: ['forum', 'video', 'message', 'hotline'],
    primarySentiment: 'negative',
    sentimentDistribution: { positive: 18, neutral: 56, negative: 238 },
    representativePosts: [
      {
        id: 'a013',
        title: 'XX医院排队挂号太难了',
        content: '去XX医院看个病，早上5点去排队都挂不上专家号...',
        interactions: 3102,
        platform: 'forum',
        publishedAt: new Date(Date.now() - 12.5 * 60 * 60 * 1000).toISOString(),
      },
    ],
    trend24h: generateTrend24h(312, 0.5),
    regionDistribution: [
      { name: '西城区', value: 125 },
      { name: '东城区', value: 98 },
      { name: '海淀区', value: 89 },
    ],
    platformDistribution: [
      { platform: 'forum', count: 135 },
      { platform: 'shortvideo', count: 82 },
      { platform: 'message', count: 56 },
      { platform: 'hotline', count: 39 },
    ],
    appealIds: ['a013'],
    analyzed: false,
    createdAt: new Date(Date.now() - 60 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
];

interface OverviewStats {
  totalAppeals: number;
  processedAppeals: number;
  risingTopics: number;
  pendingAnalysis: number;
  totalTrend: number;
  processedTrend: number;
  risingTrend: number;
  pendingTrend: number;
}

interface ClusterState {
  clusters: Cluster[];
  selectedClusterId: string | null;
  isTrendModalOpen: boolean;
  overviewStats: OverviewStats;
  sortBy: 'urgency' | 'newCount' | 'growthRate' | 'spreadSpeed';
  sortOrder: 'asc' | 'desc';
  filterUrgency: Urgency[];
  searchKeyword: string;
}

interface ClusterActions {
  getClusterById: (id: string) => Cluster | undefined;
  selectCluster: (id: string | null) => void;
  openTrendModal: (clusterId: string) => void;
  closeTrendModal: () => void;
  setSortBy: (sortBy: ClusterState['sortBy']) => void;
  toggleSortOrder: () => void;
  toggleUrgencyFilter: (urgency: Urgency) => void;
  setSearchKeyword: (keyword: string) => void;
  markAsAnalyzed: (clusterId: string) => void;
  getSortedClusters: () => Cluster[];
}

const urgencyLevel: Record<Urgency, number> = {
  critical: 4,
  urgent: 3,
  normal: 2,
  attention: 1,
};

export const useClusterStore = create<ClusterState & ClusterActions>((set, get) => ({
  clusters: mockClusters,
  selectedClusterId: null,
  isTrendModalOpen: false,
  overviewStats: {
    totalAppeals: 1248,
    processedAppeals: 856,
    risingTopics: 12,
    pendingAnalysis: 8,
    totalTrend: 0.12,
    processedTrend: 0.08,
    risingTrend: 0.33,
    pendingTrend: -0.15,
  },
  sortBy: 'urgency',
  sortOrder: 'desc',
  filterUrgency: [],
  searchKeyword: '',

  getClusterById: (id) => get().clusters.find((c) => c.id === id),

  selectCluster: (id) => set({ selectedClusterId: id }),

  openTrendModal: (clusterId) =>
    set({ selectedClusterId: clusterId, isTrendModalOpen: true }),

  closeTrendModal: () => set({ isTrendModalOpen: false }),

  setSortBy: (sortBy) => set({ sortBy }),

  toggleSortOrder: () =>
    set((state) => ({ sortOrder: state.sortOrder === 'asc' ? 'desc' : 'asc' })),

  toggleUrgencyFilter: (urgency) =>
    set((state) => ({
      filterUrgency: state.filterUrgency.includes(urgency)
        ? state.filterUrgency.filter((u) => u !== urgency)
        : [...state.filterUrgency, urgency],
    })),

  setSearchKeyword: (keyword) => set({ searchKeyword: keyword }),

  markAsAnalyzed: (clusterId) =>
    set((state) => ({
      clusters: state.clusters.map((c) =>
        c.id === clusterId ? { ...c, analyzed: true, updatedAt: new Date().toISOString() } : c
      ),
    })),

  getSortedClusters: () => {
    const { clusters, sortBy, sortOrder, filterUrgency, searchKeyword } = get();
    let result = [...clusters];

    if (filterUrgency.length > 0) {
      result = result.filter((c) => filterUrgency.includes(c.urgency));
    }

    if (searchKeyword.trim()) {
      const kw = searchKeyword.trim().toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(kw) ||
          c.keywords.some((k) => k.toLowerCase().includes(kw))
      );
    }

    result.sort((a, b) => {
      let diff = 0;
      switch (sortBy) {
        case 'urgency':
          diff = urgencyLevel[a.urgency] - urgencyLevel[b.urgency];
          break;
        case 'newCount':
          diff = a.newCount - b.newCount;
          break;
        case 'growthRate':
          diff = a.growthRate - b.growthRate;
          break;
        case 'spreadSpeed':
          diff = a.spreadSpeed - b.spreadSpeed;
          break;
      }
      return sortOrder === 'asc' ? diff : -diff;
    });

    return result;
  },
}));
