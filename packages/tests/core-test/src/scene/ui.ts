import { FPSCounter } from "../utils/fps-counter";

const framesMsLabel = document.getElementById("frame-ms") as HTMLSpanElement;
const fpsLabel = document.getElementById("fps") as HTMLSpanElement;

export const updatePerf = (timer: FPSCounter) => {
  framesMsLabel.innerText = timer.deltaTime().toFixed(2);
  fpsLabel.innerText = timer.currentFps().toFixed(2);
}
