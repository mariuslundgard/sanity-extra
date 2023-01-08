import {SortOrderBy} from './types'

export function toOrderClause(orderBy: SortOrderBy[]): string {
  return orderBy
    .map((ordering) =>
      [wrapFieldWithFn(ordering), (ordering.direction || '').toLowerCase()]
        .map((str) => str.trim())
        .filter(Boolean)
        .join(' ')
    )
    .join(',')
}

function wrapFieldWithFn(ordering: SortOrderBy): string {
  return ordering.mapWith ? `${ordering.mapWith}(${ordering.field})` : ordering.field
}
