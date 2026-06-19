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

export const DISTRICTS: District[] = [
  {
    value: 'district_01',
    label: '东城区',
    streets: [
      { value: 'street_01_01', label: '东华门街道' },
      { value: 'street_01_02', label: '景山街道' },
      { value: 'street_01_03', label: '交道口街道' },
      { value: 'street_01_04', label: '安定门街道' },
      { value: 'street_01_05', label: '北新桥街道' },
      { value: 'street_01_06', label: '东四街道' },
    ],
  },
  {
    value: 'district_02',
    label: '西城区',
    streets: [
      { value: 'street_02_01', label: '西长安街街道' },
      { value: 'street_02_02', label: '新街口街道' },
      { value: 'street_02_03', label: '月坛街道' },
      { value: 'street_02_04', label: '展览路街道' },
      { value: 'street_02_05', label: '德胜街道' },
    ],
  },
  {
    value: 'district_03',
    label: '朝阳区',
    streets: [
      { value: 'street_03_01', label: '建外街道' },
      { value: 'street_03_02', label: '朝外街道' },
      { value: 'street_03_03', label: '呼家楼街道' },
      { value: 'street_03_04', label: '三里屯街道' },
      { value: 'street_03_05', label: '团结湖街道' },
      { value: 'street_03_06', label: '双井街道' },
      { value: 'street_03_07', label: '劲松街道' },
    ],
  },
  {
    value: 'district_04',
    label: '海淀区',
    streets: [
      { value: 'street_04_01', label: '中关村街道' },
      { value: 'street_04_02', label: '海淀街道' },
      { value: 'street_04_03', label: '学院路街道' },
      { value: 'street_04_04', label: '上地街道' },
      { value: 'street_04_05', label: '西三旗街道' },
      { value: 'street_04_06', label: '清河街道' },
    ],
  },
  {
    value: 'district_05',
    label: '丰台区',
    streets: [
      { value: 'street_05_01', label: '丰台街道' },
      { value: 'street_05_02', label: '卢沟桥街道' },
      { value: 'street_05_03', label: '右安门街道' },
      { value: 'street_05_04', label: '太平桥街道' },
      { value: 'street_05_05', label: '丽泽商务区街道' },
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
