// eslint-disable @typescript-eslint/no-explicit-any

import { Camera, RendererConfig, Scene, WebRenderer } from "@js-mmo/renderer";
import { EngineConfig, GameLoop, InputPlatform, InputSystem, Node2d, Time, Vector2 } from "@js-mmo/engine";

import { BoundingBox } from "./bounding_box";

declare global {
  interface Window {
    NODES: Node2d[];
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
  GameLoop.start();

  // Create renderer and add it to the update loop
  InputSystem.registerInputPlatform(InputPlatform.Web);
  GameLoop.registerRenderer(WebRenderer.create());

  // Force-draw the FPS to the top left corner
  debugCanvas = WebRenderer.getActiveCanvas();
  WebRenderer.registerForceDraw(drawFps);

  const scene = new Scene();
  const camera = new Camera("Main", scene);
  scene.background = "#212121";

  const staticBox = new BoundingBox(
    new Vector2(
      debugCanvas.clientWidth / RendererConfig.PIXEL_RATIO / 2,
      debugCanvas.clientHeight / RendererConfig.PIXEL_RATIO / 2
    ),
    "#00f",
    scene
  );
  const movingBox = new BoundingBox(new Vector2(0, 0), "#3a0", scene);

  GameLoop.registerUpdateHandler(() => {
    const worldPos = camera.worldFromScreen(InputSystem.getPointerCoords());

    if (InputSystem.getPointerDown()) {
      if (staticBox.bounds.includesPoint(worldPos)) {
        staticBox.color = "#ff0";
      }
    }

    movingBox.localPosition.set(worldPos.x, worldPos.y);
    if (staticBox.bounds.intersects(movingBox.bounds)) {
      movingBox.color = "#f00";
    }
  });

  WebRenderer.addScene(scene, camera);
  window.NODES = [staticBox];
}

main();
