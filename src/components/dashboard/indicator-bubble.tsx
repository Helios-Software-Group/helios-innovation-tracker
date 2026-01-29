'use client'

import { cn } from '@/lib/utils'
import { INDICATOR_CONFIG, INDICATOR_LABELS } from '@/lib/constants'
import type { IndicatorStatus } from '@/types/database'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

type IndicatorType = keyof typeof INDICATOR_LABELS

interface IndicatorBubbleProps {
  type: IndicatorType
  status: IndicatorStatus
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function IndicatorBubble({
  type,
  status,
  showLabel = false,
  size = 'md',
  className,
}: IndicatorBubbleProps) {
  const config = INDICATOR_CONFIG[status]
  const label = INDICATOR_LABELS[type]

  const sizeClasses = {
    sm: 'w-4 h-4 text-[8px]',
    md: 'w-6 h-6 text-[10px]',
    lg: 'w-8 h-8 text-xs',
  }

  const bubble = (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full font-semibold',
        config.bgColor,
        config.color,
        sizeClasses[size],
        className
      )}
    >
      {showLabel && label}
    </span>
  )

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>{bubble}</TooltipTrigger>
        <TooltipContent>
          <p className="capitalize">
            {type.replace('_indicator', '').replace('_', ' ')}: {status}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

interface IndicatorGroupProps {
  messaging: IndicatorStatus
  campaign: IndicatorStatus
  pricing: IndicatorStatus
  salesAlignment: IndicatorStatus
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function IndicatorGroup({
  messaging,
  campaign,
  pricing,
  salesAlignment,
  size = 'md',
  className,
}: IndicatorGroupProps) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      <IndicatorBubble type="messaging_indicator" status={messaging} size={size} />
      <IndicatorBubble type="campaign_indicator" status={campaign} size={size} />
      <IndicatorBubble type="pricing_indicator" status={pricing} size={size} />
      <IndicatorBubble type="sales_alignment_indicator" status={salesAlignment} size={size} />
    </div>
  )
}
