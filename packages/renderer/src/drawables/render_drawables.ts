import { logger } from "../logger";
import { Camera } from "../camera/camera";

import { DRect, drawRect } from "./rect/rect_internal";
import { DSprite, drawSprite } from "./sprite/sprite_internal";
import { Drawable, DrawableType } from "./drawable";
import { drawTilemap, DTilemap } from "./tilemap/tilemap_internal";
import { drawText, DText } from "./text/text_internal";

export type DAttrs = DRect | DSprite | DTilemap | DText;

export const renderDrawable = <T extends DAttrs>(
  drawable: Drawable<T>,
  context: CanvasRenderingContext2D,
  camera?: Camera
): void => {
  switch (drawable.type) {
    case DrawableType.Tilemap:
      drawTilemap((drawable as Drawable<DTilemap>).data, context, camera);
      break;
    case DrawableType.Sprite:
      drawSprite((drawable as Drawable<DSprite>).data, context, camera);
      break;
    case DrawableType.Rect:
      drawRect((drawable as Drawable<DRect>).data, context, camera);
      break;
    case DrawableType.Text:
      drawText((drawable as Drawable<DText>).data, context, camera);
      break;
    default:
      logger.logWarn("Drawable type unsupported:", drawable);
      break;
  }
};
