import { Vector2 } from "@js-mmo/engine";

import { DEBUG_SHOW_ORIGINS } from "../../renderer_config";
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
  flipX: boolean;
  flipY: boolean;
  renderIsometric: boolean;
}

export const drawSprite = (drawable: DSprite, context: CanvasRenderingContext2D) => {
  const { width, height, image, position, scale, origin, renderIsometric, flipX, flipY } = drawable;

  // const orig = new Vector2(origin.x * width, origin.y * height);
  // const pos = renderIsometric
  //   ? coordsToIsometricScreen(context.canvas, position.x * scale.x, position.y * scale.y)
  //   : coordsToScreen(position.x * scale.x, position.y * scale.y);

  // const xModifier = flipX ? -1 : 1;
  // const yModifier = flipY ? -1 : 1;
  // const scaledWidth = width * scale.x;
  // const scaledHeight = height * scale.y;

  // context.save();
  // context.translate(flipX ? scaledWidth : 0, flipY ? scaledHeight : 0);
  // context.scale(xModifier, yModifier);
  // context.drawImage(image, (pos.x - orig.x) * xModifier, (pos.y - orig.y) * yModifier, scaledWidth, scaledHeight);
  // context.restore();

  // context.save();

  const modifiers = new Vector2(flipX ? -1 : 1, flipY ? -1 : 1);
  const orig = new Vector2(origin.x * width, origin.y * height);

  context.scale(scale.x * modifiers.x, scale.y * modifiers.y);
  context.rotate(0);
  context.translate(position.x, position.y);
  context.drawImage(image, orig.x * width, orig.y * height, width, height);

  // context.restore();

  // if (DEBUG_SHOW_ORIGINS) {
  //   drawOrigin(context, pos, orig, scale, width, height);
  // }
};
