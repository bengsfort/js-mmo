import { SceneObject, Vector2 } from "@js-mmo/engine";

import { registerDrawable } from "../web/web_renderer";
import { createSprite, SpriteDrawable } from "../drawables/sprite/sprite";

export class Sprite2d extends SceneObject {
  texture: ImageBitmap;
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

  constructor(name = "", texture: ImageBitmap, size: Vector2, isometric?: boolean, parent?: SceneObject) {
    super(name, Vector2.Zero, Vector2.One, 0, parent);
    this.texture = texture;
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

  postUpdate = () => {
    registerDrawable(this.drawable);
  };
}
