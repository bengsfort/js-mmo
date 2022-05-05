import { throttle } from "./utils/throttle";
import { FPSCounter } from "./utils/fps-counter";
import { Root } from "./scene/root";
import { updatePerf } from "./scene/ui";

declare global {
  interface Window {
    __root__: Root;
  }
}

// Constants
const timer = new FPSCounter();
const canvas = document.getElementById("root") as HTMLCanvasElement;
const context = canvas.getContext("2d") as CanvasRenderingContext2D;
let root: Root;

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

// Main program
const frameLoop: FrameRequestCallback = (delta) => {
  window.requestAnimationFrame(frameLoop);
  timer.frameStart();
  clearCanvas();

  // Debug
  updatePerf(timer);
  root.update(delta);
  root.render(context);
}

async function main() {
  // Size canvas correctly
  resizeCanvas();
  window.addEventListener("resize", throttle(250, resizeCanvas));

  // Setup entities/nodes.
  // 1. scaled box
  // 2. Bounds?
  // 3. One box with a CHILD box inside that goes from one side to the other, rotating and scaling?
  root = new Root();
  window.__root__ = root;

  // Start loop.
  window.requestAnimationFrame(frameLoop)
}

void main();
