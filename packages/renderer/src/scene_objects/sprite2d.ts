import { Node2d, SceneObject, Vector2 } from "@js-mmo/engine";

import { SpriteDrawable, createSprite } from "../drawables/sprite/sprite";
import { ImageManager } from "../asset_management/image_manager";
import { NodeTypes } from "../../../engine/build";
import { RenderingNode } from "../drawables/rendering_node";

export class Sprite2d extends SceneObject implements RenderingNode<SpriteDrawable> {
  public readonly type = NodeTypes.Draw;

  public texture: ImageBitmap;
  public size = Vector2.Zero;
  public origin = Vector2.Zero;
  public flipX = false;
  public flipY = false;

  private _drawable: SpriteDrawable;

  public get drawable(): SpriteDrawable {
    this._drawable.data = {
      ...this._drawable.data,
      image: this.texture,
      width: this.size.x,
      height: this.size.y,
      position: this.position,
      rotation: this.rotation,
      origin: this.origin,
      scale: this.scale,
      flipX: this.flipX,
      flipY: this.flipY,
    };
    return this._drawable;
  }

  constructor(name = "", texture: string | ImageBitmap, size: Vector2, isometric?: boolean, parent?: Node2d) {
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
      rotation: this.rotation,
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
}
