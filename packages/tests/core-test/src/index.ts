import { throttle } from "./utils/throttle";
import { FPSCounter } from "./utils/fps-counter";

// declare global {
//   interface Window {
//     __SCENE__: Scene;
//     __CAMERA__: Camera;
//   }
// }

// Constants
const timer = new FPSCounter();
const canvas = document.getElementById("root") as HTMLCanvasElement;
const context = canvas.getContext("2d") as CanvasRenderingContext2D;

// Utils
const clearCanvas = () => {
  context.fillStyle = '#000000';
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillRect(0, 0, canvas.width, canvas.height);
};

const resizeCanvas = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const ratio = window.devicePixelRatio;

  canvas.width = width * ratio;
  canvas.height = height * ratio;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  context.fillRect(0, 0, width, height);
  console.log(`Canvas resized to (${width}, ${height})@${ratio}`);
};

const drawFps = () => {
  context.textAlign = "left";
  context.fillStyle = "#ffffff";
  context.font = "16px monospace";
  context.fillText(`Last frame: ${timer.deltaTime().toFixed(2)}ms`, 16, 32);
  context.fillText(`Current FPS: ${timer.currentFps().toFixed(2)}`, 16, 48);
};

// Main program
const frameLoop: FrameRequestCallback = (timestamp) => {
  window.requestAnimationFrame(frameLoop);
  timer.frameStart();
  clearCanvas();

  // Debug
  drawFps();

}

async function main() {
  // Size canvas correctly
  resizeCanvas();
  window.addEventListener("resize", throttle(250, resizeCanvas));

  // Setup entities/nodes.
  // 1. scaled box
  // 2. Bounds?
  // 3. One box with a CHILD box inside that goes from one side to the other, rotating and scaling?

  // Start loop.
  window.requestAnimationFrame(frameLoop)

  // await ImageManager.preload([box, tile32]);

  // GameLoop.start();

  // GameLoop.registerRenderer(WebRenderer.create());
  // debugCanvas = WebRenderer.getActiveCanvas();
  // WebRenderer.registerForceDraw(drawFps);

  // const scene = new Scene("Main", Vector2.Zero);
  // const camera = new Camera("MainCamera");
  // window.__SCENE__ = scene;
  // window.__CAMERA__ = camera;

  // WebRenderer.addScene(scene, camera);

  // const group = new Group("normal_sprites", scene);
  // group.position = new Vector2(64, 128);

  // const normal = new Sprite2d("static_box", box, new Vector2(32, 32), false);
  // normal.setParent(group);

  // window.__SCENE__ = scene;
  // window.__CAMERA__ = camera;
}

void main();
