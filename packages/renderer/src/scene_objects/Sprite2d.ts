import { SceneObject, Vector2 } from "@js-mmo/engine";
import { SpriteDrawable, createSprite } from "../drawables/sprite/sprite";

import { logger } from "logger";
import { registerDrawable } from "../web/web_renderer";

export class Sprite2d extends SceneObject {
  texture?: ImageBitmap;
  size = Vector2.Zero;
  origin = Vector2.Zero;

  _drawable: SpriteDrawable;

  private get drawable(): SpriteDrawable {
    this._drawable.data = {
      ...this._drawable.data,
      width: this.size.x,
      height: this.size.y,
      position: this.position,
      origin: this.origin,
      scale: this.scale,
    };
    return this._drawable;
  }

  constructor(name = "", texture: string | ImageBitmap, size: Vector2, isometric?: boolean, parent?: SceneObject) {
    super(name, Vector2.Zero, Vector2.One, 0, parent);
    this.texture = typeof texture === "string" ? this.createTexture(texture) : texture;
    this.size = size;
    this._drawable = createSprite({
      image: this.texture,
      width: this.size.x,
      height: this.size.y,
      position: this.position,
      origin: this.origin,
      scale: this.scale,
      renderIsometric: isometric as boolean,
    });
  }

  async createTexture(src: string): Promise<ImageBitmap> {
    try {
      const img = new Image();
      img.src = src;
      const bitmap = await createImageBitmap(img);
      return bitmap;
    } catch (e) {
      logger.logError("There was an error creating bitmap from given texture.", e);
    }
    return new ImageBitmap();
  }

  postUpdate = () => {
    registerDrawable(this.drawable);
  };
}
