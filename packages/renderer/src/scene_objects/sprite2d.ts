import { SceneObject, Vector2 } from "@js-mmo/engine";

import { ImageManager } from "../asset_management/image_manager";
import { SpriteDrawable, createSprite } from "../drawables/sprite/sprite";
import { registerDrawable } from "../web/web_renderer";

export class Sprite2d extends SceneObject {
  texture: ImageBitmap;
  size = Vector2.Zero;
  origin = Vector2.Zero;
  flipX = false;
  flipY = false;

  _drawable: SpriteDrawable;

  private get drawable(): SpriteDrawable {
    this._drawable.data = {
      ...this._drawable.data,
      image: this.texture,
      width: this.size.x,
      height: this.size.y,
      position: this.position,
      origin: this.origin,
      scale: this.scale,
      flipX: this.flipX,
      flipY: this.flipY,
    };
    return this._drawable;
  }

  constructor(name = "", texture: string | ImageBitmap, size: Vector2, isometric?: boolean, parent?: SceneObject) {
    super(name, Vector2.Zero, Vector2.One, 0, parent);

    if (typeof texture === "string") {
      this.texture = ImageManager.get(texture);
      if (!ImageManager.isLoaded(texture)) {
        void this.loadTexture(texture);
      }
    } else {
      this.texture = texture;
    }

    this.size = size;
    this._drawable = createSprite({
      image: this.texture,
      width: this.size.x,
      height: this.size.y,
      position: this.position,
      origin: this.origin,
      scale: this.scale,
      flipX: this.flipX,
      flipY: this.flipY,
      renderIsometric: isometric as boolean,
    });
  }

  async loadTexture(src: string): Promise<void> {
    await ImageManager.load(src);
    this.texture = ImageManager.get(src);
  }

  postUpdate = () => {
    if (this.drawable.data.image) {
      registerDrawable(this.drawable);
    }
  };
}
