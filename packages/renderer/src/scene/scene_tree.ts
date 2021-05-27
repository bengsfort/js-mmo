import { Scene } from "./scene";

export function traverseTree(scene: Scene, context: CanvasRenderingContext2D) {
  //   const context: CanvasRenderingContext2D = yield;

  // Draw scene
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  context.fillStyle = scene.background;
  context.fillRect(0, 0, context.canvas.width, context.canvas.height);

  // generator function maybe just keeps returning draw orders to the renderer????
  // renderer is like:
  //let drawCall = traverseTree.next();
  // while (!drawCall.done) {
  // renderDrawable(drawCall.value)
  // drawCall = traverseTree.next();
  // }
  // and this is just like:
  // ...iterating through children like brrrrrrrrrr...
  // finds something with a drawable
  // yield return <that drawable>;

  //   const node = scene;
  //   while (node.childCount > 0) {
  //     if (node.type === "scene") {

  //     }
  //     yield;
  //   }
}
