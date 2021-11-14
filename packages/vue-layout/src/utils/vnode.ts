import type { VNode, VNodeChild } from 'vue';
import { Fragment, isVNode } from 'vue';

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
