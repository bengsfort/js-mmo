import { Drawable, RendererConfig, WebRenderer, createRect } from "@js-mmo/renderer";
import { EngineConfig, GameLoop, Node2d, Time, Vector2 } from "@js-mmo/engine";

import { DRect } from "@js-mmo/renderer/build/drawables/rect/rect_internal";
import { registerDrawable } from "@js-mmo/renderer/build/web/web_renderer";

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

interface TestNodeOpts {
  name: string;
  pos: Vector2;
  scale: number;
  rot: number;
  speed: number;
}
class TestNode extends Node2d {
  _fixedHandlerId = -1;
  _postUpdateHandler = -1;
  _drawable: Drawable<DRect>;

  _speed: number;

  constructor({ name, pos, scale, rot = 0, speed = 0 }: TestNodeOpts, parent?: Node2d) {
    super(name, pos, new Vector2(scale, scale), rot, parent);
    this._drawable = createRect({
      position: this.position,
      width: 32,
      height: 32,
      origin: new Vector2(0.5, 0.5),
      scale: this.scale,
      rotation: this.rotation,
      color: "#0000ff",
      renderIsometric: false,
      __DEBUG__SHOW_ORIGIN: true,
    });
    this._speed = speed;
    this.setActive(true);
  }

  onActive = () => {
    console.log("Yo");
    if (this.isActive) {
      this._postUpdateHandler = GameLoop.registerPostUpdateHandler(this.postUpdate);
    } else {
      GameLoop.removeFixedUpdateHandler(this._fixedHandlerId);
      GameLoop.removePostUpdateHandler(this._postUpdateHandler);
    }
  };

  update = () => {
    this.localRotation += (this._speed + window.SPEED) / Time.getDeltaTime();
  };

  postUpdate = () => {
    this._drawable.data.rotation = this.rotation;
    registerDrawable(this._drawable);
  };
}

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

  const root = new TestNode({ name: "test_node", pos: new Vector2(64, 128), scale: 1, rot: 45, speed: 5 });
  const nodes = [root];
  for (let i = 0; i < 10; i++) {
    console.log("Node", i, "making the following its parent", nodes[i]);
    nodes.push(
      new TestNode({ name: `test_node_${i}`, pos: new Vector2(32, 32), scale: 1.2, rot: 0, speed: 0 }, nodes[i])
    );
  }
  window.NODES = nodes;
}

main();
