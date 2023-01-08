import {createContext} from 'react'
import {SanityDocumentLike} from 'sanity'

export const DocumentValueContext = createContext<SanityDocumentLike | null>(null)
