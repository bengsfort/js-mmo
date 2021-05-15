import { Vector2 } from "@js-mmo/engine";

import { drawDebugText, drawOrigin } from "../helpers";
import { coordsToIsometricScreen } from "../../web/canvas";

export interface DRect {
  id: string;
  width: number;
  height: number;
  position: Vector2;
  origin: Vector2;
  scale: Vector2;
  rotation: number;
  color: string;
  renderIsometric: boolean;
  __DEBUG__SHOW_ORIGIN: boolean;
}

export const drawRect = (drawable: DRect, context: CanvasRenderingContext2D) => {
  const {
    id,
    width,
    height,
    position,
    scale,
    origin,
    rotation,
    color,
    renderIsometric,
    __DEBUG__SHOW_ORIGIN,
  } = drawable;

  context.save();
  context.fillStyle = color;

  const orig = new Vector2(origin.x * width, origin.y * height);
  const pos = renderIsometric
    ? coordsToIsometricScreen(context.canvas, position.x * scale.x, position.y * scale.y)
    : position;

  // Rotate around origin
  context.save();
  context.translate(pos.x, pos.y);
  context.rotate((rotation * Math.PI) / 180);
  context.translate(-pos.x, -pos.y);

  // Fill
  // @todo: I think I might have fucked this up for isometric...
  context.fillRect(pos.x - orig.x * scale.x, pos.y - orig.y * scale.y, width * scale.x, height * scale.y);
  context.restore();

  if (__DEBUG__SHOW_ORIGIN) {
    drawOrigin(context, pos, orig, scale, width, height);
    drawDebugText(context, id, pos, orig);
  }

  context.restore();
};
