import { create } from 'zustand';
import type { Urgency } from '../utils/formatters';

export interface Department {
  id: string;
  name: string;
  category: string;
}

export const DEPARTMENTS: Department[] = [
  { id: 'd001', name: '住建局', category: '城乡建设' },
  { id: 'd002', name: '城管委', category: '城市管理' },
  { id: 'd003', name: '交通委', category: '交通运输' },
  { id: 'd004', name: '教委', category: '教育体育' },
  { id: 'd005', name: '卫健委', category: '卫生健康' },
  { id: 'd006', name: '民政局', category: '民政民生' },
  { id: 'd007', name: '环保局', category: '生态环境' },
  { id: 'd008', name: '市场监管局', category: '市场监管' },
  { id: 'd009', name: '公安局', category: '公共安全' },
  { id: 'd010', name: '水务局', category: '水利水务' },
  { id: 'd011', name: '园林绿化局', category: '园林绿化' },
  { id: 'd012', name: '人力社保局', category: '人力资源' },
];

export const CALIBER_TEMPLATES = [
  {
    id: 't001',
    name: '民生类通用口径',
    content:
      '针对网民反映的问题，我单位高度重视，已第一时间安排专人核实情况。目前相关工作正在有序推进中，后续将及时向社会公布进展。感谢网民对我们工作的监督与支持。',
  },
  {
    id: 't002',
    name: '政策咨询类口径',
    content:
      '您好，您所咨询的政策如下：根据《XX办法》第X条规定，[具体政策内容]。如需进一步了解，请拨打咨询电话XXX-XXXXXXX，或前往XX服务窗口现场办理。',
  },
  {
    id: 't003',
    name: '投诉处置类口径',
    content:
      '收到网民反映后，我单位立即组织核查。经查，[情况说明]。对此，我们已采取[处置措施]，并将持续加强[后续监管]，切实保障群众合法权益。',
  },
];

export interface AnalysisRecord {
  id: string;
  clusterId: string;
  clusterName: string;
  urgency: Urgency;
  departments: string[];
  caliber: string;
  suggestion: string;
  assignedBy: string;
  assignedAt: string;
  updatedAt: string;
  status: 'draft' | 'submitted' | 'approved' | 'dispatched';
  priority: number;
}

export interface DailySummary {
  id: string;
  date: string;
  generatedAt: string;
  generatedBy: string;
  risingTopics: Array<{
    clusterId: string;
    clusterName: string;
    urgency: Urgency;
    newCount: number;
    growthRate: number;
    departments: string[];
  }>;
  keyAppeals: Array<{
    title: string;
    region: string;
    sentiment: string;
    summary: string;
  }>;
  responsibilities: Array<{
    department: string;
    clusters: string[];
  }>;
  calibers: Array<{
    clusterName: string;
    caliber: string;
  }>;
  remarks: string;
}

function daysAgo(days: number, hours: number = 0): string {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000 - hours * 60 * 60 * 1000).toISOString();
}

const mockAnalysisRecords: AnalysisRecord[] = [
  {
    id: 'an001',
    clusterId: 'c001',
    clusterName: '供暖不达标问题',
    urgency: 'critical',
    departments: ['d001', 'd002'],
    caliber:
      '针对近期部分市民反映的供暖温度不达标问题，市住建局联合城管委已成立专项工作组，对全市供热企业开展拉网式排查。对排查中发现的问题，责令企业24小时内整改到位，整改不力的将依法依规严肃处理。市民如有供暖问题，可拨打12345热线，我们将第一时间响应处置。',
    suggestion:
      '1. 住建局牵头，要求各供热企业提交整改方案并限期落实；\n2. 对涉事小区逐户测温，建立温度台账；\n3. 12345热线增派坐席，专项受理供暖诉求；\n4. 约谈XX供热公司主要负责人，启动应急供热预案。',
    assignedBy: '张值班长',
    assignedAt: daysAgo(0, 4),
    updatedAt: daysAgo(0, 1),
    status: 'submitted',
    priority: 1,
  },
  {
    id: 'an002',
    clusterId: 'c008',
    clusterName: '医院挂号难问题',
    urgency: 'critical',
    departments: ['d005', 'd009'],
    caliber:
      '关于部分医院挂号难的问题，市卫健委已启动新一轮号源扩容工作，要求各三甲医院专家号源在现有基础上增加20%，同时严厉打击号贩子倒号行为。市公安局已组织专项行动，在重点医院周边开展巡查整治。建议市民优先通过官方APP预约挂号，共同维护良好就医秩序。',
    suggestion:
      '1. 卫健委督促各医院优化号源分配，向普通号倾斜；\n2. 公安局在重点医院部署便衣警力，严打黄牛倒号；\n3. 推进电子健康码互通，减少排队时间；\n4. 加强社区医院首诊制度引导。',
    assignedBy: '张值班长',
    assignedAt: daysAgo(0, 5),
    updatedAt: daysAgo(0, 2),
    status: 'submitted',
    priority: 2,
  },
  {
    id: 'an003',
    clusterId: 'c003',
    clusterName: '广场舞噪音扰民',
    urgency: 'urgent',
    departments: ['d009', 'd002', 'd011'],
    caliber:
      '针对广场舞噪音扰民问题，多部门将联合开展专项整治：一是合理划定公园广场活动区域，设定噪音限值和活动时段；二是为广场舞队伍配发定向音箱，降低噪音外溢；三是加强社区劝导，引导市民文明健身，兼顾他人休息权益。',
    suggestion:
      '1. 城管委联合公安开展噪音监测专项行动；\n2. 园林绿化局在公园内划定专门活动区；\n3. 试点推广定向音响设备，由街道统一采购配发；\n4. 社区建立广场舞自治公约。',
    assignedBy: '李副值班长',
    assignedAt: daysAgo(1, 3),
    updatedAt: daysAgo(0, 6),
    status: 'approved',
    priority: 3,
  },
  {
    id: 'an004',
    clusterId: 'c004',
    clusterName: '学区划片争议',
    urgency: 'urgent',
    departments: ['d004'],
    caliber:
      '关于义务教育阶段学区划片问题，市教委严格按照"就近入学"原则，综合考虑学校布局、学位供给、人口分布等因素科学划定。对今年划片调整的区域，教委已组织多场政策说明会，确保家长知情权。如仍有疑问，可到区教委招生办现场咨询。',
    suggestion:
      '1. 教委发布详细划片说明及政策依据；\n2. 各涉及区教委开设政策咨询专窗；\n3. 提前公示明年学位预警信息；\n4. 研究集团化办学扩容方案。',
    assignedBy: '李副值班长',
    assignedAt: daysAgo(1, 6),
    updatedAt: daysAgo(1, 2),
    status: 'dispatched',
    priority: 4,
  },
  {
    id: 'an005',
    clusterId: 'c002',
    clusterName: '路面积水排水不畅',
    urgency: 'urgent',
    departments: ['d002', 'd001', 'd010'],
    caliber:
      '针对汛期部分路段积水问题，市城管委已启动排水管网清淤专项工程，对全市易积水点逐一建立台账，汛期前完成全部清淤疏通工作。同时完善积水监测预警系统，遇强降雨时第一时间发布预警信息，保障市民出行安全。',
    suggestion:
      '1. 城管委牵头完成排水管网清淤；\n2. 水务局对易积水路段增设排水泵站；\n3. 在积水点设置警示标志；\n4. 建立汛期巡查值守机制。',
    assignedBy: '王研判员',
    assignedAt: daysAgo(2, 2),
    updatedAt: daysAgo(1, 8),
    status: 'dispatched',
    priority: 5,
  },
  {
    id: 'an006',
    clusterId: 'c005',
    clusterName: '地铁站外黑车运营',
    urgency: 'normal',
    departments: ['d003', 'd009'],
    caliber:
      '针对地铁站外黑车非法运营问题，交通执法部门已持续开展"打非治违"专项行动。通过增设监控探头、安排便衣蹲守、加大处罚力度等措施，黑车运营现象已明显减少。市民如遇黑车揽客，可保存证据并拨打交通服务监督电话举报。',
    suggestion:
      '1. 交通执法总队加密重点地铁站执法频次；\n2. 优化地铁口公交线路接驳，减少黑车生存空间；\n3. 联合公安开展非法营运车辆集中查处；\n4. 在地铁口设置正规网约车候客区。',
    assignedBy: '王研判员',
    assignedAt: daysAgo(2, 8),
    updatedAt: daysAgo(2, 3),
    status: 'dispatched',
    priority: 6,
  },
  {
    id: 'an007',
    clusterId: 'c007',
    clusterName: '市政设施损坏',
    urgency: 'attention',
    departments: ['d002'],
    caliber:
      '感谢市民对市政设施的关注与监督。我委已建立市政设施巡查抢修快速响应机制，接到报修后城区4小时内到场处置，郊区8小时内到场。市民发现路灯、井盖等设施损坏，可通过12345热线或城市管理APP上报，我们将第一时间处理。',
    suggestion:
      '1. 城管委建立市政设施网格化巡查制度；\n2. 对全市路灯进行一次全面检修；\n3. 在易损坏路段增设警示标识；\n4. 推广市民上报奖励机制。',
    assignedBy: '王研判员',
    assignedAt: daysAgo(3, 4),
    updatedAt: daysAgo(2, 10),
    status: 'dispatched',
    priority: 7,
  },
];

const mockDailySummary: DailySummary = {
  id: 'ds001',
  date: new Date().toISOString().split('T')[0],
  generatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  generatedBy: '张值班长',
  risingTopics: [
    {
      clusterId: 'c001',
      clusterName: '供暖不达标问题',
      urgency: 'critical',
      newCount: 36,
      growthRate: 0.42,
      departments: ['住建局', '城管委'],
    },
    {
      clusterId: 'c008',
      clusterName: '医院挂号难问题',
      urgency: 'critical',
      newCount: 89,
      growthRate: 0.38,
      departments: ['卫健委', '公安局'],
    },
    {
      clusterId: 'c004',
      clusterName: '学区划片争议',
      urgency: 'urgent',
      newCount: 24,
      growthRate: 0.55,
      departments: ['教委'],
    },
  ],
  keyAppeals: [
    {
      title: 'XX小区供暖温度不达标问题',
      region: '朝阳区望京街道',
      sentiment: '负面',
      summary: '近一周暖气温度仅16度左右，老人孩子已感冒，多次联系未果。',
    },
    {
      title: 'XX医院排队挂号太难了',
      region: '西城区月坛街道',
      sentiment: '负面',
      summary: '凌晨5点排队挂不上专家号，黄牛号源充足但要价翻倍。',
    },
  ],
  responsibilities: [
    { department: '住建局', clusters: ['供暖不达标问题', '小区违建问题'] },
    { department: '卫健委', clusters: ['医院挂号难问题'] },
    { department: '城管委', clusters: ['路面积水排水不畅', '市政设施损坏'] },
    { department: '公安局', clusters: ['医院挂号难问题', '广场舞噪音扰民', '地铁站外黑车运营'] },
    { department: '教委', clusters: ['学区划片争议'] },
  ],
  calibers: [
    {
      clusterName: '供暖不达标问题',
      caliber:
        '市住建局联合城管委已成立专项工作组，对全市供热企业开展拉网式排查，24小时内整改到位。',
    },
    {
      clusterName: '医院挂号难问题',
      caliber:
        '市卫健委要求各三甲医院专家号源增加20%，公安局严打号贩子，建议市民通过官方APP预约。',
    },
  ],
  remarks:
    '今日整体舆情态势平稳，供暖和医疗两类民生话题升温明显，建议各相关部门加快处置节奏，及时回应社会关切。早会重点汇报TOP3议题及责任分工。',
};

interface AnalysisState {
  records: AnalysisRecord[];
  selectedRecordId: string | null;
  dailySummary: DailySummary;
  isSummaryModalOpen: boolean;
  draftRecord: Partial<AnalysisRecord> | null;
  sortBy: 'priority' | 'urgency' | 'assignedAt';
  filterStatus: Array<AnalysisRecord['status']>;
}

interface AnalysisActions {
  getRecordById: (id: string) => AnalysisRecord | undefined;
  getRecordByClusterId: (clusterId: string) => AnalysisRecord | undefined;
  selectRecord: (id: string | null) => void;
  createDraft: (clusterId: string, clusterName: string) => void;
  updateDraft: (updates: Partial<AnalysisRecord>) => void;
  saveDraft: () => void;
  deleteDraft: () => void;
  submitRecord: (id: string) => void;
  approveRecord: (id: string) => void;
  dispatchRecord: (id: string) => void;
  updateRecord: (id: string, updates: Partial<AnalysisRecord>) => void;
  reorderRecords: (orderedIds: string[]) => void;
  generateDailySummary: () => void;
  openSummaryModal: () => void;
  closeSummaryModal: () => void;
  setSortBy: (sortBy: AnalysisState['sortBy']) => void;
  toggleStatusFilter: (status: AnalysisRecord['status']) => void;
  getSortedRecords: () => AnalysisRecord[];
  getPendingAnalysisCount: () => number;
}

export const useAnalysisStore = create<AnalysisState & AnalysisActions>((set, get) => ({
  records: mockAnalysisRecords,
  selectedRecordId: null,
  dailySummary: mockDailySummary,
  isSummaryModalOpen: false,
  draftRecord: null,
  sortBy: 'priority',
  filterStatus: [],

  getRecordById: (id) => get().records.find((r) => r.id === id),

  getRecordByClusterId: (clusterId) => get().records.find((r) => r.clusterId === clusterId),

  selectRecord: (id) => set({ selectedRecordId: id }),

  createDraft: (clusterId, clusterName) => {
    const maxPriority = get().records.reduce(
      (max, r) => (r.priority > max ? r.priority : max),
      0
    );
    set({
      draftRecord: {
        clusterId,
        clusterName,
        urgency: 'normal',
        departments: [],
        caliber: '',
        suggestion: '',
        status: 'draft',
        priority: maxPriority + 1,
      },
    });
  },

  updateDraft: (updates) =>
    set((state) => ({
      draftRecord: state.draftRecord ? { ...state.draftRecord, ...updates } : null,
    })),

  saveDraft: () => {
    const draft = get().draftRecord;
    if (!draft) return;
    const newRecord: AnalysisRecord = {
      id: `an${Date.now()}`,
      clusterId: draft.clusterId!,
      clusterName: draft.clusterName!,
      urgency: draft.urgency || 'normal',
      departments: draft.departments || [],
      caliber: draft.caliber || '',
      suggestion: draft.suggestion || '',
      assignedBy: '当前值班员',
      assignedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: draft.status || 'draft',
      priority: draft.priority || get().records.length + 1,
    };
    set((state) => ({
      records: [newRecord, ...state.records],
      draftRecord: null,
      selectedRecordId: newRecord.id,
    }));
  },

  deleteDraft: () => set({ draftRecord: null }),

  submitRecord: (id) =>
    set((state) => ({
      records: state.records.map((r) =>
        r.id === id
          ? { ...r, status: 'submitted', updatedAt: new Date().toISOString() }
          : r
      ),
    })),

  approveRecord: (id) =>
    set((state) => ({
      records: state.records.map((r) =>
        r.id === id
          ? { ...r, status: 'approved', updatedAt: new Date().toISOString() }
          : r
      ),
    })),

  dispatchRecord: (id) =>
    set((state) => ({
      records: state.records.map((r) =>
        r.id === id
          ? { ...r, status: 'dispatched', updatedAt: new Date().toISOString() }
          : r
      ),
    })),

  updateRecord: (id, updates) =>
    set((state) => ({
      records: state.records.map((r) =>
        r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r
      ),
    })),

  reorderRecords: (orderedIds) =>
    set((state) => ({
      records: state.records
        .map((r, idx) => {
          const newIdx = orderedIds.indexOf(r.id);
          return newIdx >= 0 ? { ...r, priority: newIdx + 1 } : r;
        })
        .sort((a, b) => a.priority - b.priority),
    })),

  generateDailySummary: () => {
    const records = get().records;
    const rising = records
      .filter((r) => ['submitted', 'approved'].includes(r.status))
      .slice(0, 3)
      .map((r) => ({
        clusterId: r.clusterId,
        clusterName: r.clusterName,
        urgency: r.urgency,
        newCount: Math.floor(Math.random() * 100),
        growthRate: Math.random() * 0.6,
        departments: r.departments
          .map((d) => DEPARTMENTS.find((dep) => dep.id === d)?.name)
          .filter(Boolean) as string[],
      }));

    const summary: DailySummary = {
      id: `ds${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      generatedAt: new Date().toISOString(),
      generatedBy: '当前值班员',
      risingTopics: rising,
      keyAppeals: [],
      responsibilities: [],
      calibers: [],
      remarks: '自动生成摘要，请人工审核后使用。',
    };
    set({ dailySummary: summary });
  },

  openSummaryModal: () => set({ isSummaryModalOpen: true }),

  closeSummaryModal: () => set({ isSummaryModalOpen: false }),

  setSortBy: (sortBy) => set({ sortBy }),

  toggleStatusFilter: (status) =>
    set((state) => ({
      filterStatus: state.filterStatus.includes(status)
        ? state.filterStatus.filter((s) => s !== status)
        : [...state.filterStatus, status],
    })),

  getSortedRecords: () => {
    const { records, sortBy, filterStatus } = get();
    let result = [...records];

    if (filterStatus.length > 0) {
      result = result.filter((r) => filterStatus.includes(r.status));
    }

    const urgencyOrder: Record<Urgency, number> = {
      critical: 4,
      urgent: 3,
      normal: 2,
      attention: 1,
    };

    result.sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          return a.priority - b.priority;
        case 'urgency':
          return urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
        case 'assignedAt':
          return new Date(b.assignedAt).getTime() - new Date(a.assignedAt).getTime();
        default:
          return 0;
      }
    });

    return result;
  },

  getPendingAnalysisCount: () => {
    const { records } = get();
    return records.filter((r) => r.status === 'draft' || r.status === 'submitted').length;
  },
}));
