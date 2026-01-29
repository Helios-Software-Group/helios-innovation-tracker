import { Header } from '@/components/layout/header'
import { SidebarFilters } from '@/components/layout/sidebar-filters'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex">
        <SidebarFilters />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
