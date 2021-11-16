import { Fragment, isVNode, VNode, VNodeChild } from 'vue';

export const objectToString = Object.prototype.toString;
export const toTypeString = (value: unknown): string => objectToString.call(value);

export const toRawType = (value: unknown): string => {
  // extract "RawType" from strings like "[object RawType]"
  return toTypeString(value).slice(8, -1);
};

export const isArray = Array.isArray;

export const isObject = (val: unknown): val is Record<any, any> =>
  val !== null && typeof val === 'object';

export const isFunction = (val: unknown): val is Function => typeof val === 'function';

export const isString = (val: unknown): val is string => typeof val === 'string';

export const isBool = (val: unknown): val is boolean => typeof val === 'boolean';

export const isNumber = (val: unknown): val is number => typeof val === 'number';

export const isHTMLElement = (val: unknown) => toRawType(val).startsWith('HTML');

export const isFragment = (node: unknown): node is VNode => isVNode(node) && node.type === Fragment;

export const isComment = (node: VNodeChild) => (node as VNode).type === Comment;

export const isTemplate = (node: VNodeChild) => (node as VNode).type === 'template';

function getChildren(node: VNode, depth: number): undefined | VNode {
  if (isComment(node)) return;
  if (isFragment(node) || isTemplate(node)) {
    return depth > 0 ? getFirstVNode(node.children as VNodeChild, depth - 1) : undefined;
  }
  return node;
}

export const getFirstVNode = (nodes: VNodeChild, maxDepth = 3): ReturnType<typeof getChildren> => {
  if (Array.isArray(nodes)) {
    return getChildren(nodes[0] as VNode, maxDepth);
  } else {
    return getChildren(nodes as VNode, maxDepth);
  }
};

export function generateId(len = 10) {
  return Math.random().toString(36).substr(2, len);
}

export const NOOP = () => {};
