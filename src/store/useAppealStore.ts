import { create } from 'zustand';
import type { Sentiment } from '../utils/formatters';

export interface Appeal {
  id: string;
  platform: 'hotline' | 'message' | 'shortvideo' | 'forum';
  title: string;
  content: string;
  summary: string;
  region: string;
  district: string;
  sentiment: Sentiment;
  publishedAt: string;
  interactions: {
    comments: number;
    likes: number;
    shares: number;
    total: number;
  };
  author: {
    name: string;
    anonymized: boolean;
  };
  excluded: boolean;
  followed: boolean;
  clusterId?: string;
  status: 'pending' | 'processing' | 'resolved';
  tags: string[];
}

function hoursAgo(hours: number): string {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
}

const mockAppeals: Appeal[] = [
  {
    id: 'a001',
    platform: 'hotline',
    title: 'XX小区供暖温度不达标问题',
    content: '您好，我是XX街道XX小区3号楼的居民，近一周来家里暖气温度始终在16度左右，晚上睡觉需要盖两床被子。多次联系物业和供热公司，对方一直推诿说是管道问题正在排查，但迟迟没有解决。老人孩子都感冒了，请相关部门尽快处理！',
    summary: 'XX小区供暖温度不达标，多次联系物业和供热公司未果，老人孩子已感冒。',
    region: '朝阳区',
    district: '望京街道',
    sentiment: 'negative',
    publishedAt: hoursAgo(0.5),
    interactions: { comments: 23, likes: 156, shares: 12, total: 191 },
    author: { name: '王**', anonymized: true },
    excluded: false,
    followed: false,
    clusterId: 'c001',
    status: 'pending',
    tags: ['供暖', '民生'],
  },
  {
    id: 'a002',
    platform: 'message',
    title: '关于XX路积水问题的反映',
    content: 'XX路与XX路交叉口每逢下雨就严重积水，最深处可达50公分，车辆无法通行，行人只能涉水而过，存在严重安全隐患。建议市政部门尽快排查排水系统，对该路段进行改造。',
    summary: 'XX路交叉口雨天积水严重，建议市政部门排查排水系统并改造。',
    region: '海淀区',
    district: '中关村街道',
    sentiment: 'negative',
    publishedAt: hoursAgo(1.2),
    interactions: { comments: 45, likes: 312, shares: 28, total: 385 },
    author: { name: '李**', anonymized: true },
    excluded: false,
    followed: true,
    clusterId: 'c002',
    status: 'processing',
    tags: ['市政', '积水'],
  },
  {
    id: 'a003',
    platform: 'shortvideo',
    title: '实拍！XX公园广场舞噪音扰民',
    content: '每天早上6点不到，XX公园就开始放高音喇叭跳广场舞，附近居民苦不堪言，多次报警也没效果。家里有备考的学生和上夜班的年轻人，根本没法休息。希望有关部门管管！',
    summary: 'XX公园广场舞早间噪音扰民，影响备考学生和夜班人员休息。',
    region: '东城区',
    district: '和平里街道',
    sentiment: 'negative',
    publishedAt: hoursAgo(2.5),
    interactions: { comments: 189, likes: 2156, shares: 423, total: 2768 },
    author: { name: '匿名用户', anonymized: true },
    excluded: false,
    followed: false,
    clusterId: 'c003',
    status: 'pending',
    tags: ['噪音', '扰民'],
  },
  {
    id: 'a004',
    platform: 'forum',
    title: 'XX小学划片区不合理',
    content: '各位领导好，我家住在XX小区，按往年划片应该上XX小学，但今年新出的划片政策把我们划到了3公里外的另一所小学，接送非常不方便。同小区其他楼都能上，就我们这两栋楼不行，想问问是什么原因？',
    summary: 'XX小区两栋楼划片变更至3公里外小学，居民询问划片依据。',
    region: '西城区',
    district: '德胜街道',
    sentiment: 'neutral',
    publishedAt: hoursAgo(3.8),
    interactions: { comments: 67, likes: 234, shares: 15, total: 316 },
    author: { name: '张**', anonymized: true },
    excluded: false,
    followed: false,
    clusterId: 'c004',
    status: 'pending',
    tags: ['教育', '划片'],
  },
  {
    id: 'a005',
    platform: 'hotline',
    title: '感谢XX街道办快速解决垃圾清运问题',
    content: '上周反映的XX胡同垃圾堆放问题，没想到三天就彻底解决了！街道办的工作人员态度很好，清运车也来了好几趟，现在胡同里干净多了。给咱们政府部门点个赞，效率真高！',
    summary: '居民感谢XX街道办三天内解决胡同垃圾堆放问题。',
    region: '东城区',
    district: '交道口街道',
    sentiment: 'positive',
    publishedAt: hoursAgo(4.5),
    interactions: { comments: 12, likes: 456, shares: 34, total: 502 },
    author: { name: '赵**', anonymized: true },
    excluded: false,
    followed: false,
    status: 'resolved',
    tags: ['感谢', '环卫'],
  },
  {
    id: 'a006',
    platform: 'shortvideo',
    title: 'XX地铁站外黑车猖獗运营',
    content: 'XX地铁站B出口每天都有十几辆黑车在拉客，漫天要价，还经常堵在人行道上影响通行。之前反映过但没见改善，希望交通执法部门能加大查处力度，别让黑车影响城市形象。',
    summary: 'XX地铁站B出口黑车拉客、占道运营，建议加大查处力度。',
    region: '丰台区',
    district: '丽泽街道',
    sentiment: 'negative',
    publishedAt: hoursAgo(5.2),
    interactions: { comments: 234, likes: 1890, shares: 312, total: 2436 },
    author: { name: '视频用户', anonymized: true },
    excluded: false,
    followed: true,
    clusterId: 'c005',
    status: 'processing',
    tags: ['交通', '黑车'],
  },
  {
    id: 'a007',
    platform: 'message',
    title: '建议在XX路增设过街天桥',
    content: 'XX路（XX段）车流大、车速快，附近有小学和居民区，行人过马路非常危险，去年就发生过两起交通事故。建议在此路段增设过街天桥或地下通道，保障居民出行安全。',
    summary: '建议XX路增设过街天桥，保障小学周边居民过街安全。',
    region: '石景山区',
    district: '八角街道',
    sentiment: 'neutral',
    publishedAt: hoursAgo(6.8),
    interactions: { comments: 89, likes: 567, shares: 45, total: 701 },
    author: { name: '陈**', anonymized: true },
    excluded: false,
    followed: false,
    status: 'pending',
    tags: ['建议', '交通'],
  },
  {
    id: 'a008',
    platform: 'forum',
    title: 'XXX减肥茶虚假宣传',
    content: '买了三盒XXX减肥茶，广告说七天瘦十斤，喝完一盒一斤没瘦还拉肚子。客服说是我体质问题，不给退。大家千万别上当！已经投诉到12315了。',
    summary: '网友投诉XXX减肥茶虚假宣传，喝完无效果还拉肚子，拒绝退款。',
    region: '通州区',
    district: '梨园地区',
    sentiment: 'negative',
    publishedAt: hoursAgo(7.5),
    interactions: { comments: 456, likes: 3421, shares: 892, total: 4769 },
    author: { name: '论坛老用户', anonymized: true },
    excluded: true,
    followed: false,
    status: 'pending',
    tags: ['消费', '虚假宣传'],
  },
  {
    id: 'a009',
    platform: 'hotline',
    title: 'XX社区养老助餐点服务好',
    content: '我是独居老人，子女不在身边。XX社区新开的养老助餐点太棒了！饭菜可口、价格实惠，工作人员服务态度特别好，还能送餐上门。真是解决了我们老年人的吃饭大问题！',
    summary: '独居老人称赞XX社区养老助餐点饭菜好、服务优，解决吃饭难题。',
    region: '朝阳区',
    district: '八里庄街道',
    sentiment: 'positive',
    publishedAt: hoursAgo(8.3),
    interactions: { comments: 8, likes: 234, shares: 12, total: 254 },
    author: { name: '刘**', anonymized: true },
    excluded: false,
    followed: false,
    status: 'resolved',
    tags: ['养老', '感谢'],
  },
  {
    id: 'a010',
    platform: 'message',
    title: 'XX小区违规搭建严重',
    content: 'XX小区顶层违建现象严重，几乎家家户户都在楼顶搭了阳光房，有的甚至加了一层。不仅破坏了楼体外观，还存在严重的消防和结构安全隐患，万一天气不好出事怎么办？',
    summary: 'XX小区顶层违建严重，存在消防及结构安全隐患。',
    region: '昌平区',
    district: '回龙观街道',
    sentiment: 'negative',
    publishedAt: hoursAgo(9.1),
    interactions: { comments: 123, likes: 876, shares: 56, total: 1055 },
    author: { name: '孙**', anonymized: true },
    excluded: false,
    followed: false,
    clusterId: 'c006',
    status: 'pending',
    tags: ['违建', '安全'],
  },
  {
    id: 'a011',
    platform: 'shortvideo',
    title: '好消息！XX公园二期开放了',
    content: '期待已久的XX公园二期终于开放了！湖水清澈、绿树成荫，还有专门的儿童游乐区和健身步道。周末带孩子去玩了一天，环境真不错，感谢政府为老百姓办的实事！',
    summary: '网友盛赞XX公园二期环境优美，感谢市政民生工程。',
    region: '大兴区',
    district: '亦庄地区',
    sentiment: 'positive',
    publishedAt: hoursAgo(10.5),
    interactions: { comments: 67, likes: 1234, shares: 189, total: 1490 },
    author: { name: '旅游达人', anonymized: true },
    excluded: false,
    followed: false,
    status: 'resolved',
    tags: ['公园', '民生'],
  },
  {
    id: 'a012',
    platform: 'hotline',
    title: 'XX路路灯坏了一个多月没人修',
    content: 'XX路从XX路口到XX巷这段的路灯坏了快两个月了，晚上一片漆黑，附近居民出行很不安全，尤其是女孩子下夜班特别害怕。打过好几次电话报修，一直没人来处理。',
    summary: 'XX路路灯损坏近两个月未修，影响居民夜间出行安全。',
    region: '丰台区',
    district: '右安门街道',
    sentiment: 'negative',
    publishedAt: hoursAgo(11.8),
    interactions: { comments: 34, likes: 445, shares: 23, total: 502 },
    author: { name: '周**', anonymized: true },
    excluded: false,
    followed: false,
    clusterId: 'c007',
    status: 'pending',
    tags: ['市政', '路灯'],
  },
  {
    id: 'a013',
    platform: 'forum',
    title: 'XX医院排队挂号太难了',
    content: '去XX医院看个病，早上5点去排队都挂不上专家号，黄牛手里号源充足但要价翻倍。医院能不能增加号源或者优化预约系统？普通老百姓看个病真的太不容易了。',
    summary: '网友反映XX医院专家号难挂，建议增加号源或优化预约系统。',
    region: '西城区',
    district: '月坛街道',
    sentiment: 'negative',
    publishedAt: hoursAgo(12.5),
    interactions: { comments: 312, likes: 2345, shares: 445, total: 3102 },
    author: { name: '健康第一', anonymized: true },
    excluded: false,
    followed: true,
    clusterId: 'c008',
    status: 'processing',
    tags: ['医疗', '挂号'],
  },
  {
    id: 'a014',
    platform: 'message',
    title: '咨询灵活就业社保补贴政策',
    content: '您好，我今年45岁，去年公司裁员后一直打零工，听说有灵活就业社保补贴政策，想咨询一下具体申请条件和办理流程是什么？需要准备哪些材料？谢谢！',
    summary: '市民咨询灵活就业社保补贴的申请条件、流程及所需材料。',
    region: '海淀区',
    district: '学院路街道',
    sentiment: 'neutral',
    publishedAt: hoursAgo(13.2),
    interactions: { comments: 15, likes: 123, shares: 8, total: 146 },
    author: { name: '吴**', anonymized: true },
    excluded: false,
    followed: false,
    status: 'resolved',
    tags: ['社保', '咨询'],
  },
  {
    id: 'a015',
    platform: 'shortvideo',
    title: 'XX商圈促销打折',
    content: 'XX购物广场年中大促，全场5折起，还有满减和抽奖活动，人超多！需要买东西的朋友赶紧冲！我已经囤了一大堆了哈哈哈～',
    summary: '【商业推广】XX购物广场年中大促信息。',
    region: '朝阳区',
    district: '三里屯街道',
    sentiment: 'positive',
    publishedAt: hoursAgo(14.7),
    interactions: { comments: 23, likes: 567, shares: 123, total: 713 },
    author: { name: '购物小能手', anonymized: true },
    excluded: true,
    followed: false,
    status: 'pending',
    tags: ['广告', '促销'],
  },
];

interface AppealState {
  appeals: Appeal[];
  selectedAppealId: string | null;
  searchKeyword: string;
  selectedPlatforms: string[];
  selectedRegions: string[];
  timeRange: 'today' | 'yesterday' | 'last3days' | 'last7days' | 'custom';
  showExcluded: boolean;
}

interface AppealActions {
  getAppealById: (id: string) => Appeal | undefined;
  selectAppeal: (id: string | null) => void;
  toggleExcluded: (id: string) => void;
  bulkToggleExcluded: (ids: string[], excluded: boolean) => void;
  toggleFollowed: (id: string) => void;
  setSearchKeyword: (keyword: string) => void;
  togglePlatform: (platform: string) => void;
  setSelectedPlatforms: (platforms: string[]) => void;
  toggleRegion: (region: string) => void;
  setSelectedRegions: (regions: string[]) => void;
  setTimeRange: (range: AppealState['timeRange']) => void;
  setShowExcluded: (show: boolean) => void;
  setStatus: (id: string, status: Appeal['status']) => void;
  clearFilters: () => void;
}

export const useAppealStore = create<AppealState & AppealActions>((set, get) => ({
  appeals: mockAppeals,
  selectedAppealId: null,
  searchKeyword: '',
  selectedPlatforms: [],
  selectedRegions: [],
  timeRange: 'today',
  showExcluded: false,

  getAppealById: (id) => get().appeals.find((a) => a.id === id),

  selectAppeal: (id) => set({ selectedAppealId: id }),

  toggleExcluded: (id) =>
    set((state) => ({
      appeals: state.appeals.map((a) =>
        a.id === id ? { ...a, excluded: !a.excluded } : a
      ),
    })),

  bulkToggleExcluded: (ids, excluded) =>
    set((state) => ({
      appeals: state.appeals.map((a) =>
        ids.includes(a.id) ? { ...a, excluded } : a
      ),
    })),

  toggleFollowed: (id) =>
    set((state) => ({
      appeals: state.appeals.map((a) =>
        a.id === id ? { ...a, followed: !a.followed } : a
      ),
    })),

  setSearchKeyword: (keyword) => set({ searchKeyword: keyword }),

  togglePlatform: (platform) =>
    set((state) => ({
      selectedPlatforms: state.selectedPlatforms.includes(platform)
        ? state.selectedPlatforms.filter((p) => p !== platform)
        : [...state.selectedPlatforms, platform],
    })),

  setSelectedPlatforms: (platforms) => set({ selectedPlatforms: platforms }),

  toggleRegion: (region) =>
    set((state) => ({
      selectedRegions: state.selectedRegions.includes(region)
        ? state.selectedRegions.filter((r) => r !== region)
        : [...state.selectedRegions, region],
    })),

  setSelectedRegions: (regions) => set({ selectedRegions: regions }),

  setTimeRange: (range) => set({ timeRange: range }),

  setShowExcluded: (show) => set({ showExcluded: show }),

  setStatus: (id, status) =>
    set((state) => ({
      appeals: state.appeals.map((a) => (a.id === id ? { ...a, status } : a)),
    })),

  clearFilters: () =>
    set({
      searchKeyword: '',
      selectedPlatforms: [],
      selectedRegions: [],
      timeRange: 'today',
      showExcluded: false,
    }),
}));
