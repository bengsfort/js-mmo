import { Drawable, RendererConfig, WebRenderer, createRect } from "@js-mmo/renderer";
import { EngineConfig, GameLoop, Node2d, Time, Vector2 } from "@js-mmo/engine";
import { DRect } from "@js-mmo/renderer/build/drawables/rect/rect_internal";
import { registerDrawable } from "@js-mmo/renderer/build/web/web_renderer";

import { RotatingBox } from "../engine_tests/drawables_test/rotating_box";

window.TIME = Time;
window.SPEED = 10;
window.BUFFER = 35;
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

  const root = new RotatingBox(new Vector2(64, 128), new Vector2(1, 1), 0, 45);
  const nodes = [root];
  for (let i = 0; i < 10; i++) {
    console.log("Node", i, "making the following its parent", nodes[i]);
    nodes.push(new RotatingBox(new Vector2(32, 32), new Vector2(1.2, 1.2), 0, 0, nodes[i]));
  }
  window.NODES = nodes;
}

main();
