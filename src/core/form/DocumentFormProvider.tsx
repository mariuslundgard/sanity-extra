import {ReactNode, useCallback, useMemo, useState} from 'react'
import {
  DocumentPresence,
  EMPTY_ARRAY,
  FormProvider,
  FormState,
  ObjectFormNode,
  ObjectSchemaType,
  PatchEvent,
  Path,
  SanityDocumentLike,
  StateTree,
  createPatchChannel,
  setAtPath,
  useFormState,
} from 'sanity'
import {EMPTY_RECORD} from '../../constants'
import {DocumentEditorProvider, useDocumentState, useDocumentValue} from '../documentEditor'
import {DocumentFormContext} from './DocumentFormContext'
import {DocumentForm} from './types'

/** @alpha */
export function DocumentFormProvider(props: {
  autoFocus?: boolean
  changesOpen?: boolean
  children?: ReactNode
  documentId: string
  onPatchEvent?: (msg: PatchEvent) => void
  readOnly?: boolean
  schemaType: ObjectSchemaType
  templateName?: string
  templateParams?: Record<string, unknown>
}) {
  const {
    autoFocus = false,
    changesOpen = false,
    children,
    documentId,
    onPatchEvent,
    readOnly = false,
    schemaType,
    templateName,
    templateParams,
  } = props

  return (
    <DocumentEditorProvider
      documentId={documentId}
      onPatchEvent={onPatchEvent}
      schemaType={schemaType}
      templateName={templateName}
      templateParams={templateParams}
    >
      <InnerDocumentFormProvider
        autoFocus={autoFocus}
        changesOpen={changesOpen}
        documentId={documentId}
        readOnly={readOnly}
        schemaType={schemaType}
      >
        {children}
      </InnerDocumentFormProvider>
    </DocumentEditorProvider>
  )
}

function InnerDocumentFormProvider(props: {
  autoFocus: boolean
  children: ReactNode
  changesOpen: boolean
  documentId: string
  readOnly: boolean
  schemaType: ObjectSchemaType
}) {
  const {autoFocus, children, changesOpen, documentId, readOnly: readOnlyProp, schemaType} = props

  const {connection, patch, ready, validation} = useDocumentState()
  const value = useDocumentValue()
  const [collapsedFieldSets, setCollapsedFieldSets] = useState<StateTree<boolean>>()
  const [collapsedPaths, setCollapsedPath] = useState<StateTree<boolean>>()
  const [fieldGroupState, setFieldGroupState] = useState<StateTree<string>>()
  const [focusPath, setFocusPath] = useState<Path>(EMPTY_ARRAY)
  const [openPath, setOpenPath] = useState<Path>(EMPTY_ARRAY)
  const [presence, setPresence] = useState<DocumentPresence[]>(EMPTY_ARRAY)

  const protoValue: SanityDocumentLike = useMemo(
    () => ({_id: `drafts.${documentId}`, _type: schemaType.name}),
    [documentId, schemaType]
  )

  const {
    changed = false,
    focused = false,
    groups = EMPTY_ARRAY,
    id,
    members = EMPTY_ARRAY,
    presence: formPresence = EMPTY_ARRAY,
    readOnly = false,
    validation: formValidation = EMPTY_ARRAY,
  } = useFormState(schemaType, {
    changesOpen,
    collapsedFieldSets,
    collapsedPaths,
    comparisonValue: null,
    fieldGroupState,
    focusPath,
    openPath,
    presence,
    readOnly: readOnlyProp || !ready || connection !== 'connected',
    validation,
    value: value || protoValue,
  }) || (EMPTY_RECORD as unknown as FormState)

  const node: ObjectFormNode = useMemo(
    () => ({
      changed: false,
      focusPath,
      focused,
      groups,
      id: 'root',
      level: 0,
      members,
      path: EMPTY_ARRAY,
      presence: formPresence,
      readOnly,
      schemaType,
      validation: formValidation,
      value: value || undefined,
    }),
    [focusPath, focused, formPresence, formValidation, groups, members, readOnly, schemaType, value]
  )

  const patchChannel = useMemo(() => createPatchChannel(), [])

  const form: DocumentForm = useMemo(
    () => ({
      changed,
      node,
      patch,
      setCollapsedFieldSets,
      setCollapsedPath,
      setFieldGroupState,
      setFocusPath,
      setOpenPath,
      setPresence,
    }),
    [changed, node, patch, setCollapsedFieldSets, setCollapsedPath, setFocusPath, setOpenPath]
  )

  const handleBlur = useCallback((_path: Path) => setFocusPath(EMPTY_ARRAY), [setFocusPath])

  const handleCollapse = useCallback(
    (path: Path, collapsed: boolean) =>
      setCollapsedPath((prevState) => setAtPath(prevState, path, collapsed)),
    [setCollapsedPath]
  )

  const handleFocus = useCallback((path: Path) => setFocusPath(path), [])

  const handleFieldGroupSelect = useCallback(() => {
    // todo
  }, [])

  const handleFieldSetCollapse = useCallback(
    (path: Path, collapsed: boolean) =>
      setCollapsedFieldSets((prevState) => setAtPath(prevState, path, collapsed)),
    [setCollapsedFieldSets]
  )

  return (
    <DocumentFormContext.Provider value={form}>
      <FormProvider
        __internal_patchChannel={patchChannel}
        autoFocus={autoFocus}
        changesOpen={changesOpen}
        collapsedFieldSets={collapsedFieldSets}
        collapsedPaths={collapsedPaths}
        focusPath={focusPath}
        focused={focused}
        groups={groups}
        id={id}
        members={members}
        onChange={patch}
        onPathBlur={handleBlur}
        onPathFocus={handleFocus}
        onPathOpen={setOpenPath}
        onFieldGroupSelect={handleFieldGroupSelect}
        onSetPathCollapsed={handleCollapse}
        onSetFieldSetCollapsed={handleFieldSetCollapse}
        presence={formPresence}
        validation={validation}
        readOnly={readOnly}
        schemaType={schemaType}
        value={value || undefined}
      >
        {children}
      </FormProvider>
    </DocumentFormContext.Provider>
  )
}
