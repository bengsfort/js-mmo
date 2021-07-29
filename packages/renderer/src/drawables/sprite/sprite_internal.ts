import { Vector2 } from "@js-mmo/engine";

import { drawDebugText, drawOrigin } from "../helpers";
import { DEBUG_SHOW_ORIGINS } from "../../renderer_config";
import { Camera } from "../../camera/camera";

export interface DSprite {
  id: string;
  width: number;
  height: number;
  image: ImageBitmap;
  position: Vector2;
  rotation: number;
  origin: Vector2;
  scale: Vector2;
  flipX: boolean;
  flipY: boolean;
  renderIsometric: boolean;
}

export const drawSprite = (drawable: DSprite, context: CanvasRenderingContext2D, camera?: Camera) => {
  const { width, height, image, position, scale, origin, rotation, flipX, flipY } = drawable;

  const modifiers = new Vector2(flipX ? -1 : 1, flipY ? -1 : 1);
  const orig = new Vector2(origin.x * width * modifiers.x, origin.y * height * modifiers.y);

  // Position
  const viewPosition = camera?.getViewPosition(position) ?? position;
  context.translate(viewPosition.x, viewPosition.y);
  context.rotate((rotation * Math.PI) / 180);
  context.scale(scale.x * modifiers.x, scale.y * modifiers.y);

  // Draw
  context.drawImage(image, -orig.x, -orig.y, width * modifiers.x, height * modifiers.y);

  if (DEBUG_SHOW_ORIGINS) {
    context.restore();
    context.save();
    drawDebugText(context, drawable.id, position, origin);
    drawOrigin(context, position, origin, scale, width, height);
  }
};
