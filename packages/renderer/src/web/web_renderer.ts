// This module is exported `export * as WebRenderer`, and is intended to be a singleton.
// Exported functions are the public API

import { TiledOrientation, Vector2 } from "@js-mmo/engine";

import { Camera } from "../camera/camera";
import { Drawable } from "../drawables/drawable";
import { DAttrs, renderDrawable } from "../drawables/render_drawables";
import { CLEAR_COLOR, PIXEL_RATIO } from "../renderer_config";
import { RenderingNode } from "../drawables/rendering_node";
import { Scene } from "../scene/scene";
import { logger } from "../logger";
import { traverseTree } from "../scene/scene_tree";

import { UnsubscribeCallback, bindCanvasToWindowSize, createCanvas } from "./canvas";

let activeCanvas: HTMLCanvasElement;
let activeContext: CanvasRenderingContext2D;

// eslint-disable-next-line
let resizeUnsub: UnsubscribeCallback;
let isPaused = false;

let renderCalls: [Scene, Camera?][] = [];

const registeredDrawables: Drawable<DAttrs>[] = [];
const registeredForceDraw: VoidFunction[] = [];

const renderLoop = (): void => {
  if (isPaused) return;

  activeContext.clearRect(0, 0, activeCanvas.width, activeCanvas.height);
  activeContext.fillStyle = CLEAR_COLOR;
  activeContext.fillRect(0, 0, activeCanvas.width, activeCanvas.height);

  // Iterate through active scenes/cameras and draw all objects within them
  renderCalls.forEach(([scene, camera]) => {
    activeContext.setTransform(PIXEL_RATIO, 0, 0, PIXEL_RATIO, 0, 0);
    activeContext.save();

    if (scene.background !== "transparent") {
      activeContext.fillStyle = scene.background;
      activeContext.fillRect(0, 0, activeCanvas.width, activeCanvas.height);
    }

    const cameraOffset = camera?.getViewPosition(camera.position) ?? Vector2.Zero;
    // @todo: This could probably be improved for isometric so that we don't have to do weird movement
    if (camera?.orientation === TiledOrientation.Isometric) {
      cameraOffset.x += activeCanvas.width / PIXEL_RATIO / 2;
    }
    const cameraScale = Math.max(0, camera?.zoom ?? 1);

    // Move scene viewport to camera viewport
    activeContext.translate(cameraOffset.x, cameraOffset.y);
    activeContext.rotate(camera?.rotation ?? 0); // @todo, proper implementation
    activeContext.scale(cameraScale * PIXEL_RATIO, cameraScale * PIXEL_RATIO);

    const tree = traverseTree(scene);
    let drawOrder: IteratorResult<RenderingNode> = tree.next();
    while (!drawOrder.done) {
      activeContext.save();
      renderDrawable(drawOrder.value.drawable, activeContext, camera);
      // Restore camera viewport context, move to next drawable
      activeContext.restore();
      drawOrder = tree.next();
    }

    activeContext.restore();
  });

  // Force draws are just constants, so just copy the array and render this frame.
  const tickForceDraw = [...registeredForceDraw];
  for (let f = 0; f < tickForceDraw.length; f++) {
    activeContext.save();
    tickForceDraw[f]();
    activeContext.restore();
  }
};

// Public API
export const addScene = (scene: Scene, camera?: Camera) => {
  renderCalls.push([scene, camera]);
};

export const removeScene = (scene: Scene) => {
  const renders = renderCalls.slice(0);
  renderCalls = renders.filter(([s]) => s.id !== scene.id);
};

export const getActiveCanvas = () => activeCanvas;

export const pause = (val: boolean) => {
  isPaused = val;
  logger.logInfo(isPaused ? "Rendering paused." : "Rendering unpaused.");
};

/**
 * Creates a canvas and instance of the renderer. Returns an update function, which can
 * directly be thrown into a postUpdate handler:
 *
 * @example GameLoop.registerPostUpdateHandler(WebRenderer.create());
 *
 * @param width The width of the renderer. Defaults to window width.
 * @param height The height of the renderer. Defaults to window width.
 */
export const create = (width?: number, height?: number) => {
  // Reset queue
  registeredDrawables.splice(0);
  registeredForceDraw.splice(0);

  // Create canvas
  activeCanvas = createCanvas(width, height);
  activeContext = activeCanvas.getContext("2d") as CanvasRenderingContext2D;

  // Listen for events
  window.addEventListener("blur", blurHandler);
  window.addEventListener("focus", focusHandler);
  resizeUnsub = bindCanvasToWindowSize(activeCanvas);

  // Add to dom
  document.body.append(activeCanvas);

  return renderLoop;
};

export const registerForceDraw = (func: VoidFunction) => {
  registeredForceDraw.push(func);
};

export const registerDrawable = <T extends DAttrs>(drawable: Drawable<T>) => {
  registeredDrawables.push(drawable);
};

// Private API
function blurHandler() {
  pause(true);
}

function focusHandler() {
  pause(false);
}
