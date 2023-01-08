import {createContext} from 'react'
import {DocumentForm} from './types'

export const DocumentFormContext = createContext<DocumentForm | null>(null)
