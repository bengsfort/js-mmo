import { EngineConfig, GameLoop, Scene, Time, Vector2 } from "../../build";
import { RendererConfig, Sprite2d, WebRenderer } from "@js-mmo/renderer";

import box from "./assets/box.png";

declare global {
  interface Window {
    __SCENE__: Scene;
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
  RendererConfig.PIXELS_PER_UNIT = new Vector2(32, 32);
  GameLoop.start();

  GameLoop.registerPostUpdateHandler(WebRenderer.create());
  debugCanvas = WebRenderer.getActiveCanvas();
  WebRenderer.registerForceDraw(drawFps);

  const scene = new Scene("Main");
  window.__SCENE__ = scene;

  console.log("Box texture is:", box);
  //   const box = new Sprite2d("Box", box as ImageBitmap, );
}

main();
