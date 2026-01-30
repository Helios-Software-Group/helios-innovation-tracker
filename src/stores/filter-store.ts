import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Default column widths for the table
export const DEFAULT_COLUMN_WIDTHS: Record<string, number> = {
  expand: 24,
  phase: 55,
  company: 70,
  name: 120,
  som: 50,
  status: 85,
  m: 45,
  c: 50,
  p: 48,
  s: 48,
  nextSteps: 100,
  demo: 50,
  files: 50,
  target: 55,
  delete: 28,
}

interface FilterState {
  // Sidebar state
  sidebarCollapsed: boolean

  // Opportunity filters
  opportunityMode: 'all' | 'select'
  selectedOpportunityIds: string[]

  // Company filters
  companyMode: 'all' | 'select'
  selectedCompanyIds: string[]

  // Table column widths
  columnWidths: Record<string, number>

  // Actions
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  setOpportunityMode: (mode: 'all' | 'select') => void
  toggleOpportunity: (id: string) => void
  setSelectedOpportunities: (ids: string[]) => void
  setCompanyMode: (mode: 'all' | 'select') => void
  toggleCompany: (id: string) => void
  setSelectedCompanies: (ids: string[]) => void
  clearFilters: () => void
  setColumnWidth: (column: string, width: number) => void
  resetColumnWidths: () => void
}

export const useFilterStore = create<FilterState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      opportunityMode: 'all',
      selectedOpportunityIds: [],
      companyMode: 'all',
      selectedCompanyIds: [],
      columnWidths: { ...DEFAULT_COLUMN_WIDTHS },

      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      setOpportunityMode: (mode) => set({ opportunityMode: mode }),
      toggleOpportunity: (id) => set((state) => ({
        selectedOpportunityIds: state.selectedOpportunityIds.includes(id)
          ? state.selectedOpportunityIds.filter((i) => i !== id)
          : [...state.selectedOpportunityIds, id],
      })),
      setSelectedOpportunities: (ids) => set({ selectedOpportunityIds: ids }),
      setCompanyMode: (mode) => set({ companyMode: mode }),
      toggleCompany: (id) => set((state) => ({
        selectedCompanyIds: state.selectedCompanyIds.includes(id)
          ? state.selectedCompanyIds.filter((i) => i !== id)
          : [...state.selectedCompanyIds, id],
      })),
      setSelectedCompanies: (ids) => set({ selectedCompanyIds: ids }),
      clearFilters: () => set({
        opportunityMode: 'all',
        selectedOpportunityIds: [],
        companyMode: 'all',
        selectedCompanyIds: [],
      }),
      setColumnWidth: (column, width) => set((state) => ({
        columnWidths: { ...state.columnWidths, [column]: Math.max(20, width) },
      })),
      resetColumnWidths: () => set({ columnWidths: { ...DEFAULT_COLUMN_WIDTHS } }),
    }),
    { name: 'hic-tracker-filters' }
  )
)
