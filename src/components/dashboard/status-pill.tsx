'use client'

import { cn } from '@/lib/utils'
import { STATUS_CONFIG } from '@/lib/constants'
import type { OpportunityStatus } from '@/types/database'

interface StatusPillProps {
  status: string  // Accept any string, not just OpportunityStatus
  size?: 'sm' | 'md'
  className?: string
}

// Default config for unknown statuses
const DEFAULT_CONFIG = { label: 'Unknown', color: 'text-gray-700', bgColor: 'bg-gray-200' }

export function StatusPill({ status, size = 'md', className }: StatusPillProps) {
  // Normalize status to match our config keys
  const normalizedStatus = status?.toLowerCase().replace(/[^a-z_]/g, '_') as OpportunityStatus
  const config = STATUS_CONFIG[normalizedStatus] || DEFAULT_CONFIG

  // Use the original status as label if not in our config
  const label = STATUS_CONFIG[normalizedStatus] ? config.label : (status || 'Unknown')

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full font-medium whitespace-nowrap',
        config.bgColor,
        config.color,
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        className
      )}
    >
      {label}
    </span>
  )
}
