import { Camera, IsometricCamera, Scene, WebRenderer } from "@js-mmo/renderer";
import { EngineConfig, GameLoop, InputPlatform, InputSystem, Time, Vector2 } from "@js-mmo/engine";

import { inputMap } from "./input/input_mappings";

/**
 * This is a test gameplay scene. It is not representative of how the game will be initialized and ran,
 * it is strictly for development purposes to make sure that gameplay is able to be iterated on rapidly.
 */

let debugCanvas: HTMLCanvasElement;

// Make a helper function to draw FPS at all times.
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
  // Engine / Renderer configs.
  EngineConfig.LOG_VERBOSE = true;

  // Setup and prepare input.
  void InputSystem.registerInputPlatform(InputPlatform.Web);
  InputSystem.registerInputMap(inputMap);

  GameLoop.start();
  GameLoop.registerRenderer(WebRenderer.create());

  debugCanvas = WebRenderer.getActiveCanvas();
  WebRenderer.registerForceDraw(drawFps);

  // Main scene
  const scene = new Scene("Main");
  const camera = new IsometricCamera("MainCamera", Vector2.Zero, Vector2.One, 0);

  // UI Scene
  const uiScene = new Scene("UI");
  const uiCamera = new Camera("UICamera", Vector2.Zero, Vector2.One, 0, uiScene);

  WebRenderer.addScene(scene, camera);
  WebRenderer.addScene(uiScene, uiCamera);
}

void main();
