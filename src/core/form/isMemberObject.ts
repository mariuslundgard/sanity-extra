import {FieldMember, isObjectSchemaType, ObjectFormNode} from 'sanity'

/** @alpha */
export function isMemberObject(member: FieldMember): member is FieldMember<ObjectFormNode> {
  return isObjectSchemaType(member.field.schemaType)
}
