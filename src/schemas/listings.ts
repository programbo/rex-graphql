import { z } from 'zod'
import {
  listingAgentSchema,
  listingImageSchema,
  listingPropertySchema,
  listingCompanyContactSchema,
  listingUserSchema,
  rexEnumSchema,
} from './common'

const listingSchema = z.object({
  system_listing_state: z.string(),
  system_ctime: z.number(),
  system_modtime: z.number(),
  system_publication_time: z.number().nullable(),
  system_publication_user_id: z.number().nullable(),
  system_publication_status: z.union([
    z.literal('published'),
    z.literal('draft'),
  ]),
  system_overpayment_balance: z.string().nullable(),
  system_has_preupload_errors: z.number().nullable(),
  authority_date_start: z.string().nullable(),
  authority_duration_days: z.number().nullable(),
  authority_date_expires: z.string().nullable(),
  price_advertise_as: z.string().nullable(),
  price_est_rent_pw: z.string().nullable(),
  price_rent: z.string().nullable(),
  price_match: z.union([z.number(), z.string()]).nullable(),
  price_match_sale: z.number().nullable(),
  price_match_rent_pa_inc_tax: z.string().nullable(),
  price_bond: z.string().nullable(),
  price_rent_per_m2: z.string().nullable(),
  available_from_date: z.string().nullable(),
  inspection_alarm_code: z.string().nullable(),
  inspection_notes: z.string().nullable(),
  outgoings_annual: z.string().nullable(),
  outgoings_rent_is_plus: z.string().nullable(),
  meta_highlight_1: z.string().nullable(),
  meta_highlight_2: z.string().nullable(),
  meta_highlight_3: z.string().nullable(),
  meta_other_features: z.string().nullable(),
  feedback_offer_level: z.string().nullable(),
  feedback_price_rank: z.string().nullable(),
  feedback_notes: z.string().nullable(),
  legal_prop_lot: z.string().nullable(),
  legal_prop_subdivision: z.string().nullable(),
  legal_prop_address: z.string().nullable(),
  legal_prop_titleref: z.string().nullable(),
  legal_vendor_name: z.string().nullable(),
  legal_vendor_residence: z.string().nullable(),
  state_value_price: z.number().nullable(),
  state_value_price_rent_period_id: z.string().nullable(),
  state_value_deposit: z.string().nullable(),
  state_date: z.string().nullable(),
  state_reason_id: z.string().nullable(),
  state_reason_note: z.string().nullable(),
  state_lost_agency_id: z.number().nullable(),
  state_change_timestamp: z.number().nullable(),
  inbound_unique_id: z.string().nullable(),
  inbound_last_update: z.string().nullable(),
  publish_to_portals: z.boolean().nullable(),
  publish_to_automatch: z.boolean().nullable(),
  publish_to_external: z.boolean().nullable(),
  publish_to_general: z.boolean().nullable(),
  status_is_not_for_sale: z.string().nullable(),
  baseline_price: z.string().nullable(),
  parent_listing_id: z.string().nullable(),
  new_home: z.number().nullable(),
  image_cycling_delay_in_hours: z.string().nullable(),
  image_cycling_delayed_until: z.string().nullable(),
  comm_amount_fixed: z.number().nullable(),
  comm_amount_percentage: z.number().nullable(),
  comm_is_inc_tax: z.number().nullable(),
  comm_est_based_on_service: z.string().nullable(),
  comm_est_based_on_object_id: z.string().nullable(),
  comm_est_based_on_amount: z.string().nullable(),
  comm_est_amount_net_of_tax: z.number().nullable(),
  comm_est_amount_inc_tax: z.number().nullable(),
  comm_base_amount_override: z.string().nullable(),
  is_multiple: z.string().nullable(),
  price_match_max: z.string().nullable(),
  price_match_max_sale: z.string().nullable(),
  price_rent_max: z.string().nullable(),
  price_rent_max_per_m2: z.string().nullable(),
  price_match_rent_max_pa_inc_tax: z.string().nullable(),
  let_agreed: z.string().nullable(),
  etag: z.string(),
  system_owner_user: listingUserSchema,
  system_modified_user: listingUserSchema,
  system_created_user: listingUserSchema,
  security_user_rights: z.array(z.string()),
  property: listingPropertySchema,
  listing_primary_image: listingImageSchema,
  under_contract: z.boolean(),
  hold_status: z.string().nullable(),
  contract_status: z.string().nullable(),
  project_listing_status: z.string().nullable(),
  listing_agent_1: listingAgentSchema,
  listing_agent_2: listingAgentSchema,
  legal_solicitor: listingCompanyContactSchema,
  legal_solicitor_contact: z.string().nullable(),
  location: rexEnumSchema,
  authority_type: rexEnumSchema.nullable(),
  exclusivity: z.string().nullable(),
  inspection_type: rexEnumSchema.nullable(),
  listing_category: rexEnumSchema,
  price_rent_period: z.string().nullable(),
  price_rent_tax: z.string().nullable(),
  comm_structure: rexEnumSchema,
  comm_amount_model: rexEnumSchema,
  tenancy_type: rexEnumSchema,
  lead_auto_response_template: z.string().nullable(),
  id: z.number(),
})

export const listingsResponseSchema = z.object({
  error: z.null(),
  result: z.object({
    rows: z.array(
      listingSchema.transform(({ id, property }) => ({ id, property }))
    ),
    total: z.number(),
    viewstate_id: z.null(),
    criteria: z.array(z.object({ name: z.string(), value: z.string() })),
    order_by: z.array(z.unknown()),
  }),
})

export type ListingsResponse = z.infer<typeof listingsResponseSchema>
