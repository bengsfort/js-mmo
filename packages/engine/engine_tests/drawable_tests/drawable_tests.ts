import { RendererConfig, Sprite2d, WebRenderer, ImageManager } from "@js-mmo/renderer";

import { EngineConfig, GameLoop, Scene, Time, Vector2 } from "../../build";

import box from "./assets/box.png";
import tile32 from "./assets/32x32.png";

declare global {
  interface Window {
    __SCENE__: Scene;
    __IMAGE_MANAGER__: typeof ImageManager;
    __SPRITES__: { [key: string]: Sprite2d };
    __STATIC_SPRITE__: Sprite2d;
    __FLIPPED_SPRITE__;
    __DEFAULT_SPRITE__: Sprite2d;
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
  EngineConfig.LOG_VERBOSE = true;
  EngineConfig.FIXED_UPDATE_ONLY = false;
  RendererConfig.PIXELS_PER_UNIT = Vector2.One;
  GameLoop.start();

  GameLoop.registerPostUpdateHandler(WebRenderer.create());
  debugCanvas = WebRenderer.getActiveCanvas();
  WebRenderer.registerForceDraw(drawFps);

  window.__IMAGE_MANAGER__ = ImageManager;

  const scene = new Scene("Main");
  scene.localPosition.set(128, 128);
  window.__SCENE__ = scene;

  const normal = new Sprite2d("static_box", box, new Vector2(32, 32), false, scene);
  const forceDefault = new Sprite2d("force_default", "nonexistent.png", new Vector2(32, 32), false, scene);
  forceDefault.localPosition.set(32, 0);

  const flipped = new Sprite2d("flipped", tile32, new Vector2(32, 32), false, scene);
  flipped.flipX = false;
  flipped.flipY = true;
  flipped.localPosition.set(64, 0);

  window.__SPRITES__ = {
    normal,
    forceDefault,
    flipped,
  };
}

main();
