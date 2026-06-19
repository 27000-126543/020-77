export interface RepresentativePost {
  id: string;
  title: string;
  content: string;
  platform: string;
  author: string;
  createdAt: string;
  interactions: number;
}

export interface Cluster {
  id: string;
  name: string;
  icon: string;
  color: string;
  newCount: number;
  totalCount: number;
  spreadSpeed: '快' | '中' | '慢';
  urgency: '高' | '中' | '低';
  urgencyScore: number;
  primaryStreet: string;
  affectedStreets: string[];
  representativePost: RepresentativePost;
  trend: 'up' | 'stable' | 'down';
  sentimentRatio: {
    positive: number;
    negative: number;
    neutral: number;
  };
}

const streetPool = ['朝阳街道', '和平街道', '建设街道', '解放街道', '胜利街道', '人民街道', '新华街道', '光明街道', '中山街道', '文化街道'];

function randomStreets(primary: string, count: number): string[] {
  const others = streetPool.filter((s) => s !== primary);
  const shuffled = [...others].sort(() => Math.random() - 0.5);
  return [primary, ...shuffled.slice(0, count - 1)];
}

export const mockClusters: Cluster[] = [
  {
    id: 'CL-001',
    name: '供暖不热',
    icon: 'thermometer',
    color: '#ef4444',
    newCount: 47,
    totalCount: 326,
    spreadSpeed: '快',
    urgency: '高',
    urgencyScore: 92,
    primaryStreet: '朝阳街道',
    affectedStreets: randomStreets('朝阳街道', 5),
    representativePost: {
      id: 'AP-0015',
      title: '家里暖气温度不达标',
      content: '我家客厅温度计显示只有16度，穿着羽绒服还觉得冷，孩子都感冒了，希望相关部门能尽快解决。',
      platform: '微信',
      author: '市民小王',
      createdAt: '2026-06-19T18:30:00.000Z',
      interactions: 423,
    },
    trend: 'up',
    sentimentRatio: { positive: 8, negative: 78, neutral: 14 },
  },
  {
    id: 'CL-002',
    name: '道路积水',
    icon: 'cloud-rain',
    color: '#3b82f6',
    newCount: 38,
    totalCount: 254,
    spreadSpeed: '快',
    urgency: '高',
    urgencyScore: 88,
    primaryStreet: '解放街道',
    affectedStreets: randomStreets('解放街道', 4),
    representativePost: {
      id: 'AP-0023',
      title: 'XX路积水严重无法通行',
      content: '昨天一场大雨后，XX路积水快到膝盖了，好几辆车泡在水里，行人根本无法通过。',
      platform: '抖音',
      author: '热心居民',
      createdAt: '2026-06-18T09:15:00.000Z',
      interactions: 612,
    },
    trend: 'up',
    sentimentRatio: { positive: 5, negative: 85, neutral: 10 },
  },
  {
    id: 'CL-003',
    name: '学区划分',
    icon: 'school',
    color: '#8b5cf6',
    newCount: 29,
    totalCount: 412,
    spreadSpeed: '中',
    urgency: '中',
    urgencyScore: 65,
    primaryStreet: '建设街道',
    affectedStreets: randomStreets('建设街道', 6),
    representativePost: {
      id: 'AP-0031',
      title: '今年学区划分政策咨询',
      content: '想咨询一下今年的学区划分政策，我们小区今年有没有调整？孩子明年要上学了。',
      platform: '论坛',
      author: '李女士',
      createdAt: '2026-06-17T14:20:00.000Z',
      interactions: 387,
    },
    trend: 'stable',
    sentimentRatio: { positive: 12, negative: 45, neutral: 43 },
  },
  {
    id: 'CL-004',
    name: '物业纠纷',
    icon: 'building',
    color: '#f59e0b',
    newCount: 42,
    totalCount: 568,
    spreadSpeed: '中',
    urgency: '中',
    urgencyScore: 71,
    primaryStreet: '和平街道',
    affectedStreets: randomStreets('和平街道', 7),
    representativePost: {
      id: 'AP-0042',
      title: '小区物业不作为投诉',
      content: '小区电梯三天两头坏，老人小孩被困好几次了，物业一直拖着不彻底维修。',
      platform: '微博',
      author: '张先生',
      createdAt: '2026-06-19T10:45:00.000Z',
      interactions: 294,
    },
    trend: 'up',
    sentimentRatio: { positive: 6, negative: 72, neutral: 22 },
  },
  {
    id: 'CL-005',
    name: '环境污染',
    icon: 'alert-triangle',
    color: '#10b981',
    newCount: 33,
    totalCount: 289,
    spreadSpeed: '中',
    urgency: '高',
    urgencyScore: 84,
    primaryStreet: '人民街道',
    affectedStreets: randomStreets('人民街道', 4),
    representativePost: {
      id: 'AP-0056',
      title: 'XX工厂偷排废气',
      content: '最近每天晚上都能闻到刺鼻的气味，怀疑是附近工厂偷排废气，家里窗户都不敢开。',
      platform: '12345热线',
      author: '赵阿姨',
      createdAt: '2026-06-18T22:10:00.000Z',
      interactions: 521,
    },
    trend: 'up',
    sentimentRatio: { positive: 4, negative: 81, neutral: 15 },
  },
  {
    id: 'CL-006',
    name: '施工噪音',
    icon: 'volume-2',
    color: '#ec4899',
    newCount: 51,
    totalCount: 476,
    spreadSpeed: '快',
    urgency: '高',
    urgencyScore: 89,
    primaryStreet: '光明街道',
    affectedStreets: randomStreets('光明街道', 5),
    representativePost: {
      id: 'AP-0063',
      title: '工地夜间施工扰民',
      content: '工地半夜还在施工，机器轰鸣声吵得根本睡不着，明天还要上班呢！',
      platform: '小红书',
      author: '刘同学',
      createdAt: '2026-06-19T23:50:00.000Z',
      interactions: 703,
    },
    trend: 'up',
    sentimentRatio: { positive: 3, negative: 88, neutral: 9 },
  },
  {
    id: 'CL-007',
    name: '停车难',
    icon: 'car',
    color: '#06b6d4',
    newCount: 36,
    totalCount: 612,
    spreadSpeed: '慢',
    urgency: '中',
    urgencyScore: 62,
    primaryStreet: '新华街道',
    affectedStreets: randomStreets('新华街道', 8),
    representativePost: {
      id: 'AP-0071',
      title: '小区停车位一位难求',
      content: '每天下班回家找车位要转半小时，小区车位严重不足，能不能规划些临时停车位？',
      platform: '微信',
      author: '孙师傅',
      createdAt: '2026-06-18T19:30:00.000Z',
      interactions: 186,
    },
    trend: 'stable',
    sentimentRatio: { positive: 10, negative: 58, neutral: 32 },
  },
  {
    id: 'CL-008',
    name: '公交延误',
    icon: 'bus',
    color: '#6366f1',
    newCount: 24,
    totalCount: 198,
    spreadSpeed: '中',
    urgency: '中',
    urgencyScore: 58,
    primaryStreet: '中山街道',
    affectedStreets: randomStreets('中山街道', 4),
    representativePost: {
      id: 'AP-0084',
      title: '公交经常晚点等车难',
      content: '每天等28路公交最少要等20分钟，有时候来车还不停，上班经常迟到。',
      platform: '微博',
      author: '周女士',
      createdAt: '2026-06-19T08:05:00.000Z',
      interactions: 154,
    },
    trend: 'down',
    sentimentRatio: { positive: 15, negative: 52, neutral: 33 },
  },
  {
    id: 'CL-009',
    name: '医疗排队',
    icon: 'heart-pulse',
    color: '#dc2626',
    newCount: 31,
    totalCount: 345,
    spreadSpeed: '中',
    urgency: '高',
    urgencyScore: 79,
    primaryStreet: '胜利街道',
    affectedStreets: randomStreets('胜利街道', 3),
    representativePost: {
      id: 'AP-0092',
      title: '大医院挂号太难了',
      content: '想挂个专家号，手机上提前一周都抢不到，现场排队也排不上，看病太难了。',
      platform: '论坛',
      author: '吴先生',
      createdAt: '2026-06-17T11:40:00.000Z',
      interactions: 445,
    },
    trend: 'stable',
    sentimentRatio: { positive: 8, negative: 67, neutral: 25 },
  },
  {
    id: 'CL-010',
    name: '社保咨询',
    icon: 'file-text',
    color: '#0ea5e9',
    newCount: 18,
    totalCount: 423,
    spreadSpeed: '慢',
    urgency: '低',
    urgencyScore: 38,
    primaryStreet: '文化街道',
    affectedStreets: randomStreets('文化街道', 6),
    representativePost: {
      id: 'AP-0105',
      title: '社保转移办理流程咨询',
      content: '刚换了工作要转社保，请问需要什么材料？网上可以办理吗？',
      platform: '12345热线',
      author: '郑阿姨',
      createdAt: '2026-06-18T15:25:00.000Z',
      interactions: 98,
    },
    trend: 'stable',
    sentimentRatio: { positive: 28, negative: 18, neutral: 54 },
  },
  {
    id: 'CL-011',
    name: '违章建筑',
    icon: 'hammer',
    color: '#84cc16',
    newCount: 27,
    totalCount: 231,
    spreadSpeed: '慢',
    urgency: '高',
    urgencyScore: 82,
    primaryStreet: '朝阳街道',
    affectedStreets: randomStreets('朝阳街道', 5),
    representativePost: {
      id: 'AP-0113',
      title: '小区顶楼违建阳光房',
      content: '顶楼住户私自搭建阳光房，还占了公共区域，下雨天漏水到我家，反映多次没人管。',
      platform: '抖音',
      author: '钱师傅',
      createdAt: '2026-06-19T16:55:00.000Z',
      interactions: 378,
    },
    trend: 'up',
    sentimentRatio: { positive: 7, negative: 74, neutral: 19 },
  },
  {
    id: 'CL-012',
    name: '食品安全',
    icon: 'utensils',
    color: '#f97316',
    newCount: 22,
    totalCount: 187,
    spreadSpeed: '快',
    urgency: '高',
    urgencyScore: 86,
    primaryStreet: '建设街道',
    affectedStreets: randomStreets('建设街道', 4),
    representativePost: {
      id: 'AP-0121',
      title: '外卖吃出异物怎么办',
      content: '昨天点的外卖里居然吃出了头发，拍照联系商家还不承认，太恶心了！',
      platform: '小红书',
      author: '李女士',
      createdAt: '2026-06-20T12:30:00.000Z',
      interactions: 567,
    },
    trend: 'up',
    sentimentRatio: { positive: 6, negative: 80, neutral: 14 },
  },
];
