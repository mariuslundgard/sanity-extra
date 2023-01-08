import {createContext} from 'react'
import {ConnectionState, EMPTY_ARRAY, FormPatch, PatchEvent, ValidationMarker} from 'sanity'

/** @alpha */
export interface DocumentState {
  connection: ConnectionState
  liveEdit: boolean
  patch: (patchOrEvent: FormPatch | FormPatch[] | PatchEvent) => void
  ready: boolean
  transactionSyncLock: {enabled: boolean} | null
  validation: ValidationMarker[]
}

export const DocumentStateContext = createContext<DocumentState>({
  connection: 'connecting',
  liveEdit: false,
  ready: false,
  patch: () => undefined,
  transactionSyncLock: null,
  validation: EMPTY_ARRAY,
})
