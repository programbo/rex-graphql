import { z } from 'zod'
import {
  authResponseSchema,
  listingsResponseSchema,
  listingResponseSchema,
  suburbsResponseSchema,
} from '../schemas'

const defaultListingBody = {
  extra_options: { extra_fields: ['core_attributes'] },
  criteria: [
    { system_listing_state: 'current' },
    { system_publication_status: 'published' },
  ],
  limit: 100,
  offset: 0,
} as const

export const queryConfigs = {
  listings: {
    endpoint: '/listings/search',
    body: defaultListingBody,
    responseValidator: listingsResponseSchema,
  },
  explore: {
    endpoint: '/listings/search',
    body: defaultListingBody,
    payloadValidator: z.string().transform((suburb) => ({
      criteria: [{ 'property.adr_suburb_or_town': suburb }],
    })),
    responseValidator: listingsResponseSchema,
  },
  listing: {
    endpoint: '/listings/read',
    payloadValidator: z
      .string()
      .or(z.number())
      .transform((id) => ({ id: id.toString() })),
    responseValidator: listingResponseSchema,
  },
  suburbs: {
    endpoint: '/published-listings/get-unique-listing-suburbs',
    responseValidator: suburbsResponseSchema,
  },
} as const
