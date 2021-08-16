import { Node } from "@js-mmo/engine";

export function getNodeCount(start?: Node, _count = 0): number {
  if (!start) return _count;
  if (start.childCount > 0) {
    return start.children.reduce((total, child) => {
      return getNodeCount(child, total);
    }, _count + 1);
  }
  return _count + 1;
}
