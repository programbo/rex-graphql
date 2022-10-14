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
  auth: {
    requiresToken: false,
    endpoint: '/v1/rex/Authentication/login',
    body: {
      email: REX_USERNAME,
      password: REX_PASSWORD,
      token_lifetime: '604800', // 7 days
    },
    responseValidator: authResponseSchema,
  },
  listings: {
    requiresToken: true,
    endpoint: '/v1/rex/listings/search',
    body: defaultListingBody,
    responseValidator: listingsResponseSchema,
  },
  explore: {
    requiresToken: true,
    endpoint: '/v1/rex/listings/search',
    body: defaultListingBody,
    payloadValidator: z.string().transform((suburb) => ({
      criteria: [{ 'property.adr_suburb_or_town': suburb }],
    })),
    responseValidator: listingsResponseSchema,
  },
  listing: {
    requiresToken: true,
    endpoint: '/v1/rex/listings/read',
    payloadValidator: z
      .string()
      .or(z.number())
      .transform((id) => ({ id: id.toString() })),
    responseValidator: listingResponseSchema,
  },
  suburbs: {
    requiresToken: true,
    endpoint: '/v1/rex/published-listings/get-unique-listing-suburbs',
    responseValidator: suburbsResponseSchema,
  },
} as const
