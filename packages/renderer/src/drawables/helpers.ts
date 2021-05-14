import { Vector2 } from "@js-mmo/engine";

export const drawOrigin = (
  ctx: CanvasRenderingContext2D,
  position: Vector2,
  origin: Vector2,
  scale: Vector2,
  width: number,
  height: number
) => {
  ctx.fillStyle = "#ff00ff";
  ctx.strokeStyle = "#ffff00";
  ctx.strokeRect(position.x - origin.x, position.y - origin.y, width * scale.x, height * scale.y);
  ctx.fillRect(position.x - 4, position.y - 4, 8, 8);
};
