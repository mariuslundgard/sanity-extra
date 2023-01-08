import {BaseFormNode, ObjectFormNode} from 'sanity'
import {isFieldMember} from './isFieldMember'

/** @alpha */
export function findField<N extends BaseFormNode = BaseFormNode>(
  node: ObjectFormNode,
  name: string
): N | undefined {
  return node.members.filter(isFieldMember).find((m) => m.name === name)?.field as N | undefined
}
