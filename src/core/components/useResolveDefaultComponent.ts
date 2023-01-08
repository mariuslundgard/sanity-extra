import {ComponentType, createElement, ReactElement, useCallback} from 'react'
import {SchemaType} from 'sanity'

export function useResolveDefaultComponent<T extends {schemaType?: SchemaType}>(props: {
  componentProps: Omit<T, 'renderDefault'>
  componentResolver: (schemaType: SchemaType) => ComponentType<Omit<T, 'renderDefault'>>
}): ReactElement<T> {
  const {componentResolver, componentProps} = props

  // NOTE: this will not happen, but we do this to avoid updating too many places
  // TODO: We need to clean up the preview machinery + types to remove this
  if (!componentProps.schemaType) {
    throw new Error('the `schemaType` property must be defined')
  }

  const defaultResolvedComponent = componentResolver(componentProps.schemaType)

  const renderDefault = useCallback(
    (parentTypeProps: T) => {
      if (!parentTypeProps.schemaType?.type) {
        // In theory this should not be possible, and this error should never be thrown
        throw new Error('Attempted to render form component of non-existent parent type')
      }

      // The components property is removed from the schemaType object
      // in order to prevent that a component is render itself
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const {components, ...restSchemaType} = parentTypeProps.schemaType
      const parentTypeResolvedComponent = componentResolver(restSchemaType)
      return createElement(parentTypeResolvedComponent, parentTypeProps)
    },
    [componentResolver]
  )

  return createElement(defaultResolvedComponent, {
    ...componentProps,
    renderDefault,
  }) as ReactElement<T>
}
