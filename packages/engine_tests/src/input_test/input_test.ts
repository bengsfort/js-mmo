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
import { Camera, RendererConfig, Scene, WebRenderer } from "@js-mmo/renderer";

import { InputEvents } from "./input_events";
import { MovingBox } from "./moving_box";

declare global {
  interface Window {
    __SCENE__: Scene;
    __MOVING_BOX__: SceneObject;
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
  ctx.fillText(`Current FPS: ${Time.getCurrentFps().toFixed(2)}`, 24, 48);
  ctx.restore();
};

const drawCameraPos = (camera: Camera) => () => {
  if (!debugCanvas) return;
  const ctx = debugCanvas.getContext("2d") as CanvasRenderingContext2D;
  ctx.save();
  ctx.textAlign = "left";
  ctx.fillStyle = "#ffffff";
  ctx.font = "16px monospace";
  ctx.fillText(`Camera pos: (${camera.position.x.toFixed(2)}, ${camera.position.y.toFixed(2)})`, 24, 64);
  ctx.restore();
};

function main() {
  EngineConfig.LOG_VERBOSE = false;
  EngineConfig.FIXED_UPDATE_ONLY = false;
  RendererConfig.PIXELS_PER_UNIT = 32;
  RendererConfig.SHOW_UNIT_GRID = true;

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
  const camera = new Camera();

  const box = new MovingBox(new Vector2(0, 0), new Vector2(1, 1), 10);
  box.setParent(scene);

  GameLoop.registerUpdateHandler(() => {
    if (InputSystem.inputEventDown(InputEvents.MoveUp)) {
      camera.localPosition.y -= 1 / Time.getDeltaTime();
    }
    if (InputSystem.inputEventDown(InputEvents.MoveDown)) {
      camera.localPosition.y += 1 / Time.getDeltaTime();
    }
    if (InputSystem.inputEventDown(InputEvents.MoveLeft)) {
      camera.localPosition.x -= 1 / Time.getDeltaTime();
    }
    if (InputSystem.inputEventDown(InputEvents.MoveRight)) {
      camera.localPosition.x += 1 / Time.getDeltaTime();
    }
    if (InputSystem.inputEventDown(InputEvents.Grow)) {
      camera.zoom += 1 / Time.getDeltaTime();
    }
    if (InputSystem.inputEventDown(InputEvents.Shrink)) {
      camera.zoom -= 1 / Time.getDeltaTime();
    }
  });

  WebRenderer.registerForceDraw(drawCameraPos(camera));
  WebRenderer.addScene(scene, camera);

  window.__MOVING_BOX__ = box;
  window.__SCENE__ = scene;
}

main();
