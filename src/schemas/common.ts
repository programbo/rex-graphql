import { z } from 'zod'

export const rexMetaSchema = z.object({
  correlation: z.object({
    request_id: z.string(),
    correlation_id: z.string(),
    async_correlation_id: z.string(),
  }),
})

export const listingUserSchema = z
  .object({
    id: z.union([z.string(), z.number()]),
    name: z.string(),
    first_name: z.string(),
    last_name: z.string(),
    email_address: z.string(),
  })
  .nullable()

export const listingAssetSchema = z.object({
  uri: z.string(),
  url: z.string(),
})

export const listingImageSchema = listingAssetSchema
  .extend({
    thumbs: z.record(listingAssetSchema),
  })
  .nullable()

export const rexEnumSchema = z
  .object({
    id: z.union([z.string(), z.number()]).nullable(),
    text: z.string().nullable(),
  })
  .nullable()

export const propertyAddressSchema = z.object({
  adr_building: z.record(z.string(), z.unknown()).nullable(),
  adr_country: z.string(),
  adr_estate_name: z.string().nullable(),
  adr_estate_stage: z.string().nullable(),
  adr_latitude: z.string(),
  adr_locality: z.string().nullable(),
  adr_longitude: z.string(),
  adr_postcode: z.string(),
  adr_state_or_region: z.string(),
  adr_street_name: z.string(),
  adr_street_number: z.string(),
  adr_suburb_or_town: z.string(),
  adr_unit_number: z.string().nullable(),
})
export const propertyCoreAttributesSchema = z.object({
  attr_bathrooms: z.number().or(z.string()).nullable(),
  attr_bedrooms: z.number().or(z.string()).nullable(),
  attr_buildarea_m2: z.number().or(z.string()).nullable(),
  attr_buildarea_max_m2: z.number().or(z.string()).nullable(),
  attr_buildarea_max: z.number().or(z.string()).nullable(),
  attr_buildarea_unit: rexEnumSchema,
  attr_buildarea: z.number().or(z.string()).nullable(),
  attr_is_corner_block: z.number().or(z.string()).nullable(),
  attr_land_depth_left: z.number().or(z.string()).nullable(),
  attr_land_depth_rear: z.number().or(z.string()).nullable(),
  attr_land_depth_right: z.number().or(z.string()).nullable(),
  attr_land_frontage: z.number().or(z.string()).nullable(),
  attr_landarea_m2: z.number().or(z.string()).nullable(),
  attr_landarea_unit: rexEnumSchema,
  attr_landarea: z.number().or(z.string()).nullable(),
  attr_roi_pa: z.number().or(z.string()).nullable(),
  attr_sleeps: z.number().or(z.string()).nullable(),
  attr_takings: z.number().or(z.string()).nullable(),
  attr_total_car_accom: z.number().or(z.string()).nullable(),
})

export const listingPropertySchema = z
  .object({
    business_name: z.string().nullable(),
    etag: z.string(),
    id: z.number().or(z.string()),
    property_category: rexEnumSchema,
    property_image: listingImageSchema,
    system_owner_user: listingUserSchema,
    system_search_key: z.string(),
  })
  .merge(propertyAddressSchema)
  .merge(propertyCoreAttributesSchema)

export const listingAgentSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    first_name: z.string(),
    last_name: z.string(),
    email_address: z.string(),
    phone_direct: z.string().nullable(),
    phone_mobile: z.string(),
    position: z.string().nullable(),
    is_account_user: z.string().nullable(),
    profile_image: listingImageSchema,
  })
  .nullable()

export const listingSolicitorSchema = z
  .object({
    address_postal: z.string().nullable(),
    address: z.string().nullable(),
    company_abn: z.string().nullable(),
    company_size: z.string().nullable(),
    contact_image: z.string().nullable(),
    email_address: z.string(),
    etag: z.string(),
    fax_number: z.string().nullable(),
    id: z.number().or(z.string()),
    interest_level: z.string().nullable(),
    is_dnd: z.string().nullable(),
    last_contacted_date: z.string().nullable(),
    marketing_birthday: z.string().nullable(),
    marketing_enquiry_method: z.string().nullable(),
    marketing_enquiry_source: z.string().nullable(),
    marketing_gender: z.string().nullable(),
    marketing_postcode: z.string().nullable(),
    name_addressee: z.string().nullable(),
    name_first: z.string().nullable(),
    name_last: z.string().nullable(),
    name_legal: z.string().nullable(),
    name_salutation: z.string().nullable(),
    name: z.string(),
    phone_number: z.string(),
    system_ctime: z.string(),
    system_modtime: z.string(),
    system_owner_user: listingUserSchema,
    system_record_state: z.string(),
    type: z.string(),
  })
  .nullable()

export const listingExtendedImageSchema = listingImageSchema.unwrap().extend({
  id: z.number(),
  system_modtime: z.number(),
  priority: z.string(),
  inbound_original_src_url: z.string().nullable(),
  inbound_last_update: z.string().nullable(),
  inbound_index: z.string().nullable(),
})

export const listingExtendedAttributesSchema = z.object({
  attr_build_year: z.string().nullable(),
  attr_carports: z.string().nullable(),
  attr_energy_rating: z.string().nullable(),
  attr_ensuites: z.number().nullable(),
  attr_exterior: z.string().nullable(),
  attr_garages: z.number().nullable(),
  attr_is_franchise: z.string().nullable(),
  attr_is_house_land: z.string().nullable(),
  attr_land_crossover: z.string().nullable(),
  attr_living_areas: z.number().nullable(),
  attr_open_spaces: z.string().nullable(),
  attr_roof: z.string().nullable(),
  attr_shared_ownership_percentage: z.string().nullable(),
  attr_shared_ownership_rent_period: z.string().nullable(),
  attr_shared_ownership_rent: z.string().nullable(),
  attr_shared_ownership: z.string().nullable(),
  attr_tenure_agent: z.string().nullable(),
  attr_tenure_expiry_year: z.string().nullable(),
  attr_tenure_ground_rent_increase_percentage: z.string().nullable(),
  attr_tenure_ground_rent_review_year: z.string().nullable(),
  attr_tenure_ground_rent: z.string().nullable(),
  attr_tenure_other: z.string().nullable(),
  attr_tenure_service_charge: z.string().nullable(),
  attr_tenure: z.string().nullable(),
  attr_toilets: z.number().nullable(),
  attr_valuation_amount: z.string().nullable(),
  attr_valuation_date: z.string().nullable(),
  attr_valuation_land_amount: z.string().nullable(),
  attr_whole_part: z.string().nullable(),
})

export const listingExtendedPropertySchema = listingPropertySchema
  .extend({
    is_dnd: z.string().nullable(),
    meta_council_authority: z.string().nullable(),
    meta_parking_notes: z.string().nullable(),
    meta_rates_bodycorp: z.string().nullable(),
    meta_rates_business: z.string().nullable(),
    meta_rates_council_exempt: z.string().nullable(),
    meta_rates_council: z.string(),
    meta_rates_domestic: z.string().nullable(),
    meta_rates_land: z.string().nullable(),
    meta_rates_other: z.string().nullable(),
    meta_rates_water: z.string(),
    meta_tax_band: z.string().nullable(),
    meta_zone: z.string().nullable(),
    property_subcategory_id: z.string().nullable(),
    rural_annual_rainfall: z.string().nullable(),
    rural_carrying_capacity: z.string().nullable(),
    rural_fences: z.string().nullable(),
    rural_improvements: z.string().nullable(),
    rural_irrigation: z.string().nullable(),
    rural_services: z.string().nullable(),
    rural_soil_types: z.string().nullable(),
    security_user_rights: z.array(z.string()),
    system_created_user: listingUserSchema,
    system_ctime: z.number(),
    system_modified_user: listingUserSchema,
    system_modtime: z.number(),
    system_record_state: z.string(),
  })
  .merge(listingExtendedAttributesSchema)

export const listingEventSchema = z.object({
  event_type: z.string(),
  event_time: z.string(),
  event_date: z.string(),
  event_venue: z.string().nullable(),
  event_duration_minutes: z.string(),
  id: z.number(),
  event_agent: listingAgentSchema,
})
export const listingAdvertSchema = z.object({
  advert_type: z.string(),
  advert_heading: z.string().nullable(),
  advert_body: z.string().nullable(),
})
