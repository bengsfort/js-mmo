// This module is exported `export * as WebRenderer`, and is intended to be a singleton.
// Exported functions are the public API

import { CLEAR_COLOR, PIXEL_RATIO } from "../renderer_config";
import { DAttrs, renderDrawable } from "../drawables/render_drawables";
import { UnsubscribeCallback, bindCanvasToWindowSize, createCanvas } from "./canvas";

import { Camera } from "../camera/camera";
import { Drawable } from "../drawables/drawable";
import { NodeTypes } from "@js-mmo/engine";
import { RenderingNode } from "../drawables/rendering_node";
import { Scene } from "../scene/scene";
import { logger } from "../logger";
import { traverseTree } from "../scene/scene_tree";

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

  // Traverse through the tree
  if (activeScene !== null) {
    // @todo: translate 0,0 to middle of screen
    if (activeCamera !== null) {
      const cameraOffset = activeCamera.position;

      // isometric HERE
      // activeContext.canvas.width / 2 -
      // activeContext.canvas.height / 2 -
      // clip space = scale * rotation * translation * position * width * height
      // scale -> rotate -> translate
      activeContext.setTransform(
        activeCamera.zoom * PIXEL_RATIO,
        0,
        0,
        activeCamera.zoom * PIXEL_RATIO,
        cameraOffset.x * activeCamera.zoom * PIXEL_RATIO,
        cameraOffset.y * activeCamera.zoom * PIXEL_RATIO
      );
    }

    const tree = traverseTree(activeScene);
    let drawOrder: IteratorResult<RenderingNode | Scene> = tree.next();
    while (!drawOrder.done) {
      activeContext.save();
      if (drawOrder.value.type === NodeTypes.Scene) {
        activeContext.clearRect(0, 0, activeCanvas.width, activeCanvas.height);
        activeContext.fillStyle = (drawOrder.value as Scene).background;
        activeContext.fillRect(0, 0, activeCanvas.width, activeCanvas.height);
      }
      if (drawOrder.value.type === NodeTypes.Draw) {
        renderDrawable((drawOrder.value as RenderingNode<Drawable<DAttrs>>).drawable, activeContext);
      }
      activeContext.restore();
      drawOrder = tree.next();
    }
  }

  if (activeCamera !== null) {
    // this is fucking everything up, but is necessary
    activeContext.setTransform(PIXEL_RATIO, 0, 0, PIXEL_RATIO, 0, 0);
  }

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
