import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { DashboardState, Filters, Alert, Proposal, Metrics, Benchmarks } from '@/types/proposals'

interface StoreActions {
  setProposals: (proposals: Proposal[]) => void
  setFilters: (filters: Partial<Filters>) => void
  resetFilters: () => void
  setMetrics: (metrics: Metrics) => void
  setBenchmarks: (benchmarks: Benchmarks[]) => void
  setIsLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  addAlert: (alert: Omit<Alert, 'id' | 'timestamp'>) => void
  removeAlert: (alertIndex: number) => void
  clearAlerts: () => void
  toggleDarkMode: () => void
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
}

const initialFilters: Filters = {
  agencies: [],
  portfolios: [],
  statuses: [],
  managers: [],
  dateRange: { start: null, end: null },
  valueRange: { min: null, max: null },
  daysRange: { min: null, max: null },
  searchTerm: '',
}

const initialDashboardState: DashboardState = {
  proposals: [],
  filters: initialFilters,
  metrics: null,
  benchmarks: null,
  isLoading: false,
  error: null,
  alerts: [],
  isDarkMode: false,
  sidebarCollapsed: false,
}

export const useStore = create<DashboardState & StoreActions>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialDashboardState,

        setProposals: (proposals) =>
          set({ proposals }, false, 'setProposals'),

        setFilters: (newFilters) => {
          const currentFilters = get().filters
          const updatedFilters = { ...currentFilters, ...newFilters }
          set({ filters: updatedFilters }, false, 'setFilters')
        },

        resetFilters: () =>
          set({ filters: initialFilters }, false, 'resetFilters'),

        setMetrics: (metrics) =>
          set({ metrics }, false, 'setMetrics'),

        setBenchmarks: (benchmarks) =>
          set({ benchmarks }, false, 'setBenchmarks'),

        setIsLoading: (isLoading) =>
          set({ isLoading }, false, 'setIsLoading'),

        setError: (error) =>
          set({ error }, false, 'setError'),

        addAlert: (alert) => {
          const newAlert: Alert = {
            ...alert,
            id: `alert-${Date.now()}`,
            timestamp: new Date(),
          }
          set(
            (state) => ({
              alerts: [...state.alerts, newAlert].slice(-5), // Keep only last 5 alerts
            }),
            false,
            'addAlert'
          )
        },

        removeAlert: (alertIndex) =>
          set(
            (state) => ({
              alerts: state.alerts.filter((_, index) => index !== alertIndex),
            }),
            false,
            'removeAlert'
          ),

        clearAlerts: () =>
          set({ alerts: [] }, false, 'clearAlerts'),

        toggleDarkMode: () => {
          const currentMode = get().isDarkMode
          const newMode = !currentMode
          set({ isDarkMode: newMode }, false, 'toggleDarkMode')
          
          if (newMode) {
            document.documentElement.classList.add('dark')
          } else {
            document.documentElement.classList.remove('dark')
          }
        },

        toggleSidebar: () => {
          const currentState = get().sidebarCollapsed
          set({ sidebarCollapsed: !currentState }, false, 'toggleSidebar')
        },

        setSidebarCollapsed: (sidebarCollapsed) =>
          set({ sidebarCollapsed }, false, 'setSidebarCollapsed'),
      }),
      {
        name: 'projetta2-dashboard',
        partialize: (state) => ({
          filters: state.filters,
          isDarkMode: state.isDarkMode,
          sidebarCollapsed: state.sidebarCollapsed,
        }),
      }
    ),
    { name: 'Projetta2DashboardStore' }
  )
)

// Selector hooks for better performance
export const useProposals = () => useStore((state) => state.proposals)
export const useFilters = () => useStore((state) => state.filters)
export const useMetrics = () => useStore((state) => state.metrics)
export const useBenchmarks = () => useStore((state) => state.benchmarks)
export const useIsLoading = () => useStore((state) => state.isLoading)
export const useError = () => useStore((state) => state.error)
export const useAlerts = () => useStore((state) => state.alerts)
export const useIsDarkMode = () => useStore((state) => state.isDarkMode)
export const useSidebarCollapsed = () => useStore((state) => state.sidebarCollapsed)

// Action hooks
export const useStoreActions = () => ({
  setProposals: useStore((state) => state.setProposals),
  setFilters: useStore((state) => state.setFilters),
  resetFilters: useStore((state) => state.resetFilters),
  setMetrics: useStore((state) => state.setMetrics),
  setBenchmarks: useStore((state) => state.setBenchmarks),
  setIsLoading: useStore((state) => state.setIsLoading),
  setError: useStore((state) => state.setError),
  addAlert: useStore((state) => state.addAlert),
  removeAlert: useStore((state) => state.removeAlert),
  clearAlerts: useStore((state) => state.clearAlerts),
  toggleDarkMode: useStore((state) => state.toggleDarkMode),
  toggleSidebar: useStore((state) => state.toggleSidebar),
  setSidebarCollapsed: useStore((state) => state.setSidebarCollapsed),
})

// Individual action hooks
export const useToggleDarkMode = () => useStore((state) => state.toggleDarkMode)
export const useToggleSidebar = () => useStore((state) => state.toggleSidebar)

// Additional hooks needed by components
export const useSetFilters = () => useStore((state) => state.setFilters)
export const useResetFilters = () => useStore((state) => state.resetFilters)
export const useRemoveAlert = () => useStore((state) => state.removeAlert)