// eslint-disable @typescript-eslint/no-explicit-any

import { EngineConfig, GameLoop, Node2d, Time, Vector2 } from "@js-mmo/engine";
import { RendererConfig, Scene, WebRenderer } from "@js-mmo/renderer";

import { RotatingBox } from "./rotating_box";

declare global {
  interface Window {
    NODES: Node2d[];
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
  RendererConfig.PIXELS_PER_UNIT = 32;
  GameLoop.start();

  // Create renderer and add it to the update loop
  GameLoop.registerRenderer(WebRenderer.create());

  // renderer uses camera like:
  // camera.getViewPosition() <- does the transformation
  // ie. isometric camera .getViewPosition() === camera.x transformed to isometric pos

  // Force-draw the FPS to the top left corner
  debugCanvas = WebRenderer.getActiveCanvas();
  WebRenderer.registerForceDraw(drawFps);

  const scene = new Scene();
  scene.background = "#212121";

  const root = new RotatingBox(new Vector2(64, 128), new Vector2(1, 1), 45, 15);
  scene.addChild(root);

  const nodes = [root];
  for (let i = 0; i < 10; i++) {
    console.log("Node", i, "making the following its parent", nodes[i]);
    nodes.push(new RotatingBox(new Vector2(32, 32), new Vector2(1.2, 1.2), 0, i - 5, nodes[i]));
  }

  WebRenderer.addScene(scene);
  window.NODES = nodes;
}

main();
