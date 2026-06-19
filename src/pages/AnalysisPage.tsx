import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import ThemeList, { type ThemeListItem } from '@/components/analysis/ThemeList';
import AnalysisForm, { type AnalysisFormValues } from '@/components/analysis/AnalysisForm';
import SummaryPanel, {
  type SummaryData,
  type RisingTopic,
  type KeyAppeal,
  type ResponsibilityItem,
  type CaliberItem,
} from '@/components/analysis/SummaryPanel';
import { useClusterStore } from '@/store/useClusterStore';
import { useAnalysisStore, DEPARTMENTS } from '@/store/useAnalysisStore';
import { URGENCY_LEVELS } from '@/data/dictionaries';
import { cn } from '@/lib/utils';
import type { UrgencyLevel } from '@/types';

function mapUrgencyToLevel(urgency: string): UrgencyLevel {
  switch (urgency) {
    case 'critical':
      return 'special';
    case 'urgent':
      return 'urgent';
    case 'normal':
      return 'normal';
    case 'attention':
      return 'attention';
    default:
      return 'normal';
  }
}

function mapTrend(trend: string): 'rising' | 'stable' | 'declining' {
  switch (trend) {
    case 'up':
      return 'rising';
    case 'down':
      return 'declining';
    default:
      return 'stable';
  }
}

function getDepartmentName(id: string): string {
  return DEPARTMENTS.find((d) => d.id === id)?.name || id;
}

export default function AnalysisPage() {
  const { clusters, getClusterById } = useClusterStore();
  const {
    dailySummary,
    selectedRecordId,
    selectRecord,
    getRecordByClusterId,
    createDraft,
    updateDraft,
    draftRecord,
    saveDraft,
    submitRecord,
    records,
  } = useAnalysisStore();

  const [selectedThemeIds, setSelectedThemeIds] = useState<string[]>([]);
  const [checkedThemeIds, setCheckedThemeIds] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSummaryCollapsed, setIsSummaryCollapsed] = useState(false);

  const themeItems: ThemeListItem[] = useMemo(() => {
    return clusters.map((c) => {
      const urgencyLevel = mapUrgencyToLevel(c.urgency);
      const trend = 'trend' in c ? mapTrend((c as { trend?: string }).trend || 'stable') : undefined;
      return {
        id: c.id,
        title: c.name,
        newCount: c.newCount,
        totalCount: c.totalCount,
        urgencyLevel,
        trend,
      };
    });
  }, [clusters]);

  const selectedTheme = selectedThemeIds.length > 0 ? getClusterById(selectedThemeIds[0]) : null;

  const existingRecord = selectedTheme ? getRecordByClusterId(selectedTheme.id) : null;

  const formInitialValues: Partial<AnalysisFormValues> | undefined = useMemo(() => {
    if (existingRecord) {
      return {
        title: existingRecord.clusterName,
        urgencyLevel: mapUrgencyToLevel(existingRecord.urgency),
        assignedDepartments: existingRecord.departments,
        suggestedCaliber: existingRecord.caliber,
        disposalSuggestion: existingRecord.suggestion,
      };
    }
    if (draftRecord && selectedTheme) {
      return {
        title: draftRecord.clusterName || selectedTheme.name,
        urgencyLevel: mapUrgencyToLevel(draftRecord.urgency || selectedTheme.urgency),
        assignedDepartments: draftRecord.departments || [],
        suggestedCaliber: draftRecord.caliber || '',
        disposalSuggestion: draftRecord.suggestion || '',
      };
    }
    if (selectedTheme) {
      return {
        title: selectedTheme.name,
        urgencyLevel: mapUrgencyToLevel(selectedTheme.urgency),
        assignedDepartments: [],
        suggestedCaliber: '',
        disposalSuggestion: '',
      };
    }
    return undefined;
  }, [existingRecord, draftRecord, selectedTheme]);

  const summaryData: SummaryData = useMemo(() => {
    const risingTopics: RisingTopic[] = dailySummary.risingTopics.map((t) => ({
      id: t.clusterId,
      title: t.clusterName,
      urgencyLevel: mapUrgencyToLevel(t.urgency),
      newCount: t.newCount,
      growthRate: t.growthRate,
      departments: t.departments,
    }));

    const keyAppeals: KeyAppeal[] = dailySummary.keyAppeals.map((a, idx) => ({
      id: `ka-${idx}`,
      title: a.title,
      region: a.region,
      sentiment: (a.sentiment === '正面'
        ? 'positive'
        : a.sentiment === '负面'
          ? 'negative'
          : 'neutral') as 'positive' | 'neutral' | 'negative',
      summary: a.summary,
    }));

    const responsibilities: ResponsibilityItem[] = dailySummary.responsibilities.map((r) => ({
      department: r.department,
      topics: r.clusters,
    }));

    const calibers: CaliberItem[] = dailySummary.calibers.map((c) => ({
      topicTitle: c.clusterName,
      caliber: c.caliber,
    }));

    return {
      title: '舆情研判值班摘要',
      date: dailySummary.date,
      generatedAt: dailySummary.generatedAt,
      generatedBy: dailySummary.generatedBy,
      risingTopics,
      keyAppeals,
      responsibilities,
      calibers,
      remarks: dailySummary.remarks,
    };
  }, [dailySummary]);

  const handleThemeSelect = (id: string) => {
    setSelectedThemeIds((prev) => {
      const isSelected = prev.includes(id);
      if (isSelected) {
        selectRecord(null);
        return [];
      }
      const record = getRecordByClusterId(id);
      if (record) {
        selectRecord(record.id);
      } else {
        const cluster = getClusterById(id);
        if (cluster) {
          createDraft(id, cluster.name);
        }
        selectRecord(null);
      }
      return [id];
    });
  };

  const handleToggleCheck = (id: string) => {
    setCheckedThemeIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSave = async (values: AnalysisFormValues) => {
    if (!selectedTheme) return;
    setIsSaving(true);
    const departments = values.assignedDepartments;
    updateDraft({
      clusterId: selectedTheme.id,
      clusterName: values.title,
      urgency: values.urgencyLevel === 'special' ? 'critical' : values.urgencyLevel,
      departments,
      caliber: values.suggestedCaliber,
      suggestion: values.disposalSuggestion,
    });
    saveDraft();
    setTimeout(() => setIsSaving(false), 500);
  };

  const handleSubmit = async (values: AnalysisFormValues) => {
    if (!selectedTheme) return;
    setIsSubmitting(true);
    handleSave(values);
    setTimeout(() => {
      const draft = records.find(
        (r) => r.clusterId === selectedTheme.id && r.status === 'draft'
      );
      if (draft) {
        submitRecord(draft.id);
      }
      setIsSubmitting(false);
    }, 800);
  };

  const urgencyInfo = URGENCY_LEVELS.find(
    (u) => u.value === formInitialValues?.urgencyLevel
  );

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Topbar />
        <main className="flex-1 flex overflow-hidden bg-background">
          <ThemeList
            items={themeItems}
            selectedIds={selectedThemeIds}
            onSelect={handleThemeSelect}
            onToggleCheck={handleToggleCheck}
            checkedIds={checkedThemeIds}
          />

          <div className="flex-1 p-5 min-w-0 overflow-hidden">
            <AnalysisForm
              initialValues={formInitialValues}
              onSave={handleSave}
              onSubmit={handleSubmit}
              isSaving={isSaving}
              isSubmitting={isSubmitting}
              disabled={!selectedTheme}
              className="h-full"
            />
          </div>

          <div
            className={cn(
              'relative flex-shrink-0 transition-all duration-300 ease-in-out',
              isSummaryCollapsed ? 'w-0' : 'w-[420px] pr-5 py-5'
            )}
          >
            {!isSummaryCollapsed && (
              <div className="h-full w-full">
                {urgencyInfo && selectedTheme && (
                  <div
                    className="mb-3 px-3 py-2 rounded-sm border text-xs flex items-center gap-2"
                    style={{
                      backgroundColor: `${urgencyInfo.color}15`,
                      borderColor: `${urgencyInfo.color}40`,
                      color: urgencyInfo.color,
                    }}
                  >
                    <FileText className="w-3.5 h-3.5" strokeWidth={2} />
                    <span className="font-medium">正在研判：{selectedTheme.name}</span>
                  </div>
                )}
                <SummaryPanel data={summaryData} />
              </div>
            )}

            <button
              type="button"
              onClick={() => setIsSummaryCollapsed(!isSummaryCollapsed)}
              className={cn(
                'absolute top-1/2 -translate-y-1/2 z-20',
                'w-5 h-16 rounded-l-sm border border-r-0 border-neutral-700',
                'bg-background-light text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800',
                'flex items-center justify-center transition-colors',
                isSummaryCollapsed ? 'left-0' : 'left-0'
              )}
              title={isSummaryCollapsed ? '展开摘要面板' : '折叠摘要面板'}
            >
              {isSummaryCollapsed ? (
                <ChevronLeft className="w-3.5 h-3.5" strokeWidth={2.5} />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" strokeWidth={2.5} />
              )}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
