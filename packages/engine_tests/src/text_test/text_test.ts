import { EngineConfig, GameLoop, InputPlatform, InputSystem, KeyboardKeys, Time, Vector2 } from "@js-mmo/engine";
import { Camera, ImageManager, RendererConfig, Scene, WebRenderer } from "@js-mmo/renderer";

import box from "./assets/box.png";
import { InputEvents } from "./input_events";
import { TestPlayer } from "./test_player";

declare global {
  interface Window {
    __TEST_PLAYER__: TestPlayer;
  }
}

let debugCanvas: HTMLCanvasElement;

const drawFps = () => {
  if (!debugCanvas) return;
  const ctx = debugCanvas.getContext("2d") as CanvasRenderingContext2D;
  ctx.textAlign = "left";
  ctx.fillStyle = "#ffffff";
  ctx.font = "16px monospace";
  ctx.fillText(`Current FPS: ${Time.getCurrentFps().toFixed(2)}`, 16, 48);
};

async function main() {
  EngineConfig.LOG_VERBOSE = true;
  RendererConfig.PIXELS_PER_UNIT = 1;
  RendererConfig.DEBUG_SHOW_ORIGINS = false;

  // Preload assets
  await ImageManager.preload([box]);

  // Init input
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
  GameLoop.registerRenderer(WebRenderer.create());
  debugCanvas = WebRenderer.getActiveCanvas();
  WebRenderer.registerForceDraw(drawFps);

  const scene = new Scene("Main", Vector2.Zero);
  const camera = new Camera("Camera");

  const movingGroup = new TestPlayer("Kikkeli", new Vector2(64, 128), Vector2.One, 20);
  window.__TEST_PLAYER__ = movingGroup;
  scene.addChild(movingGroup);

  WebRenderer.addScene(scene, camera);
}

void main();
