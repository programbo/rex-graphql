import { rex } from '../lib/rex'
import { ListingResponse, ListingsResponse, SuburbsResponse } from '../schemas'

export const resolvers = {
  Query: {
    listings: async (_: unknown) =>
      (await rex<ListingsResponse>('listings')).rows,
    suburbs: async (_: unknown) => await rex<SuburbsResponse>('suburbs'),
    listing: async (_: unknown, { id }: { id: string }) =>
      await rex<ListingResponse>('listing', id),
    explore: async (_: unknown, { suburb }: { suburb: string }) =>
      await rex<ListingsResponse>('explore', suburb),
  },
}
