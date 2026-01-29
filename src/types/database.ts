export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Status can be any of these values (stored as text in DB)
export type OpportunityStatus = 'done' | 'in_progress' | 'paused' | 'planned' | 'not_go'
export type IndicatorStatus = 'green' | 'amber' | 'red'
export type PhaseNumber = '0' | '1' | '2' | '3' | '4'

export interface Database {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string
          name: string
          slug: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          created_at?: string
          updated_at?: string
        }
      }
      opportunities: {
        Row: {
          id: string
          parent_id: string | null
          company: string | null
          company_id: string | null
          name: string
          description: string | null
          phase: number
          stage: string | null
          status: string
          arr: number | null
          nrr: number | null
          estimated_som: number | null
          som_currency: string | null
          next_steps: string | null
          target_date: string | null
          issues: string | null
          unlocks: string | null
          messaging_indicator: IndicatorStatus | null
          campaign_indicator: IndicatorStatus | null
          pricing_indicator: IndicatorStatus | null
          sales_alignment_indicator: IndicatorStatus | null
          rating_messaging: string | null
          rating_campaign: string | null
          rating_pricing: string | null
          rating_sales_alignment: string | null
          rating_implementation: string | null
          rating_workflow: string | null
          rating_enablement: string | null
          rating_kpis: string | null
          rating_next_steps: string | null
          rating_target_date: string | null
          sort_order: number
          created_at: string
          updated_at: string
          customer: string | null
        }
        Insert: {
          id: string  // Required - no default
          parent_id?: string | null
          company?: string | null
          company_id?: string | null
          name: string
          description?: string | null
          phase?: number
          stage?: string | null
          status?: string
          arr?: number | null
          nrr?: number | null
          estimated_som?: number | null
          som_currency?: string | null
          next_steps?: string | null
          target_date?: string | null
          issues?: string | null
          unlocks?: string | null
          messaging_indicator?: IndicatorStatus | null
          campaign_indicator?: IndicatorStatus | null
          pricing_indicator?: IndicatorStatus | null
          sales_alignment_indicator?: IndicatorStatus | null
          sort_order?: number
          created_at?: string
          updated_at?: string
          customer?: string | null
        }
        Update: {
          id?: string
          parent_id?: string | null
          company?: string | null
          company_id?: string | null
          name?: string
          description?: string | null
          phase?: number
          stage?: string | null
          status?: string
          arr?: number | null
          nrr?: number | null
          estimated_som?: number | null
          som_currency?: string | null
          next_steps?: string | null
          target_date?: string | null
          issues?: string | null
          unlocks?: string | null
          messaging_indicator?: IndicatorStatus | null
          campaign_indicator?: IndicatorStatus | null
          pricing_indicator?: IndicatorStatus | null
          sales_alignment_indicator?: IndicatorStatus | null
          sort_order?: number
          created_at?: string
          updated_at?: string
          customer?: string | null
        }
      }
    }
    Enums: {
      indicator_status: IndicatorStatus
    }
  }
}

export type Company = Database['public']['Tables']['companies']['Row']
export type Opportunity = Database['public']['Tables']['opportunities']['Row']
export type OpportunityInsert = Database['public']['Tables']['opportunities']['Insert']
export type OpportunityUpdate = Database['public']['Tables']['opportunities']['Update']

export interface OpportunityWithCompany extends Opportunity {
  companies?: Company | null  // Supabase returns this as 'companies' when using select with join
}
