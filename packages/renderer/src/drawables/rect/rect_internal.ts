import { Vector2 } from "@js-mmo/engine";

import { drawDebugText, drawOrigin } from "../helpers";
import { DEBUG_SHOW_ORIGINS } from "../../renderer_config";
import { Camera } from "../../camera/camera";

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
}

export const drawRect = (drawable: DRect, context: CanvasRenderingContext2D, camera?: Camera) => {
  const { id, width, height, position, scale, origin, rotation, color } = drawable;

  const orig = new Vector2(origin.x * width, origin.y * height);

  // Position
  // const viewPosition = camera?.getViewPosition(position) ?? position;
  // context.translate(-viewPosition.x, -viewPosition.y);
  // context.rotate((rotation * Math.PI) / 180);
  // context.scale(scale.x, scale.y);

  // Draw
  context.fillStyle = color;
  context.fillRect(-orig.x, -orig.y, width, height);

  if (DEBUG_SHOW_ORIGINS) {
    context.restore();
    context.save();
    drawOrigin(context, position, origin, scale, width, height);
    drawDebugText(context, id, position, origin);
  }
};
