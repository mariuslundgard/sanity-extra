import {VirtualListChangeOpts} from '@sanity/ui'
import {useEffect, useState, useCallback, useMemo, useRef} from 'react'
import {filter as filterEvents} from 'rxjs/operators'
import {DEFAULT_STUDIO_CLIENT_OPTIONS, SanityDocument, useClient} from 'sanity'
import {DEFAULT_ORDERING, FULL_LIST_LIMIT, PARTIAL_PAGE_LIMIT} from './constants'
import {QueryResults, getQueryResults} from '../store/getQueryResults'
import {removePublishedWithDrafts} from './removePublishedWithDrafts'
import {DocumentListPaneItem, SortOrder, SortOrderBy} from './types'
import {toOrderClause} from './toOrderClause'

/** @alpha */
export interface UseDocumentListProps {
  defaultOrdering: SortOrderBy[]
  filter: string
  params: Record<string, unknown>
  sortOrder?: SortOrder
  apiVersion?: string
}

/** @alpha */
export interface DocumentList {
  error: {message: string} | null
  fullList: boolean
  handleListChange: ({toIndex}: VirtualListChangeOpts) => void
  loading: boolean
  items: DocumentListPaneItem[]
  onRetry?: (event: unknown) => void
}

/** @alpha */
export interface DocumentListResult {
  error: {message: string} | null
  loading: boolean
  onRetry?: (event: unknown) => void
  value: SanityDocument[] | null
}

const INITIAL_RESULT: DocumentListResult = {
  error: null,
  loading: true,
  value: null,
}

/** @alpha */
export function useDocumentList(props: UseDocumentListProps): DocumentList {
  const {apiVersion, defaultOrdering, filter, params, sortOrder} = props

  const client = useClient(DEFAULT_STUDIO_CLIENT_OPTIONS)
  const [fullList, setFullList] = useState(false)
  const fullListRef = useRef(fullList)

  const [result, setResult] = useState<DocumentListResult>(INITIAL_RESULT)

  const error = result.error
  const loading = result.loading
  const onRetry = result.onRetry

  const items = useMemo(
    () => (result.value ? removePublishedWithDrafts(result.value) : []),
    [result.value]
  )

  const query = useMemo(() => {
    const extendedProjection = sortOrder?.extendedProjection
    const projectionFields = ['_id', '_type']
    const finalProjection = projectionFields.join(',')
    const sortBy = defaultOrdering || sortOrder?.by || []
    const limit = fullList ? FULL_LIST_LIMIT : PARTIAL_PAGE_LIMIT
    const sort = sortBy.length > 0 ? sortBy : DEFAULT_ORDERING.by
    const order = toOrderClause(sort)

    if (extendedProjection) {
      const firstProjection = projectionFields.concat(extendedProjection).join(',')
      return [
        `*[${filter}] {${firstProjection}}`,
        `order(${order}) [0...${limit}]`,
        `{${finalProjection}}`,
      ].join('|')
    }

    return `*[${filter}]|order(${order})[0...${limit}]{${finalProjection}}`
  }, [defaultOrdering, filter, fullList, sortOrder])

  const handleListChange = useCallback(
    ({toIndex}: VirtualListChangeOpts) => {
      if (loading || fullListRef.current) {
        return
      }

      if (toIndex >= PARTIAL_PAGE_LIMIT / 2) {
        setFullList(true)

        // Prevent change handler from firing again before setState kicks in
        fullListRef.current = true
      }
    },
    [loading]
  )

  // Set up the document list listener
  useEffect(() => {
    const filterFn = fullList
      ? (queryResult: QueryResults) => queryResult.value !== null
      : () => true

    // Set loading state
    setResult((r) => (r ? {...r, loading: true} : INITIAL_RESULT))

    const queryResults$ = getQueryResults({
      client,
      query,
      params,
      listenOptions: {
        apiVersion,
        tag: 'desk.document-list',
      },
    }).pipe(filterEvents(filterFn))

    const sub = queryResults$.subscribe(setResult as any)

    return () => sub.unsubscribe()
  }, [apiVersion, client, fullList, query, params])

  // If `filter` or `params` changed, set up a new query from scratch.
  // If `sortOrder` changed, set up a new query from scratch as well.
  useEffect(() => {
    setResult(INITIAL_RESULT)
    setFullList(false)
    fullListRef.current = false
  }, [filter, params, sortOrder, apiVersion])

  return {
    error,
    fullList,
    handleListChange,
    loading,
    items,
    onRetry,
  }
}
