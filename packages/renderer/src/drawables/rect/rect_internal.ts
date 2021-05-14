import { Vector2 } from "@js-mmo/engine";

import { coordsToIsometricScreen, coordsToScreen } from "../../web/canvas";
import { drawOrigin } from "../helpers";

export interface DRect {
  id: string;
  width: number;
  height: number;
  position: Vector2;
  origin: Vector2;
  scale: Vector2;
  color: string;
  renderIsometric: boolean;
  __DEBUG__SHOW_ORIGIN: boolean;
}

export const drawRect = (drawable: DRect, context: CanvasRenderingContext2D) => {
  const { width, height, position, scale, origin, color, renderIsometric, __DEBUG__SHOW_ORIGIN } = drawable;

  context.save();
  context.fillStyle = color;

  const orig = new Vector2(origin.x * width, origin.y * height);
  const pos = renderIsometric
    ? coordsToIsometricScreen(context.canvas, position.x * scale.x, position.y * scale.y)
    : coordsToScreen(position.x * scale.x, position.y * scale.y);

  context.fillRect(pos.x - orig.x, pos.y - orig.y, width * scale.x, height * scale.y);

  if (__DEBUG__SHOW_ORIGIN) {
    drawOrigin(context, pos, orig, scale, width, height);
  }

  context.restore();
};
