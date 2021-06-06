import { logger } from "../logger";

import { DRect, drawRect } from "./rect/rect_internal";
import { DSprite, drawSprite } from "./sprite/sprite_internal";
import { Drawable, DrawableType } from "./drawable";
import { drawTilemap, DTilemap } from "./tilemap/tilemap_internal";

export type DAttrs = DRect | DSprite | DTilemap;

export const renderDrawable = <T extends DAttrs>(drawable: Drawable<T>, context: CanvasRenderingContext2D): void => {
  switch (drawable.type) {
    case DrawableType.Tilemap:
      drawTilemap((drawable as Drawable<DTilemap>).data, context);
      break;
    case DrawableType.Sprite:
      drawSprite((drawable as Drawable<DSprite>).data, context);
      break;
    case DrawableType.Rect:
      drawRect((drawable as Drawable<DRect>).data, context);
      break;
    default:
      logger.logWarn("Drawable type unsupported:", drawable);
      break;
  }
};
