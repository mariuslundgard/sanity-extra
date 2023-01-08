import {ReactNode, useCallback, useMemo, useRef} from 'react'
import {
  FormPatch,
  ObjectSchemaType,
  PatchEvent,
  SanityDocumentLike,
  toMutationPatches,
  useConnectionState,
  useDocumentOperation,
  useEditState,
  useInitialValue,
  useUnique,
  useValidationStatus,
} from 'sanity'
import {DocumentState, DocumentStateContext} from './DocumentStateContext'
import {DocumentValueContext} from './DocumentValueContext'

/** @alpha */
export function DocumentEditorProvider(props: {
  changesOpen?: boolean
  children?: ReactNode
  documentId: string
  onPatchEvent?: (msg: PatchEvent) => void
  schemaType: ObjectSchemaType
  templateName?: string
  templateParams?: Record<string, unknown>
}) {
  const {
    changesOpen = false,
    children,
    documentId,
    onPatchEvent,
    schemaType,
    templateName,
    templateParams,
  } = props

  const initialValueRaw = useInitialValue({
    documentId,
    documentType: schemaType.name,
    templateName,
    templateParams,
  })

  const initialValue = useUnique(initialValueRaw)

  const {draft, liveEdit, published, ready, transactionSyncLock} = useEditState(
    documentId,
    schemaType.name
  )

  const connectionState = useConnectionState(documentId, schemaType.name)

  const {patch}: any = useDocumentOperation(documentId, schemaType.name)

  const value = useMemo(
    () =>
      draft ||
      published ||
      (initialValue.loading || initialValue.error ? null : initialValue.value),
    [draft, initialValue, published]
  )

  const protoValue: SanityDocumentLike = useMemo(
    () => ({_id: `drafts.${documentId}`, _type: schemaType.name}),
    [documentId, schemaType]
  )

  const {validation: validationRaw} = useValidationStatus(documentId, schemaType.name)
  const validation = useUnique(validationRaw)

  const patchRef = useRef<(event: PatchEvent) => void>(() => {
    throw new Error('patching is not ready')
  })

  patchRef.current = (event: PatchEvent) => {
    patch.execute(toMutationPatches(event.patches), initialValue.value)
    onPatchEvent?.(event)
  }

  const handleChange = useCallback((patchOrEvent: FormPatch | FormPatch[] | PatchEvent) => {
    patchRef.current(PatchEvent.from(patchOrEvent))
  }, [])

  const state: DocumentState = useMemo(
    () => ({
      changesOpen,
      connection: connectionState,
      liveEdit,
      patch: handleChange,
      ready,
      transactionSyncLock,
      validation,
    }),
    [changesOpen, connectionState, handleChange, liveEdit, ready, transactionSyncLock, validation]
  )

  return (
    <DocumentStateContext.Provider value={state}>
      <DocumentValueContext.Provider value={value || initialValue.value || protoValue}>
        {children}
      </DocumentValueContext.Provider>
    </DocumentStateContext.Provider>
  )
}
