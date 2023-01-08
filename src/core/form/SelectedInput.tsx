import {FocusEvent, useCallback, useRef} from 'react'
import {EMPTY_ARRAY, FormInput, ObjectInputProps, Path, setAtPath, useFormBuilder} from 'sanity'
import {useDocumentForm} from './useDocumentForm'

/** @alpha */
export function SelectedInput(props: {selectedPath: Path}) {
  const {selectedPath} = props
  const form = useDocumentForm()
  const {setCollapsedPath, setFocusPath, setOpenPath, setCollapsedFieldSets} = form

  const {
    focusPath,
    focused,
    groups,
    id,
    members,
    readOnly,
    renderField,
    renderInput,
    renderItem,
    renderPreview,
    schemaType,
    value,
  } = useFormBuilder()

  const focusRef = useRef()

  const handleBlur = useCallback((_event: FocusEvent) => setFocusPath(EMPTY_ARRAY), [setFocusPath])

  const handleFocus = useCallback((_event: FocusEvent) => setFocusPath(EMPTY_ARRAY), [setFocusPath])

  const handleCloseField = useCallback(
    (_fieldName: string) => setOpenPath(EMPTY_ARRAY),
    [setOpenPath]
  )

  const handleCollapseField = useCallback(
    (fieldName: string) => setCollapsedPath((prevState) => setAtPath(prevState, [fieldName], true)),
    [setCollapsedPath]
  )

  const handleCollapseFieldSet = useCallback(
    (fieldSetName: string) =>
      setCollapsedFieldSets((prevState) => setAtPath(prevState, [fieldSetName], true)),
    [setCollapsedFieldSets]
  )

  const handleExpandField = useCallback(
    (fieldName: string) =>
      setCollapsedPath((prevState) => setAtPath(prevState, [fieldName], false)),
    [setCollapsedPath]
  )

  const handleExpandFieldSet = useCallback(
    (fieldSetName: string) =>
      setCollapsedFieldSets((prevState) => setAtPath(prevState, [fieldSetName], false)),
    [setCollapsedFieldSets]
  )

  const handleOpenField = useCallback(
    (fieldName: string) => {
      setOpenPath([fieldName])
    },
    [setOpenPath]
  )

  const handleSelectFieldGroup = useCallback(() => {
    //
  }, [])

  const rootInputProps: Omit<ObjectInputProps, 'renderDefault'> = {
    focusPath,
    elementProps: {ref: focusRef, id, onBlur: handleBlur, onFocus: handleFocus},
    changed: form.node.members.some((m) => m.kind === 'field' && m.field.changed),
    focused,
    groups,
    id,
    level: 0,
    members,
    onChange: form.patch,
    onFieldClose: handleCloseField,
    onFieldCollapse: handleCollapseField,
    onFieldSetCollapse: handleCollapseFieldSet,
    onFieldExpand: handleExpandField,
    onFieldSetExpand: handleExpandFieldSet,
    onPathFocus: setFocusPath,
    onFieldOpen: handleOpenField,
    onFieldGroupSelect: handleSelectFieldGroup,
    path: EMPTY_ARRAY,
    presence: form.node.presence,
    readOnly,
    renderField,
    renderInput,
    renderItem,
    renderPreview,
    schemaType,
    validation: form.node.validation,
    value: value || undefined,
  }

  const renderDefault = useCallback(() => <>default</>, [])

  return <FormInput {...rootInputProps} absolutePath={selectedPath} renderDefault={renderDefault} />
}
