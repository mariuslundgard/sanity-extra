import {SchemaType} from 'sanity'

/** @alpha */
export function isDescendentOfType(schemaType: SchemaType, typeName: string): boolean {
  if (!schemaType.type) {
    return false
  }

  if (schemaType.type.name === typeName) {
    return true
  }

  return isDescendentOfType(schemaType.type, typeName)
}
