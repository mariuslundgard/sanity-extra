import {Dispatch, SetStateAction} from 'react'
import {DocumentPresence, FormPatch, ObjectFormNode, PatchEvent, Path, StateTree} from 'sanity'

/** @alpha */
export interface DocumentForm {
  node: ObjectFormNode
  patch: (patch: FormPatch | FormPatch[] | PatchEvent) => void
  setCollapsedFieldSets: Dispatch<SetStateAction<StateTree<boolean> | undefined>>
  setCollapsedPath: Dispatch<SetStateAction<StateTree<boolean> | undefined>>
  setFieldGroupState: Dispatch<SetStateAction<StateTree<string> | undefined>>
  setFocusPath: Dispatch<SetStateAction<Path>>
  setOpenPath: Dispatch<SetStateAction<Path>>
  setPresence: Dispatch<SetStateAction<DocumentPresence[]>>
}
