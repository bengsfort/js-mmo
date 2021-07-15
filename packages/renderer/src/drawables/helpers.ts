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
  const offsetX = width * scale.x * origin.x;
  const offsetY = height * scale.x * origin.x;
  ctx.strokeRect(position.x - offsetX, position.y - offsetY, width * scale.x, height * scale.y);
  ctx.fillRect(position.x - 4, position.y - 4, 8, 8);
};

export const drawDebugText = (ctx: CanvasRenderingContext2D, text: string, position: Vector2, origin: Vector2) => {
  ctx.save();
  ctx.fillStyle = "#ffffff";
  const translatedX = position.x - origin.x;
  const translatedY = position.y - origin.y;
  ctx.fillText(text, translatedX, translatedY);
  ctx.restore();
};
