import { Vector2 } from "@js-mmo/engine";

import { coordsToIsometricScreen, coordsToScreen } from "../../web/canvas";
import { drawOrigin } from "../helpers";

export interface DSprite {
  id: string;
  width: number;
  height: number;
  image: ImageBitmap;
  position: Vector2;
  origin: Vector2;
  scale: Vector2;
  renderIsometric: boolean;
  __DEBUG__SHOW_ORIGIN: boolean;
}

export const drawSprite = (drawable: DSprite, context: CanvasRenderingContext2D) => {
  const { width, height, image, position, scale, origin, renderIsometric, __DEBUG__SHOW_ORIGIN } = drawable;

  context.save();

  const orig = new Vector2(origin.x * width, origin.y * height);
  const pos = renderIsometric
    ? coordsToIsometricScreen(context.canvas, position.x * scale.x, position.y * scale.y)
    : coordsToScreen(position.x * scale.x, position.y * scale.y);

  context.drawImage(image, pos.x - orig.x, pos.y - orig.y, width * scale.x, height * scale.y);

  if (__DEBUG__SHOW_ORIGIN) {
    drawOrigin(context, pos, orig, scale, width, height);
  }

  context.restore();
};
