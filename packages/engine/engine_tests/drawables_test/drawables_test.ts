import { RendererConfig, WebRenderer } from "@js-mmo/renderer";
import { EngineConfig, GameLoop, Time, Vector2 } from "@js-mmo/engine";

import { RotatingBox } from "./rotating_box";

window.TIME = Time;
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

  // Create renderer and add it to the update loop
  GameLoop.registerPostUpdateHandler(WebRenderer.create());

  // Force-draw the FPS to the top left corner
  debugCanvas = WebRenderer.getActiveCanvas();
  WebRenderer.registerForceDraw(drawFps);

  const root = new RotatingBox(new Vector2(64, 128), new Vector2(1, 1), 45, 15);
  const nodes = [root];
  for (let i = 0; i < 10; i++) {
    console.log("Node", i, "making the following its parent", nodes[i]);
    nodes.push(new RotatingBox(new Vector2(32, 32), new Vector2(1.2, 1.2), 0, i - 5, nodes[i]));
  }
  window.NODES = nodes;
}

main();
