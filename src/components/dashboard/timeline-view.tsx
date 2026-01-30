'use client'

import { PHASES } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { StatusPill } from './status-pill'
import { IndicatorGroup } from './indicator-bubble'
import type { OpportunityWithCompany, PhaseNumber } from '@/types/database'
import { format } from 'date-fns'
import { CalendarDays, DollarSign, Link as LinkIcon, Paperclip } from 'lucide-react'

interface TimelineViewProps {
  opportunities: OpportunityWithCompany[]
  onSelectOpportunity?: (opportunity: OpportunityWithCompany) => void
}

export function TimelineView({ opportunities, onSelectOpportunity }: TimelineViewProps) {
  const getOpportunitiesByPhase = (phase: PhaseNumber) => {
    return opportunities.filter((opp) => String(opp.phase) === phase)
  }

  return (
    <div className="space-y-3">
      {/* Phase Headers */}
      <div className="flex gap-2">
        {PHASES.map((phase) => (
          <div
            key={phase.number}
            className={cn(
              'flex-1 px-3 py-2 rounded-lg text-white text-center',
              phase.headerBgColor
            )}
          >
            <div className="font-semibold text-sm">{phase.shortName}</div>
            <div className="text-xs opacity-80">{phase.duration}</div>
          </div>
        ))}
      </div>

      {/* Phase Columns with Cards */}
      <div className="flex gap-2 min-h-[calc(100vh-280px)]">
        {PHASES.map((phase) => {
          const phaseOpps = getOpportunitiesByPhase(phase.number)
          return (
            <div
              key={phase.number}
              className={cn(
                'flex-1 rounded-lg p-2 space-y-2',
                phase.bgColor
              )}
            >
              <div className="text-xs text-gray-600 font-medium px-1">
                {phaseOpps.length} {phaseOpps.length === 1 ? 'item' : 'items'}
              </div>
              {phaseOpps.map((opp) => (
                <TimelineCard
                  key={opp.id}
                  opportunity={opp}
                  onClick={() => onSelectOpportunity?.(opp)}
                />
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}

interface TimelineCardProps {
  opportunity: OpportunityWithCompany
  onClick?: () => void
}

function TimelineCard({ opportunity, onClick }: TimelineCardProps) {
  const companyName = opportunity.companies?.name || opportunity.company || 'Unknown'

  return (
    <div
      className="bg-white rounded-md p-2.5 cursor-pointer hover:shadow-md transition-all border border-gray-100 hover:border-gray-200"
      onClick={onClick}
    >
      {/* Header: Company + Status */}
      <div className="flex items-center justify-between gap-1 mb-1.5">
        <span className="text-xs font-medium text-blue-600 truncate">
          {companyName}
        </span>
        <StatusPill status={opportunity.status || 'planned'} size="sm" />
      </div>

      {/* Opportunity Name */}
      <div className="font-medium text-sm mb-1.5 line-clamp-2 leading-tight">
        {opportunity.name}
      </div>

      {/* Metadata Row: SOM + Target Date + Icons */}
      <div className="flex items-center gap-3 text-xs text-gray-500 mb-1.5">
        {opportunity.estimated_som && (
          <span className="flex items-center gap-0.5">
            <DollarSign className="h-3 w-3" />
            {(opportunity.estimated_som / 1000).toFixed(0)}k
          </span>
        )}
        {opportunity.target_date && (
          <span className="flex items-center gap-0.5">
            <CalendarDays className="h-3 w-3" />
            {format(new Date(opportunity.target_date), 'MMM d')}
          </span>
        )}
        {/* Demo Links and Attachments icons */}
        <span className="flex items-center gap-1 ml-auto">
          {opportunity.demo_links && opportunity.demo_links.length > 0 && (
            <span className="flex items-center gap-0.5 text-blue-500" title="Has demo links">
              <LinkIcon className="h-3 w-3" />
            </span>
          )}
          {opportunity.attachments && opportunity.attachments.length > 0 && (
            <span className="flex items-center gap-0.5 text-blue-500" title="Has attachments">
              <Paperclip className="h-3 w-3" />
            </span>
          )}
        </span>
      </div>

      {/* Indicator Bubbles */}
      <IndicatorGroup
        messaging={opportunity.messaging_indicator || 'red'}
        campaign={opportunity.campaign_indicator || 'red'}
        pricing={opportunity.pricing_indicator || 'red'}
        salesAlignment={opportunity.sales_alignment_indicator || 'red'}
        size="sm"
      />
    </div>
  )
}
