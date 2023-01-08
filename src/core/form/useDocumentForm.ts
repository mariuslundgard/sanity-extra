import {useContext} from 'react'
import {DocumentFormContext} from './DocumentFormContext'
import {DocumentForm} from './types'

/** @alpha */
export function useDocumentForm(): DocumentForm {
  const form = useContext(DocumentFormContext)

  if (!form) {
    throw new Error('form: missing context value')
  }

  return form
}
