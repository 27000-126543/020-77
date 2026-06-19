import { create } from 'zustand';
import { DEPARTMENTS, DEPT_SHORT_NAMES } from '@/data/dictionaries';
import type { Urgency } from '../utils/formatters';
import type { Cluster } from './useClusterStore';

export { DEPARTMENTS };

export interface DepartmentInfo {
  id: string;
  name: string;
  shortName: string;
  category: string;
}

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
    departmentId: string;
    clusters: string[];
  }>;
  calibers: Array<{
    clusterName: string;
    clusterId: string;
    caliber: string;
  }>;
  remarks: string;
}

function hoursAgo(h: number): string {
  return new Date(Date.now() - h * 60 * 60 * 1000).toISOString();
}

const mockAnalysisRecords: AnalysisRecord[] = [
  {
    id: 'an001',
    clusterId: 'c001',
    clusterName: '供暖不达标问题',
    urgency: 'critical',
    departments: ['dept_08', 'dept_04', 'dept_02'],
    caliber:
      '针对近期部分市民反映的供暖温度不达标问题，市住建局联合城管委已成立专项工作组，对全市供热企业开展拉网式排查。对排查中发现的问题，责令企业24小时内整改到位，整改不力的将依法依规严肃处理。市民如有供暖问题，可拨打12345热线，我们将第一时间响应处置。',
    suggestion:
      '1. 住建局牵头，要求各供热企业提交整改方案并限期落实；\n2. 对涉事小区逐户测温，建立温度台账；\n3. 12345热线增派坐席，专项受理供暖诉求；\n4. 约谈XX供热公司主要负责人，启动应急供热预案。',
    assignedBy: '张值班长',
    assignedAt: hoursAgo(4),
    updatedAt: hoursAgo(1),
    status: 'submitted',
    priority: 1,
  },
  {
    id: 'an002',
    clusterId: 'c008',
    clusterName: '医院挂号难问题',
    urgency: 'critical',
    departments: ['dept_10', 'dept_03'],
    caliber:
      '关于部分医院挂号难的问题，市卫健委已启动新一轮号源扩容工作，要求各三甲医院专家号源在现有基础上增加20%，同时严厉打击号贩子倒号行为。市公安局已组织专项行动，在重点医院周边开展巡查整治。建议市民优先通过官方APP预约挂号，共同维护良好就医秩序。',
    suggestion:
      '1. 卫健委督促各医院优化号源分配，向普通号倾斜；\n2. 公安局在重点医院部署便衣警力，严打黄牛倒号；\n3. 推进电子健康码互通，减少排队时间；\n4. 加强社区医院首诊制度引导。',
    assignedBy: '张值班长',
    assignedAt: hoursAgo(5),
    updatedAt: hoursAgo(2),
    status: 'submitted',
    priority: 2,
  },
  {
    id: 'an003',
    clusterId: 'c003',
    clusterName: '广场舞噪音扰民',
    urgency: 'urgent',
    departments: ['dept_03', 'dept_04', 'dept_12'],
    caliber:
      '针对广场舞噪音扰民问题，多部门将联合开展专项整治：一是合理划定公园广场活动区域，设定噪音限值和活动时段；二是为广场舞队伍配发定向音箱，降低噪音外溢；三是加强社区劝导，引导市民文明健身，兼顾他人休息权益。',
    suggestion:
      '1. 城管委联合公安开展噪音监测专项行动；\n2. 园林绿化部门在公园内划定专门活动区；\n3. 试点推广定向音响设备，由街道统一采购配发；\n4. 社区建立广场舞自治公约。',
    assignedBy: '李副值班长',
    assignedAt: hoursAgo(27),
    updatedAt: hoursAgo(6),
    status: 'approved',
    priority: 3,
  },
  {
    id: 'an004',
    clusterId: 'c004',
    clusterName: '学区划片争议',
    urgency: 'urgent',
    departments: ['dept_11'],
    caliber:
      '关于义务教育阶段学区划片问题，市教委严格按照"就近入学"原则，综合考虑学校布局、学位供给、人口分布等因素科学划定。对今年划片调整的区域，教委已组织多场政策说明会，确保家长知情权。如仍有疑问，可到区教委招生办现场咨询。',
    suggestion:
      '1. 教委发布详细划片说明及政策依据；\n2. 各涉及区教委开设政策咨询专窗；\n3. 提前公示明年学位预警信息；\n4. 研究集团化办学扩容方案。',
    assignedBy: '李副值班长',
    assignedAt: hoursAgo(30),
    updatedAt: hoursAgo(26),
    status: 'dispatched',
    priority: 4,
  },
  {
    id: 'an005',
    clusterId: 'c002',
    clusterName: '路面积水排水不畅',
    urgency: 'urgent',
    departments: ['dept_04', 'dept_08'],
    caliber:
      '针对汛期部分路段积水问题，市城管委已启动排水管网清淤专项工程，对全市易积水点逐一建立台账，汛期前完成全部清淤疏通工作。同时完善积水监测预警系统，遇强降雨时第一时间发布预警信息，保障市民出行安全。',
    suggestion:
      '1. 城管委牵头完成排水管网清淤；\n2. 水务局对易积水路段增设排水泵站；\n3. 在积水点设置警示标志；\n4. 建立汛期巡查值守机制。',
    assignedBy: '王研判员',
    assignedAt: hoursAgo(50),
    updatedAt: hoursAgo(32),
    status: 'dispatched',
    priority: 5,
  },
  {
    id: 'an006',
    clusterId: 'c005',
    clusterName: '地铁站外黑车运营',
    urgency: 'normal',
    departments: ['dept_09', 'dept_03'],
    caliber:
      '针对地铁站外黑车非法运营问题，交通执法部门已持续开展"打非治违"专项行动。通过增设监控探头、安排便衣蹲守、加大处罚力度等措施，黑车运营现象已明显减少。市民如遇黑车揽客，可保存证据并拨打交通服务监督电话举报。',
    suggestion:
      '1. 交通执法总队加密重点地铁站执法频次；\n2. 优化地铁口公交线路接驳，减少黑车生存空间；\n3. 联合公安开展非法营运车辆集中查处；\n4. 在地铁口设置正规网约车候客区。',
    assignedBy: '王研判员',
    assignedAt: hoursAgo(56),
    updatedAt: hoursAgo(51),
    status: 'dispatched',
    priority: 6,
  },
  {
    id: 'an007',
    clusterId: 'c007',
    clusterName: '市政设施损坏',
    urgency: 'attention',
    departments: ['dept_04'],
    caliber:
      '感谢市民对市政设施的关注与监督。我委已建立市政设施巡查抢修快速响应机制，接到报修后城区4小时内到场处置，郊区8小时内到场。市民发现路灯、井盖等设施损坏，可通过12345热线或城市管理APP上报，我们将第一时间处理。',
    suggestion:
      '1. 城管委建立市政设施网格化巡查制度；\n2. 对全市路灯进行一次全面检修；\n3. 在易损坏路段增设警示标识；\n4. 推广市民上报奖励机制。',
    assignedBy: '王研判员',
    assignedAt: hoursAgo(76),
    updatedAt: hoursAgo(58),
    status: 'dispatched',
    priority: 7,
  },
];

function buildResponsibilities(records: AnalysisRecord[]): DailySummary['responsibilities'] {
  const map = new Map<string, { deptId: string; clusters: string[] }>();
  records
    .filter((r) => r.status !== 'draft' && r.departments.length > 0)
    .forEach((r) => {
      r.departments.forEach((deptId) => {
        if (!map.has(deptId)) {
          map.set(deptId, { deptId, clusters: [] });
        }
        map.get(deptId)!.clusters.push(r.clusterName);
      });
    });
  return Array.from(map.entries()).map(([deptId, info]) => ({
    departmentId: deptId,
    department: DEPT_SHORT_NAMES[deptId] || deptId,
    clusters: info.clusters,
  }));
}

function buildRisingTopics(
  records: AnalysisRecord[],
  clusters: Cluster[]
): DailySummary['risingTopics'] {
  return records
    .filter((r) => ['submitted', 'approved'].includes(r.status))
    .slice(0, 3)
    .map((r) => {
      const cluster = clusters.find((c) => c.id === r.clusterId);
      return {
        clusterId: r.clusterId,
        clusterName: r.clusterName,
        urgency: r.urgency,
        newCount: cluster?.newCount || Math.floor(Math.random() * 90 + 10),
        growthRate: cluster?.growthRate || Math.random() * 0.5 + 0.1,
        departments: r.departments
          .map((d) => DEPT_SHORT_NAMES[d] || d)
          .filter(Boolean),
      };
    });
}

function buildCalibers(records: AnalysisRecord[]): DailySummary['calibers'] {
  return records
    .filter((r) => r.caliber && r.caliber.trim().length > 0 && r.status !== 'draft')
    .map((r) => ({
      clusterName: r.clusterName,
      clusterId: r.clusterId,
      caliber: r.caliber,
    }))
    .slice(0, 6);
}

function buildKeyAppeals(clusters: Cluster[]): DailySummary['keyAppeals'] {
  return clusters
    .filter((c) => c.primarySentiment === 'negative')
    .slice(0, 4)
    .map((c) => ({
      title: c.representativePosts[0]?.title || c.name,
      region: c.regions.join('、'),
      sentiment:
        c.primarySentiment === 'positive'
          ? '正面'
          : c.primarySentiment === 'negative'
            ? '负面'
            : '中性',
      summary: c.representativePosts[0]?.content?.slice(0, 80) || c.name,
    }));
}

function buildMockDailySummary(
  records: AnalysisRecord[],
  clusters: Cluster[]
): DailySummary {
  return {
    id: `ds${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    generatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    generatedBy: '张值班长',
    risingTopics: buildRisingTopics(records, clusters),
    keyAppeals: buildKeyAppeals(clusters),
    responsibilities: buildResponsibilities(records),
    calibers: buildCalibers(records),
    remarks:
      '今日整体舆情态势平稳，供暖和医疗两类民生话题升温明显，建议各相关部门加快处置节奏，及时回应社会关切。早会重点汇报TOP3议题及责任分工。',
  };
}

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
  generateDailySummary: (clusters: Cluster[]) => void;
  openSummaryModal: () => void;
  closeSummaryModal: () => void;
  setSortBy: (sortBy: AnalysisState['sortBy']) => void;
  toggleStatusFilter: (status: AnalysisRecord['status']) => void;
  getSortedRecords: () => AnalysisRecord[];
  getPendingAnalysisCount: () => number;
}

const urgencyOrder: Record<Urgency, number> = {
  critical: 4,
  urgent: 3,
  normal: 2,
  attention: 1,
};

export const useAnalysisStore = create<AnalysisState & AnalysisActions>((set, get) => ({
  records: mockAnalysisRecords,
  selectedRecordId: null,
  dailySummary: buildMockDailySummary(mockAnalysisRecords, []),
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
    const { draftRecord, records } = get();
    if (!draftRecord || !draftRecord.clusterId) return;

    let newRecords: AnalysisRecord[];
    let newRecordId: string;
    const now = new Date().toISOString();

    const existingIdx = records.findIndex((r) => r.clusterId === draftRecord.clusterId);
    if (existingIdx >= 0) {
      const existing = records[existingIdx];
      const updated: AnalysisRecord = {
        ...existing,
        urgency: draftRecord.urgency || existing.urgency,
        departments: draftRecord.departments || existing.departments,
        caliber: draftRecord.caliber ?? existing.caliber,
        suggestion: draftRecord.suggestion ?? existing.suggestion,
        status: draftRecord.status === 'draft' ? 'draft' : existing.status,
        updatedAt: now,
      };
      newRecords = [...records];
      newRecords[existingIdx] = updated;
      newRecordId = updated.id;
    } else {
      const newRecord: AnalysisRecord = {
        id: `an${Date.now()}`,
        clusterId: draftRecord.clusterId!,
        clusterName: draftRecord.clusterName!,
        urgency: draftRecord.urgency || 'normal',
        departments: draftRecord.departments || [],
        caliber: draftRecord.caliber || '',
        suggestion: draftRecord.suggestion || '',
        assignedBy: '当前值班员',
        assignedAt: now,
        updatedAt: now,
        status: draftRecord.status === 'draft' ? 'draft' : 'submitted',
        priority: draftRecord.priority || records.length + 1,
      };
      newRecords = [newRecord, ...records];
      newRecordId = newRecord.id;
    }

    set((state) => ({
      records: newRecords,
      draftRecord: null,
      selectedRecordId: newRecordId,
      dailySummary: buildMockDailySummary(
        newRecords,
        state.dailySummary.risingTopics.map(
          () => ({} as Cluster)
        ) as unknown as Cluster[]
      ),
    }));
  },

  deleteDraft: () => set({ draftRecord: null }),

  submitRecord: (id) => {
    const updatedRecords = get().records.map((r) =>
      r.id === id ? { ...r, status: 'submitted' as const, updatedAt: new Date().toISOString() } : r
    );
    const state = get();
    set({
      records: updatedRecords,
      dailySummary: buildMockDailySummary(
        updatedRecords,
        state.dailySummary.risingTopics.map(() => ({} as Cluster)) as Cluster[]
      ),
    });
  },

  approveRecord: (id) => {
    const updatedRecords = get().records.map((r) =>
      r.id === id ? { ...r, status: 'approved' as const, updatedAt: new Date().toISOString() } : r
    );
    const state = get();
    set({
      records: updatedRecords,
      dailySummary: buildMockDailySummary(
        updatedRecords,
        state.dailySummary.risingTopics.map(() => ({} as Cluster)) as Cluster[]
      ),
    });
  },

  dispatchRecord: (id) => {
    const updatedRecords = get().records.map((r) =>
      r.id === id ? { ...r, status: 'dispatched' as const, updatedAt: new Date().toISOString() } : r
    );
    const state = get();
    set({
      records: updatedRecords,
      dailySummary: buildMockDailySummary(
        updatedRecords,
        state.dailySummary.risingTopics.map(() => ({} as Cluster)) as Cluster[]
      ),
    });
  },

  updateRecord: (id, updates) => {
    const updatedRecords = get().records.map((r) =>
      r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r
    );
    const state = get();
    set({
      records: updatedRecords,
      dailySummary: buildMockDailySummary(
        updatedRecords,
        state.dailySummary.risingTopics.map(() => ({} as Cluster)) as Cluster[]
      ),
    });
  },

  reorderRecords: (orderedIds) =>
    set((state) => ({
      records: state.records
        .map((r, idx) => {
          const newIdx = orderedIds.indexOf(r.id);
          return newIdx >= 0 ? { ...r, priority: newIdx + 1 } : r;
        })
        .sort((a, b) => a.priority - b.priority),
    })),

  generateDailySummary: (clusters) => {
    const { records } = get();
    const summary: DailySummary = {
      id: `ds${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      generatedAt: new Date().toISOString(),
      generatedBy: '当前值班员',
      risingTopics: buildRisingTopics(records, clusters),
      keyAppeals: buildKeyAppeals(clusters),
      responsibilities: buildResponsibilities(records),
      calibers: buildCalibers(records),
      remarks:
        records.filter((r) => r.urgency === 'critical' || r.urgency === 'urgent').length > 0
          ? `当前有 ${records.filter((r) => r.urgency === 'critical').length} 个特急议题、${records.filter((r) => r.urgency === 'urgent').length} 个紧急议题正在处置，建议各责任部门加快响应节奏。`
          : '今日整体舆情态势平稳，暂无高紧急度议题。请持续关注各平台动态。',
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
