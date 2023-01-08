import {useContext} from 'react'
import {SanityDocumentLike} from 'sanity'
import {DocumentValueContext} from './DocumentValueContext'

/** @alpha */
export function useDocumentValue(): SanityDocumentLike | null {
  return useContext(DocumentValueContext)
}
