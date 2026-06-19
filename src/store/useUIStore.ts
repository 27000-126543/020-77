import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type PageRoute = 'appeals' | 'clusters' | 'analysis';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
  duration: number;
}

export interface ConfirmDialog {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  danger?: boolean;
}

interface UIState {
  currentPage: PageRoute;
  isSidebarCollapsed: boolean;
  isDetailPanelOpen: boolean;
  theme: 'dark' | 'light';
  activeDetailType: 'appeal' | 'cluster' | null;
  activeDetailId: string | null;
  toasts: Toast[];
  confirmDialog: ConfirmDialog;
  isLoading: boolean;
  loadingText: string;
  dataLastUpdated: string;
  lastRefreshTime: string;
  autoRefresh: boolean;
  refreshInterval: number;
  viewportWidth: number;
  isMobile: boolean;
  filterPanelExpanded: boolean;
  selectedAppealIds: string[];
  selectMode: boolean;
}

interface UIActions {
  setCurrentPage: (page: PageRoute) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  openDetailPanel: (type: 'appeal' | 'cluster', id: string) => void;
  closeDetailPanel: () => void;
  toggleTheme: () => void;
  setTheme: (theme: UIState['theme']) => void;
  addToast: (toast: Omit<Toast, 'id' | 'duration'> & { duration?: number }) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
  openConfirmDialog: (dialog: Omit<ConfirmDialog, 'isOpen'>) => void;
  closeConfirmDialog: () => void;
  setLoading: (loading: boolean, text?: string) => void;
  refreshData: () => void;
  setAutoRefresh: (enabled: boolean) => void;
  setRefreshInterval: (interval: number) => void;
  setViewportWidth: (width: number) => void;
  toggleFilterPanel: () => void;
  setFilterPanelExpanded: (expanded: boolean) => void;
  toggleSelectMode: () => void;
  toggleAppealSelection: (id: string) => void;
  bulkSelectAppeals: (ids: string[], select: boolean) => void;
  clearSelection: () => void;
  selectAllAppeals: (ids: string[]) => void;
}

const defaultConfirmDialog: ConfirmDialog = {
  isOpen: false,
  title: '',
  message: '',
  confirmText: '确认',
  cancelText: '取消',
  danger: false,
};

export const useUIStore = create<UIState & UIActions>()(
  persist(
    (set, get) => ({
      currentPage: 'appeals',
      isSidebarCollapsed: false,
      isDetailPanelOpen: false,
      theme: 'dark',
      activeDetailType: null,
      activeDetailId: null,
      toasts: [],
      confirmDialog: defaultConfirmDialog,
      isLoading: false,
      loadingText: '加载中...',
      dataLastUpdated: new Date().toISOString(),
      lastRefreshTime: new Date().toISOString(),
      autoRefresh: true,
      refreshInterval: 60000,
      viewportWidth: typeof window !== 'undefined' ? window.innerWidth : 1920,
      isMobile: false,
      filterPanelExpanded: true,
      selectedAppealIds: [],
      selectMode: false,

      setCurrentPage: (page) => {
        set({ currentPage: page });
        if (page !== 'appeals') {
          set({ selectedAppealIds: [], selectMode: false });
        }
      },

      toggleSidebar: () =>
        set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),

      setSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),

      openDetailPanel: (type, id) =>
        set({
          isDetailPanelOpen: true,
          activeDetailType: type,
          activeDetailId: id,
        }),

      closeDetailPanel: () =>
        set({
          isDetailPanelOpen: false,
          activeDetailType: null,
          activeDetailId: null,
        }),

      toggleTheme: () =>
        set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),

      setTheme: (theme) => set({ theme }),

      addToast: (toast) => {
        const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
        const duration = toast.duration ?? 3000;
        set((state) => ({
          toasts: [...state.toasts, { ...toast, id, duration }],
        }));
        if (duration > 0) {
          setTimeout(() => {
            get().removeToast(id);
          }, duration);
        }
      },

      removeToast: (id) =>
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        })),

      clearToasts: () => set({ toasts: [] }),

      openConfirmDialog: (dialog) =>
        set({
          confirmDialog: {
            ...defaultConfirmDialog,
            ...dialog,
            isOpen: true,
          },
        }),

      closeConfirmDialog: () =>
        set((state) => ({
          confirmDialog: {
            ...state.confirmDialog,
            isOpen: false,
          },
        })),

      setLoading: (loading, text) =>
        set({
          isLoading: loading,
          loadingText: text ?? '加载中...',
        }),

      refreshData: () => {
        set({ isLoading: true, loadingText: '正在刷新数据...' });
        setTimeout(() => {
          set({
            isLoading: false,
            lastRefreshTime: new Date().toISOString(),
            dataLastUpdated: new Date().toISOString(),
          });
          get().addToast({
            type: 'success',
            title: '数据已更新',
            description: '最新数据已加载完成',
            duration: 2000,
          });
        }, 800);
      },

      setAutoRefresh: (enabled) => set({ autoRefresh: enabled }),

      setRefreshInterval: (interval) => set({ refreshInterval: interval }),

      setViewportWidth: (width) =>
        set({
          viewportWidth: width,
          isMobile: width < 1024,
        }),

      toggleFilterPanel: () =>
        set((state) => ({ filterPanelExpanded: !state.filterPanelExpanded })),

      setFilterPanelExpanded: (expanded) => set({ filterPanelExpanded: expanded }),

      toggleSelectMode: () =>
        set((state) => ({
          selectMode: !state.selectMode,
          selectedAppealIds: state.selectMode ? [] : state.selectedAppealIds,
        })),

      toggleAppealSelection: (id) =>
        set((state) => ({
          selectedAppealIds: state.selectedAppealIds.includes(id)
            ? state.selectedAppealIds.filter((i) => i !== id)
            : [...state.selectedAppealIds, id],
        })),

      bulkSelectAppeals: (ids, select) =>
        set((state) => ({
          selectedAppealIds: select
            ? Array.from(new Set([...state.selectedAppealIds, ...ids]))
            : state.selectedAppealIds.filter((i) => !ids.includes(i)),
        })),

      clearSelection: () => set({ selectedAppealIds: [] }),

      selectAllAppeals: (ids) => set({ selectedAppealIds: [...ids] }),
    }),
    {
      name: 'ui-store',
      partialize: (state) => ({
        isSidebarCollapsed: state.isSidebarCollapsed,
        theme: state.theme,
        autoRefresh: state.autoRefresh,
        refreshInterval: state.refreshInterval,
        filterPanelExpanded: state.filterPanelExpanded,
      }),
    }
  )
);
