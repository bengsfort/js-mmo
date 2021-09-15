// eslint-disable @typescript-eslint/no-explicit-any

import { Camera, RendererConfig, Scene, Text2d, WebRenderer } from "@js-mmo/renderer";
import { EngineConfig, GameLoop, GameWorld, InputPlatform, InputSystem, Node2d, Time, Vector2 } from "@js-mmo/engine";

import { BoundingBox } from "./bounding_box";
import { BackgroundBox } from "./background_box";

declare global {
  interface Window {
    __SCENE__: Scene;
    __CAMERA__: Camera;
    __BOX__: typeof BoundingBox;
    __STATIC_BOX__: BoundingBox;
    __MOVING_BOX__: BoundingBox;
    __V2__: typeof Vector2;
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
  EngineConfig.MAX_CELL_NODES = 50;
  EngineConfig.WORLD_SIZE = 64;
  GameLoop.start();

  const worldHalfSize = EngineConfig.WORLD_SIZE / 2;

  // Create renderer and add it to the update loop
  InputSystem.registerInputPlatform(InputPlatform.Web);
  GameLoop.registerRenderer(WebRenderer.create());

  // Force-draw the FPS to the top left corner
  debugCanvas = WebRenderer.getActiveCanvas();
  WebRenderer.registerForceDraw(drawFps);

  const scene = new Scene("Main", new Vector2(0, 0));

  scene.addEventListener("node_added", ev => console.log("External node_added listener on SCENE got payload:", ev));
  scene.addEventListener("node_removed", ev => console.log("External node_removed listener on SCENE got payload:", ev));

  const camera = new Camera("Main", scene);
  camera.zoom = 1;
  scene.background = "#212121";

  window.__CAMERA__ = camera;

  const nwBox = new BackgroundBox(Vector2.One.multiplyScalar(-worldHalfSize / 2), worldHalfSize, "#f8f8f8", scene);
  const neBox = new BackgroundBox(
    scene.position.add(Vector2.One.multiplyScalar(worldHalfSize / 2)),
    worldHalfSize,
    "#f88",
    scene
  );
  const swBox = new BackgroundBox(
    scene.position.add(new Vector2(-worldHalfSize / 2, -worldHalfSize / 2)),
    worldHalfSize,
    "#ff8",
    scene
  );
  const seBox = new BackgroundBox(
    scene.position.add(new Vector2(worldHalfSize / 2, -worldHalfSize / 2)),
    worldHalfSize,
    "#88f",
    scene
  );

  const staticBox = new BoundingBox(new Vector2(0, 0), "#00f", scene);
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

  GameWorld.registerActiveScene(scene);
  WebRenderer.addScene(scene, camera);

  window.__SCENE__ = scene;
  window.__STATIC_BOX__ = staticBox;
  window.__MOVING_BOX__ = movingBox;
  window.__BOX__ = BoundingBox;
  window.__V2__ = Vector2;
}

main();
