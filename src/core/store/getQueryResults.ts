import {
  catchError,
  delay,
  filter,
  map,
  mergeMapTo,
  scan,
  share,
  startWith,
  take,
  takeUntil,
} from 'rxjs/operators'
import {Observable, Subject, concat, merge, of, fromEvent} from 'rxjs'
import {ListenQueryOptions, SanityClient, SanityDocument, listenQuery} from 'sanity'

export interface QueryResults {
  error: Error | null
  loading: boolean
  retry: () => void
  value: SanityDocument[] | null
}

interface QueryResultsRetryMsg {
  type: 'retry'
}

type QueryResultsMsg = QueryResultsRetryMsg

export const INITIAL_QUERY_RESULTS: Omit<QueryResults, 'retry'> = {
  error: null,
  loading: false,
  value: null,
}

const LOADING_QUERY_RESULTS: Omit<QueryResults, 'retry'> = {
  error: null,
  loading: true,
  value: null,
}

export function getQueryResults(options: {
  client: SanityClient
  query: string
  params: Record<string, any>
  listenOptions: ListenQueryOptions
}): Observable<QueryResults> {
  const {client, query, params, listenOptions} = options
  const msgSubject = new Subject<QueryResultsMsg>()
  const msg$ = msgSubject.asObservable()
  const retry$ = msg$.pipe(filter((msg) => msg.type === 'retry'))
  const online$ = fromEvent(window, 'online')

  function retry() {
    msgSubject.next({type: 'retry'})
  }

  const loadedState$ = listenQuery(client, query, params, listenOptions).pipe(
    map((documents: SanityDocument[]) => ({error: null, loading: false, value: documents})),
    share()
  )

  const loadingState$ = of(LOADING_QUERY_RESULTS).pipe(delay(250), takeUntil(loadedState$))

  const state$ = merge(loadingState$, loadedState$).pipe(
    startWith(INITIAL_QUERY_RESULTS),
    catchError((err, caught$) => {
      const errState: Omit<QueryResults, 'retry'> = {error: err, loading: false, value: null}

      return concat(of(errState), merge(online$, retry$).pipe(take(1), mergeMapTo(caught$)))
    }),
    scan((prev, next) => ({...prev, ...next}))
  )

  return state$.pipe(map((state) => ({...state, retry})))
}
