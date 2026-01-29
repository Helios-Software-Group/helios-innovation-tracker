import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface FilterState {
  // Sidebar state
  sidebarCollapsed: boolean

  // Opportunity filters
  opportunityMode: 'all' | 'select'
  selectedOpportunityIds: string[]

  // Company filters
  companyMode: 'all' | 'select'
  selectedCompanyIds: string[]

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
}

export const useFilterStore = create<FilterState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      opportunityMode: 'all',
      selectedOpportunityIds: [],
      companyMode: 'all',
      selectedCompanyIds: [],

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
    }),
    { name: 'hic-tracker-filters' }
  )
)
