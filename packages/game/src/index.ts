import { GameLoop, Time, EngineConfig } from "@js-mmo/engine";
import { WebRenderer } from "@js-mmo/renderer";

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
  EngineConfig.FIXED_UPDATE_ONLY = false;
  GameLoop.start();

  // Create renderer and add it to the update loop
  GameLoop.registerPostUpdateHandler(WebRenderer.create());

  // Force-draw the FPS to the top left corner
  debugCanvas = WebRenderer.getActiveCanvas();
  WebRenderer.registerForceDraw(drawFps);
}

main();
