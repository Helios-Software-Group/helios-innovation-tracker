'use client'

import { useOpportunities } from '@/hooks/use-opportunities'
import { TableView } from '@/components/dashboard/table-view'
import { OpportunityModal } from '@/components/dashboard/opportunity-modal'
import { Button } from '@/components/ui/button'
import { Plus, RefreshCw } from 'lucide-react'
import { useState } from 'react'

export default function TablePage() {
  const { opportunities, companies, loading, error, refetch } = useOpportunities()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleCreateNew = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">{error}</p>
        <Button variant="outline" size="sm" onClick={refetch} className="mt-2">
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">AI Opportunity Pipeline</h1>
          <p className="text-gray-500 text-sm">Table view with inline editing</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={refetch}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm" onClick={handleCreateNew}>
            <Plus className="h-4 w-4 mr-2" />
            Add Opportunity
          </Button>
        </div>
      </div>

      <TableView
        opportunities={opportunities}
        companies={companies}
        onRefresh={refetch}
      />

      <OpportunityModal
        open={isModalOpen}
        onClose={handleCloseModal}
        opportunity={null}
        companies={companies}
        onSave={refetch}
      />
    </div>
  )
}
