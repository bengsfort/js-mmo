import { Vector2 } from "@js-mmo/engine";

import { PIXELS_PER_UNIT, PIXEL_RATIO } from "../renderer_config";
import { logger } from "../logger";

export function createCanvas(width?: number, height?: number): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  resizeCanvas(canvas, width ?? window.innerWidth, height ?? window.innerHeight);
  logger.log("Canvas created.");
  return canvas;
}

export function resizeCanvas(canvas: HTMLCanvasElement, width: number, height: number): void {
  canvas.width = width * PIXEL_RATIO;
  canvas.height = height * PIXEL_RATIO;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  ctx.setTransform(PIXEL_RATIO, 0, 0, PIXEL_RATIO, 0, 0);
  ctx.fillRect(0, 0, width, height);
}

export type UnsubscribeCallback = () => void;
export function bindCanvasToWindowSize(canvas: HTMLCanvasElement): UnsubscribeCallback {
  const handler = () => {
    resizeCanvas(canvas, window.innerWidth, window.innerHeight);
    logger.verboseLog("Window size changed, resizing canvas.");
  };
  window.addEventListener("resize", handler);
  return () => window.removeEventListener("resize", handler);
}

export const coordsToScreen = (x: number, y: number): Vector2 => {
  return new Vector2(x * PIXELS_PER_UNIT.x, y * PIXELS_PER_UNIT.y);
};

export const coordsToIsometricScreen = (canvas: HTMLCanvasElement, x: number, y: number): Vector2 => {
  return new Vector2(
    (PIXELS_PER_UNIT.x / 2) * (x - y) + canvas.width / PIXEL_RATIO / 2,
    (PIXELS_PER_UNIT.y / 2) * (x + y)
  );
};
