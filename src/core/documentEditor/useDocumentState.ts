import {useContext} from 'react'
import {DocumentStateContext, DocumentState} from './DocumentStateContext'

/** @alpha */
export function useDocumentState(): DocumentState {
  return useContext(DocumentStateContext)
}
