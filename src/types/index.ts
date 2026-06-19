export type SentimentType = 'positive' | 'neutral' | 'negative'

export type UrgencyLevel = 'special' | 'urgent' | 'normal' | 'attention'

export type TimeRangeType = 'today' | 'yesterday' | 'last3days' | 'custom'

export type PlatformKey = 'hotline' | 'message' | 'shortvideo' | 'forum'

export interface PlatformRange<T extends string = string> {
  value: T
  label: string
  count?: number
}

export interface Platform {
  sentiment: PlatformRange<SentimentType>[]
  urgency: PlatformRange<UrgencyLevel>[]
  time: PlatformRange<TimeRangeType>[]
}

export interface Appeal {
  id: string
  platform: PlatformKey
  platformName: string
  publishTime: string
  content: string
  summary: string
  interactions: {
    comments: number
    likes: number
    forwards: number
  }
  sentiment: SentimentType
  sentimentLabel: string
  author: {
    id: string
    nickname: string
  }
  district?: string
  street?: string
  isExcluded?: boolean
  isFollowed?: boolean
  similarIds?: string[]
}

export interface Cluster {
  id: string
  title: string
  keyword: string
  newCount: number
  totalCount: number
  spreadSpeed: number
  districts: string[]
  streets: string[]
  representativePost: {
    id: string
    summary: string
    platform: PlatformKey
  }
  urgencyLevel: UrgencyLevel
  urgencyLabel: string
  trend: 'rising' | 'stable' | 'declining'
  platforms: PlatformKey[]
  createdAt: string
}

export interface Analysis {
  id: string
  clusterId: string
  clusterTitle: string
  urgencyLevel: UrgencyLevel
  urgencyLabel: string
  assignedDepartments: string[]
  suggestedCaliber: string
  disposalSuggestion: string
  operator: string
  createdAt: string
  updatedAt: string
  status: 'pending' | 'completed'
}

export interface Filters {
  timeRange: TimeRangeType
  customStartTime?: string
  customEndTime?: string
  districts: string[]
  platforms: PlatformKey[]
  sentiments: SentimentType[]
  urgencyLevels: UrgencyLevel[]
  keyword: string
  departments: string[]
}
