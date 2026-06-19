import type {
  PlatformKey,
  SentimentType,
  TimeRangeType,
  UrgencyLevel,
} from '@/types'

export interface Department {
  value: string
  label: string
  code: string
}

export interface District {
  value: string
  label: string
  streets: { value: string; label: string }[]
}

export interface Platform {
  value: PlatformKey
  label: string
  color: string
  iconName: string
}

export interface UrgencyItem {
  value: UrgencyLevel
  label: string
  color: string
  bgColor: string
}

export interface SentimentItem {
  value: SentimentType
  label: string
  color: string
  bgColor: string
}

export interface TimeRangeItem {
  value: TimeRangeType
  label: string
}

export const DEPARTMENTS: Department[] = [
  { value: 'dept_01', label: '市委宣传部', code: 'xcb' },
  { value: 'dept_02', label: '市政府办公室', code: 'zfb' },
  { value: 'dept_03', label: '市公安局', code: 'gaj' },
  { value: 'dept_04', label: '市民政局', code: 'mzj' },
  { value: 'dept_05', label: '市财政局', code: 'czj' },
  { value: 'dept_06', label: '市人力资源和社会保障局', code: 'rsj' },
  { value: 'dept_07', label: '市自然资源和规划局', code: 'zrzyj' },
  { value: 'dept_08', label: '市住房和城乡建设局', code: 'zjj' },
  { value: 'dept_09', label: '市交通运输局', code: 'jtysj' },
  { value: 'dept_10', label: '市卫生健康委员会', code: 'wjw' },
  { value: 'dept_11', label: '市教育局', code: 'jyj' },
  { value: 'dept_12', label: '市生态环境局', code: 'sthjj' },
  { value: 'dept_13', label: '市市场监督管理局', code: 'scjgj' },
  { value: 'dept_14', label: '市信访局', code: 'xfj' },
]

export const DEPT_SHORT_NAMES: Record<string, string> = {
  dept_01: '宣传部',
  dept_02: '市政府办',
  dept_03: '公安局',
  dept_04: '民政局',
  dept_05: '财政局',
  dept_06: '人社局',
  dept_07: '自然资源局',
  dept_08: '住建局',
  dept_09: '交通局',
  dept_10: '卫健委',
  dept_11: '教育局',
  dept_12: '生态环境局',
  dept_13: '市监局',
  dept_14: '信访局',
}

export const DISTRICTS: District[] = [
  {
    value: '东城区',
    label: '东城区',
    streets: [
      { value: '东华门街道', label: '东华门街道' },
      { value: '景山街道', label: '景山街道' },
      { value: '交道口街道', label: '交道口街道' },
      { value: '安定门街道', label: '安定门街道' },
      { value: '北新桥街道', label: '北新桥街道' },
      { value: '东四街道', label: '东四街道' },
      { value: '和平里街道', label: '和平里街道' },
    ],
  },
  {
    value: '西城区',
    label: '西城区',
    streets: [
      { value: '西长安街街道', label: '西长安街街道' },
      { value: '新街口街道', label: '新街口街道' },
      { value: '月坛街道', label: '月坛街道' },
      { value: '展览路街道', label: '展览路街道' },
      { value: '德胜街道', label: '德胜街道' },
    ],
  },
  {
    value: '朝阳区',
    label: '朝阳区',
    streets: [
      { value: '建外街道', label: '建外街道' },
      { value: '朝外街道', label: '朝外街道' },
      { value: '呼家楼街道', label: '呼家楼街道' },
      { value: '三里屯街道', label: '三里屯街道' },
      { value: '团结湖街道', label: '团结湖街道' },
      { value: '双井街道', label: '双井街道' },
      { value: '劲松街道', label: '劲松街道' },
      { value: '望京街道', label: '望京街道' },
      { value: '八里庄街道', label: '八里庄街道' },
    ],
  },
  {
    value: '海淀区',
    label: '海淀区',
    streets: [
      { value: '中关村街道', label: '中关村街道' },
      { value: '海淀街道', label: '海淀街道' },
      { value: '学院路街道', label: '学院路街道' },
      { value: '上地街道', label: '上地街道' },
      { value: '西三旗街道', label: '西三旗街道' },
      { value: '清河街道', label: '清河街道' },
    ],
  },
  {
    value: '丰台区',
    label: '丰台区',
    streets: [
      { value: '丰台街道', label: '丰台街道' },
      { value: '卢沟桥街道', label: '卢沟桥街道' },
      { value: '右安门街道', label: '右安门街道' },
      { value: '太平桥街道', label: '太平桥街道' },
      { value: '丽泽街道', label: '丽泽街道' },
      { value: '丽泽商务区街道', label: '丽泽商务区街道' },
    ],
  },
  {
    value: '石景山区',
    label: '石景山区',
    streets: [
      { value: '八角街道', label: '八角街道' },
      { value: '古城街道', label: '古城街道' },
      { value: '鲁谷街道', label: '鲁谷街道' },
    ],
  },
  {
    value: '通州区',
    label: '通州区',
    streets: [
      { value: '梨园地区', label: '梨园地区' },
      { value: '永顺镇', label: '永顺镇' },
      { value: '北苑街道', label: '北苑街道' },
    ],
  },
  {
    value: '昌平区',
    label: '昌平区',
    streets: [
      { value: '回龙观街道', label: '回龙观街道' },
      { value: '天通苑', label: '天通苑' },
      { value: '霍营街道', label: '霍营街道' },
    ],
  },
  {
    value: '大兴区',
    label: '大兴区',
    streets: [
      { value: '亦庄地区', label: '亦庄地区' },
      { value: '黄村街道', label: '黄村街道' },
    ],
  },
]

export const PLATFORMS: Platform[] = [
  {
    value: 'hotline',
    label: '12345热线',
    color: '#3B82F6',
    iconName: 'Phone',
  },
  {
    value: 'message',
    label: '政务留言板',
    color: '#10B981',
    iconName: 'MessageSquare',
  },
  {
    value: 'shortvideo',
    label: '短视频评论',
    color: '#EF4444',
    iconName: 'PlayCircle',
  },
  {
    value: 'forum',
    label: '本地论坛',
    color: '#8B5CF6',
    iconName: 'Users',
  },
]

export const URGENCY_LEVELS: UrgencyItem[] = [
  {
    value: 'special',
    label: '特急',
    color: '#DC2626',
    bgColor: 'bg-red-500/10',
  },
  {
    value: 'urgent',
    label: '紧急',
    color: '#F59E0B',
    bgColor: 'bg-amber-500/10',
  },
  {
    value: 'normal',
    label: '一般',
    color: '#EAB308',
    bgColor: 'bg-yellow-500/10',
  },
  {
    value: 'attention',
    label: '关注',
    color: '#3B82F6',
    bgColor: 'bg-blue-500/10',
  },
]

export const SENTIMENTS: SentimentItem[] = [
  {
    value: 'positive',
    label: '正面',
    color: '#059669',
    bgColor: 'bg-emerald-500/10',
  },
  {
    value: 'neutral',
    label: '中性',
    color: '#6B7280',
    bgColor: 'bg-gray-500/10',
  },
  {
    value: 'negative',
    label: '负面',
    color: '#DC2626',
    bgColor: 'bg-red-500/10',
  },
]

export const TIME_RANGES: TimeRangeItem[] = [
  { value: 'today', label: '今日' },
  { value: 'yesterday', label: '昨日' },
  { value: 'last3days', label: '近3天' },
  { value: 'custom', label: '自定义' },
]
