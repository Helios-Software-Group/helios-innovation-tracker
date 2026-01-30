'use client'

import { useState } from 'react'
import { useOpportunities } from '@/hooks/use-opportunities'
import { TimelineView } from '@/components/dashboard/timeline-view'
import { OpportunityModal } from '@/components/dashboard/opportunity-modal'
import { OpportunityDetailModal } from '@/components/dashboard/opportunity-detail-modal'
import { Button } from '@/components/ui/button'
import { Plus, RefreshCw } from 'lucide-react'
import type { OpportunityWithCompany } from '@/types/database'

export default function TimelinePage() {
  const { opportunities, companies, loading, error, refetch } = useOpportunities()
  const [selectedOpportunity, setSelectedOpportunity] = useState<OpportunityWithCompany | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  const handleSelectOpportunity = (opp: OpportunityWithCompany) => {
    setSelectedOpportunity(opp)
    setIsDetailModalOpen(true) // Open detail modal first
  }

  const handleCreateNew = () => {
    setSelectedOpportunity(null)
    setIsCreating(true)
    setIsEditModalOpen(true)
  }

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false)
    setSelectedOpportunity(null)
  }

  const handleEditFromDetail = () => {
    setIsDetailModalOpen(false)
    setIsCreating(false)
    setIsEditModalOpen(true)
  }

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
    setSelectedOpportunity(null)
    setIsCreating(false)
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
      <div className="flex items-center justify-center relative">
        <h1 className="text-2xl font-bold text-center">Helios AI Opportunity Pipeline</h1>
        <div className="absolute right-0 flex gap-2">
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

      <TimelineView
        opportunities={opportunities}
        onSelectOpportunity={handleSelectOpportunity}
      />

      {/* Detail Modal - opens first when clicking a card */}
      <OpportunityDetailModal
        open={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        opportunity={selectedOpportunity}
        onEdit={handleEditFromDetail}
        onRefresh={refetch}
      />

      {/* Edit/Create Modal */}
      <OpportunityModal
        open={isEditModalOpen}
        onClose={handleCloseEditModal}
        opportunity={isCreating ? null : selectedOpportunity}
        companies={companies}
        onSave={refetch}
      />
    </div>
  )
}
