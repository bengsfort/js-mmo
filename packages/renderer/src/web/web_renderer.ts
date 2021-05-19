// This module is exported `export * as WebRenderer`, and is intended to be a singleton.
// Exported functions are the public API

import { DAttrs, renderDrawable } from "../drawables/render_drawables";
import { CLEAR_COLOR } from "../renderer_config";
import { Drawable } from "../drawables/drawable";
import { logger } from "../logger";

import { UnsubscribeCallback, bindCanvasToWindowSize, createCanvas } from "./canvas";

let activeCanvas: HTMLCanvasElement;
let activeContext: CanvasRenderingContext2D;
let resizeUnsub: UnsubscribeCallback;
let isPaused = false;

const registeredDrawables: Drawable<DAttrs>[] = [];
const registeredForceDraw: VoidFunction[] = [];

const renderLoop = (): void => {
  if (isPaused) return;
  activeContext.clearRect(0, 0, activeCanvas.width, activeCanvas.height);
  activeContext.fillStyle = CLEAR_COLOR;
  activeContext.fillRect(0, 0, activeCanvas.width, activeCanvas.height);

  // Drawables are consumed every frame, so empty the array and render what was in it.
  const tickDrawables = registeredDrawables.splice(0);
  for (let d = 0; d < tickDrawables.length; d++) {
    renderDrawable(tickDrawables[d], activeContext);
  }

  // Force draws are just constants, so just copy the array and render this frame.
  const tickForceDraw = [...registeredForceDraw];
  for (let f = 0; f < tickForceDraw.length; f++) {
    tickForceDraw[f]();
  }
};

// Public API
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
