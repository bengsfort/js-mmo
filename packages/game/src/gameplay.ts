import { Camera, IsometricCamera, Scene, Tilemap, TilesetManager, WebRenderer } from "@js-mmo/renderer";
import {
  EngineConfig,
  GameLoop,
  InputPlatform,
  InputSystem,
  SceneObject,
  TiledMap,
  Time,
  Vector2,
} from "@js-mmo/engine";

import { LocalPlayer } from "./players/local_player";
import { inputMap } from "./input/input_mappings";
import SandboxMap from "./assets/dev_sandbox_map.json";
import { TILESET_PATH } from "./assets";

declare global {
  interface Window {
    __SCENE__: Scene;
    __CAMERA__: Camera;
    __TILEMAP__: SceneObject;
    __PLAYER__: SceneObject;
  }
}

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

async function main() {
  // Engine / Renderer configs.
  EngineConfig.LOG_VERBOSE = true;

  // Setup and prepare input.
  void InputSystem.registerInputPlatform(InputPlatform.Web);
  InputSystem.registerInputMap(inputMap);

  // Load required assets
  const loadResult = await TilesetManager.load(TILESET_PATH);
  if (loadResult === false) {
    console.error("Could not load tileset, stopping...");
    return;
  }

  GameLoop.start();
  GameLoop.registerRenderer(WebRenderer.create());

  debugCanvas = WebRenderer.getActiveCanvas();
  WebRenderer.registerForceDraw(drawFps);

  // Main scene
  const scene = new Scene("Main");
  const camera = new IsometricCamera("MainCamera", Vector2.Zero, Vector2.One, 0);
  camera.zoom = 2;

  const tileset = TilesetManager.get(TILESET_PATH);
  const map = new Tilemap("Sandbox", SandboxMap as TiledMap, tileset, 0, Vector2.Zero, scene);
  const player = new LocalPlayer("Matt", new Vector2(3, 3));

  map.addChild(player);
  player.addChild(camera);
  camera.localPosition.set(-8, -8);

  window.__SCENE__ = scene;
  window.__CAMERA__ = camera;
  window.__TILEMAP__ = map;
  window.__PLAYER__ = player;

  // UI Scene
  const uiScene = new Scene("UI");
  const uiCamera = new Camera("UICamera", Vector2.Zero, Vector2.One, 0, uiScene);

  WebRenderer.addScene(scene, camera);
  WebRenderer.addScene(uiScene, uiCamera);
}

void main();
