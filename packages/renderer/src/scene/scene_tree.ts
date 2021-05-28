import { Node } from "@js-mmo/engine";

import { Drawable } from "../drawables/drawable";
import { RenderingNode } from "../drawables/rendering_node";

import { Scene } from "./scene";

export function* traverseTree(scene: Scene) {
  // Draw scene
  let root: Node | Scene = scene;
  const nextRoots: Node[] = [];
  yield root as Scene;

  while (root.childCount > 0) {
    // Draw all of the current children that are drawable
    for (let i = 0; i < root.childCount; i++) {
      // If this child has children, queue it up
      const node = root.children[i];
      if (node.childCount > 0) {
        nextRoots.push(node);
      }

      if (root.children[i].type === "draw") {
        //  Cast to unknown casue my types are bad
        const renderingNode = node as unknown;
        yield renderingNode as RenderingNode<Drawable<unknown>>;
      }
    }

    if (nextRoots.length > 0) {
      root = nextRoots.shift() as Node;
    } else {
      // We're done!
      break;
    }
  }
}
