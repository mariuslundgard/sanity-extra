import {SortOrdering} from 'sanity'

export const PARTIAL_PAGE_LIMIT = 100
export const FULL_LIST_LIMIT = 2000

export const DEFAULT_ORDERING: SortOrdering = {
  name: 'createdBy',
  title: 'Created at',
  by: [{field: '_createdAt', direction: 'desc'}],
}
