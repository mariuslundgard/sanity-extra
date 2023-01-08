import {SanityDocument, collate} from 'sanity'
import {DocumentListPaneItem} from './types'

export function removePublishedWithDrafts(documents: SanityDocument[]): DocumentListPaneItem[] {
  return collate(documents).map((entry) => {
    const doc = entry.draft || entry.published

    return {
      ...doc,
      hasPublished: !!entry.published,
      hasDraft: !!entry.draft,
    }
  }) as any
}
