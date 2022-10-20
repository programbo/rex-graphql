import gql from 'graphql-tag'

export const typeDefs = gql`
  type Criteria {
    name: String
    value: String
  }

  type SystemOwnerUser {
    id: String
    name: String
    first_name: String
    last_name: String
    email_address: String
  }

  type Property {
    business_name: String
    etag: String
    id: String
    system_search_key: String
    adr_building: String
    adr_country: String
    adr_estate_name: String
    adr_estate_stage: String
    adr_latitude: String
    adr_locality: String
    adr_longitude: String
    adr_postcode: String
    adr_state_or_region: String
    adr_street_name: String
    adr_street_number: String
    adr_suburb_or_town: String
    adr_unit_number: String
    attr_bathrooms: String
    attr_bedrooms: String
    attr_buildarea_m2: String
    attr_buildarea_max_m2: String
    attr_buildarea_max: String
    attr_buildarea_unit: String
    attr_buildarea: String
    attr_is_corner_block: String
    attr_land_depth_left: String
    attr_land_depth_rear: String
    attr_land_depth_right: String
    attr_land_frontage: String
    attr_landarea_m2: String
    attr_landarea: String
    attr_roi_pa: String
    attr_sleeps: String
    attr_takings: String
    attr_total_car_accom: String
    attr_landarea_unit: Enum
    system_owner_user: SystemOwnerUser
    property_image: String
    property_category: Enum
  }

  type Enum {
    id: String
    text: String
  }

  type ListingSubcategories {
    priority: Int
    id: Int
    subcategory: Enum
  }

  type ListingLinks {
    link_type: String
    link_url: String
    id: Int
  }

  type Image {
    url: String
  }

  type Type {
    id: String
    text: String
  }

  type User {
    id: String
    name: String
    first_name: String
    last_name: String
    email_address: String
  }

  type ListingDocuments {
    system_ctime: Int
    system_modtime: Int
    system_size_mb: Float
    description: String
    uri: String
    upload_date: String
    show_in_open_homes: String
    id: Int
    url: String
    privacy: Enum
    type: Type
    system_created_user: User
    system_modified_user: User
  }

  type EventAgent {
    id: String
    name: String
    first_name: String
    last_name: String
    email_address: String
    phone_direct: String
    phone_mobile: String
    position: String
    is_account_user: String
    profile_image: String
  }

  type ListingEvents {
    event_type: String
    event_time: String
    event_date: String
    event_venue: String
    event_duration_minutes: String
    id: Int
    event_agent: EventAgent
  }

  type ListingAdverts {
    advert_type: String
    advert_heading: String
    advert_body: String
  }

  type Contact {
    address_postal: String
    address: String
    contact_image: String
    email_address: String
    etag: String
    fax_number: String
    id: String
    interest_level: String
    is_dnd: String
    last_contacted_date: String
    marketing_birthday: String
    marketing_enquiry_method: String
    marketing_enquiry_source: String
    marketing_gender: String
    marketing_postcode: String
    name_addressee: String
    name_first: String
    name_last: String
    name_legal: String
    name_salutation: String
    name: String
    phone_number: String
    system_ctime: String
    system_modtime: String
    system_record_state: String
    type: String
    system_owner_user: User
  }

  type ContactRelnListing {
    do_not_contact: String
    id: Int
    contact: Contact
    reln_type: Enum
  }

  type Related {
    listing_subcategories: [ListingSubcategories]
    listing_links: [ListingLinks]
    listing_holidaybookings: [String]
    listing_floorplans: [String]
    listing_documents: [ListingDocuments]
    listing_images: [String]
    listing_events: [ListingEvents]
    listing_adverts: [ListingAdverts]
    listing_allowances: [String]
    listing_idealfors: [String]
    contact_reln_listing: [ContactRelnListing]
    property_tags: [String]
    property_views: [String]
    property_features: [String]
  }

  type ExtendedProperty {
    business_name: String
    etag: String
    id: Int
    property_image: String
    system_search_key: String
    adr_building: String
    adr_country: String
    adr_estate_name: String
    adr_estate_stage: String
    adr_latitude: String
    adr_locality: String
    adr_longitude: String
    adr_postcode: String
    adr_state_or_region: String
    adr_street_name: String
    adr_street_number: String
    adr_suburb_or_town: String
    adr_unit_number: String
    attr_bathrooms: Int
    attr_bedrooms: Int
    attr_buildarea_m2: String
    attr_buildarea_max_m2: String
    attr_buildarea_max: String
    attr_buildarea_unit: String
    attr_buildarea: String
    attr_is_corner_block: String
    attr_land_depth_left: String
    attr_land_depth_rear: String
    attr_land_depth_right: String
    attr_land_frontage: String
    attr_landarea_m2: Int
    attr_landarea: Int
    attr_roi_pa: String
    attr_sleeps: String
    attr_takings: String
    attr_total_car_accom: String
    is_dnd: String
    meta_council_authority: String
    meta_parking_notes: String
    meta_rates_bodycorp: String
    meta_rates_business: String
    meta_rates_council_exempt: String
    meta_rates_council: String
    meta_rates_domestic: String
    meta_rates_land: String
    meta_rates_other: String
    meta_rates_water: String
    meta_tax_band: String
    meta_zone: String
    property_subcategory_id: String
    rural_annual_rainfall: String
    rural_carrying_capacity: String
    rural_fences: String
    rural_improvements: String
    rural_irrigation: String
    rural_services: String
    rural_soil_types: String
    system_ctime: Int
    system_modtime: Int
    system_record_state: String
    attr_build_year: String
    attr_carports: String
    attr_energy_rating: String
    attr_ensuites: String
    attr_exterior: String
    attr_garages: Int
    attr_is_franchise: String
    attr_is_house_land: String
    attr_land_crossover: String
    attr_living_areas: String
    attr_open_spaces: String
    attr_roof: String
    attr_shared_ownership_percentage: String
    attr_shared_ownership_rent_period: String
    attr_shared_ownership_rent: String
    attr_shared_ownership: String
    attr_tenure_agent: String
    attr_tenure_expiry_year: String
    attr_tenure_ground_rent_increase_percentage: String
    attr_tenure_ground_rent_review_year: String
    attr_tenure_ground_rent: String
    attr_tenure_other: String
    attr_tenure_service_charge: String
    attr_tenure: String
    attr_toilets: String
    attr_valuation_amount: String
    attr_valuation_date: String
    attr_valuation_land_amount: String
    attr_whole_part: String
    system_modified_user: User
    system_created_user: User
    security_user_rights: [String]
    attr_landarea_unit: Enum
    system_owner_user: User
    property_category: Enum
  }

  type Listing {
    id: Int
    property: ExtendedProperty
  }

  type ExtendedListing {
    id: Int
    related: Related
    property: Property
  }

  type Suburb {
    locality: String
    suburb_or_town: String!
    state_or_region: String!
    postcode: String!
  }

  type Query {
    suburbs: [Suburb!]
    listing(id: Int!): ExtendedListing
    listings: [Listing]
    explore(suburb: String): [Listing]
  }
`
