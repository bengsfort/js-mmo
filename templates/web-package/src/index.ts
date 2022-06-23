import { EngineConfig, GameLoop, Group, Time, Vector2 } from "@js-mmo/engine";
import { Camera, ImageManager, RendererConfig, Scene, Sprite2d, WebRenderer } from "@js-mmo/renderer";

import box from "./assets/box.png";
import tile32 from "./assets/32x32.png";

declare global {
  interface Window {
    __SCENE__: Scene;
    __CAMERA__: Camera;
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

  const scene = new Scene("Main", Vector2.Zero);
  const camera = new Camera("MainCamera");
  window.__SCENE__ = scene;
  window.__CAMERA__ = camera;

  WebRenderer.addScene(scene, camera);

  const group = new Group("normal_sprites", scene);
  group.position = new Vector2(64, 128);

  const normal = new Sprite2d("static_box", box, new Vector2(32, 32), false);
  normal.setParent(group);

  window.__SCENE__ = scene;
  window.__CAMERA__ = camera;
}

void main();
