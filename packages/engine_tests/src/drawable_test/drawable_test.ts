import { EngineConfig, GameLoop, Group, Time, Vector2 } from "@js-mmo/engine";
import { Camera, ImageManager, RendererConfig, Scene, Sprite2d, WebRenderer } from "@js-mmo/renderer";

import box from "./assets/box.png";
import tile32 from "./assets/32x32.png";

declare global {
  interface Window {
    __SCENE__: Scene;
    __CAMERA__: Camera;
    __IMAGE_MANAGER__: typeof ImageManager;
    __SPRITES__: { [key: string]: Sprite2d | Group };
    __STATIC_SPRITE__: Sprite2d;
    __FLIPPED_SPRITE__: Sprite2d;
    __DEFAULT_SPRITE__: Sprite2d;
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
  EngineConfig.FIXED_UPDATE_ONLY = false;
  RendererConfig.PIXELS_PER_UNIT = 1;

  await ImageManager.preload([box, tile32]);

  GameLoop.start();

  GameLoop.registerRenderer(WebRenderer.create());
  debugCanvas = WebRenderer.getActiveCanvas();
  WebRenderer.registerForceDraw(drawFps);

  window.__IMAGE_MANAGER__ = ImageManager;

  const scene = new Scene("Main", Vector2.Zero);
  const camera = new Camera("MainCamera", Vector2.Zero, Vector2.One);
  window.__SCENE__ = scene;
  window.__CAMERA__ = camera;

  WebRenderer.addScene(scene, camera);

  const group2 = new Group("normal_sprites", new Vector2(64, 128), Vector2.One, 0, scene);
  const normal = new Sprite2d("static_box", box, new Vector2(32, 32), false, group2);
  const forceDefault = new Sprite2d("force_default", "nonexistent.png", new Vector2(32, 32), false, group2);

  forceDefault.origin.set(0.5, 0.5);
  forceDefault.localPosition.set(88, 0);

  const flipped = new Sprite2d("flipped", tile32, new Vector2(32, 32), false, group2);
  flipped.flipX = true;
  flipped.flipY = true;
  flipped.localPosition.set(196, 0);
  flipped.origin.set(0.5, 0.5);
  flipped.localScale.set(1.5, 1.5);
  flipped.rotation = (0 * Math.PI) / 360;

  GameLoop.registerUpdateHandler(() => {
    flipped.rotation += 10 * 0.01666;
  });

  window.__SPRITES__ = {
    normal,
    forceDefault,
    flipped,
    group2,
  };
}

void main();
