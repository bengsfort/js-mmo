import { EngineConfig, GameLoop, Time, Vector2 } from "../../build";
import { RendererConfig, Scene, Sprite2d, TilesetManager, WebRenderer } from "@js-mmo/renderer";

declare global {
  interface Window {
    __SCENE__: Scene;
    __TILESET_MANAGER__: typeof TilesetManager;
    __STATIC_SPRITE__: Sprite2d;
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

async function main() {
  EngineConfig.LOG_VERBOSE = true;
  EngineConfig.FIXED_UPDATE_ONLY = false;
  RendererConfig.PIXELS_PER_UNIT = 1;
  RendererConfig.DEBUG_SHOW_ORIGINS = false;
  GameLoop.start();

  GameLoop.registerPostUpdateHandler(WebRenderer.create());
  debugCanvas = WebRenderer.getActiveCanvas();
  WebRenderer.registerForceDraw(drawFps);

  const scene = new Scene("Main");
  scene.localPosition.set(128, 128);
  window.__SCENE__ = scene;

  window.__TILESET_MANAGER__ = TilesetManager;
  if (await TilesetManager.load("./assets/dev_env_sheet.json")) {
    const tileset = TilesetManager.get("./assets/dev_env_sheet.json");
    const tile = new Sprite2d("tile1", tileset[0], new Vector2(32, 32), false, scene);
    const tile2 = new Sprite2d("tile2", tileset[1], new Vector2(32, 32), false, scene);
    tile2.localPosition.set(32, 0);
    const tile3 = new Sprite2d("tile3", tileset[2], new Vector2(32, 32), false, scene);
    tile3.localPosition.set(64, 0);
    const tile4 = new Sprite2d("tile4", tileset[3], new Vector2(32, 32), false, scene);
    tile4.localPosition.set(96, 0);
    window.__STATIC_SPRITE__ = tile;
  }
}

void main();
