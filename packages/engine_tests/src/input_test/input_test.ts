import {
  EngineConfig,
  GameLoop,
  InputPlatform,
  InputSystem,
  KeyboardKeys,
  SceneObject,
  Time,
  Vector2,
} from "@js-mmo/engine";
import { RendererConfig, Scene, WebRenderer } from "@js-mmo/renderer";

import { InputEvents } from "./input_events";
import { MovingBox } from "./moving_box";

declare global {
  interface Window {
    MOVING_BOX: SceneObject;
  }
}

let debugCanvas: HTMLCanvasElement;

const drawFps = () => {
  if (!debugCanvas) return;
  const ctx = debugCanvas.getContext("2d") as CanvasRenderingContext2D;
  ctx.save();
  ctx.textAlign = "left";
  ctx.fillStyle = "#ffffff";
  ctx.font = "16px monospace";
  ctx.fillText(`Current FPS: ${Time.getCurrentFps().toFixed(2)}`, 16, 48);
  ctx.restore();
};

function main() {
  EngineConfig.LOG_VERBOSE = false;
  EngineConfig.FIXED_UPDATE_ONLY = false;
  RendererConfig.PIXELS_PER_UNIT = 32;

  void InputSystem.registerInputPlatform(InputPlatform.Web);
  InputSystem.registerInputMap({
    [InputEvents.MoveUp]: [KeyboardKeys.W, KeyboardKeys.ArrowUp],
    [InputEvents.MoveDown]: [KeyboardKeys.S, KeyboardKeys.ArrowDown],
    [InputEvents.MoveLeft]: [KeyboardKeys.A, KeyboardKeys.ArrowLeft],
    [InputEvents.MoveRight]: [KeyboardKeys.D, KeyboardKeys.ArrowRight],
    [InputEvents.Grow]: KeyboardKeys.E,
    [InputEvents.Shrink]: KeyboardKeys.Q,
    [InputEvents.Rotate]: KeyboardKeys.R,
  });

  GameLoop.start();

  // Create renderer and add it to the update loop
  GameLoop.registerRenderer(WebRenderer.create());

  // Force-draw the FPS to the top left corner
  debugCanvas = WebRenderer.getActiveCanvas();
  WebRenderer.registerForceDraw(drawFps);

  const scene = new Scene();
  const box = new MovingBox(new Vector2(0, 0), new Vector2(1, 1), 10);
  scene.addChild(box);

  WebRenderer.setActiveRender(scene);
  window.MOVING_BOX = box;
}

main();
