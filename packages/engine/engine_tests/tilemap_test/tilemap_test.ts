import { RendererConfig, Scene, Tilemap, TilesetManager, WebRenderer } from "@js-mmo/renderer";

import { EngineConfig, GameLoop, Time, Vector2, TiledMap, TiledRenderOrder } from "../../build";

import devMap from "./assets/dev_sandbox_map.json";

declare global {
  interface Window {
    __SCENE__: Scene;
    __TILESET;
    __TILEMAP__: Tilemap;
  }
}

const TILESET_PATH = "./assets/dev_env_sheet.json";

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

async function main() {
  EngineConfig.LOG_VERBOSE = true;
  EngineConfig.FIXED_UPDATE_ONLY = false;
  RendererConfig.PIXELS_PER_UNIT = 1;
  RendererConfig.DEBUG_SHOW_ORIGINS = false;

  GameLoop.start();
  GameLoop.registerRenderer(WebRenderer.create());

  debugCanvas = WebRenderer.getActiveCanvas();
  WebRenderer.registerForceDraw(drawFps);

  const scene = new Scene("Main");
  scene.position = new Vector2(1, 1);
  window.__SCENE__ = scene;

  if (await TilesetManager.load(TILESET_PATH)) {
    const tileset = TilesetManager.get(TILESET_PATH);

    const map = new Tilemap("BaseLayer", devMap as TiledMap, tileset, 0, Vector2.Zero, scene);
    window.__TILEMAP__ = map;
  }

  WebRenderer.setActiveRender(scene);
}

void main();
