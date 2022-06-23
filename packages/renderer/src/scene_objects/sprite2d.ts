import { Bounds, Node2d, SceneObject, Vector2 } from "@js-mmo/engine";

import { SpriteDrawable, createSprite } from "../drawables/sprite/sprite";
import { ImageManager } from "../asset_management/image_manager";
import { NodeTypes } from "../../../engine/build";
import { RenderingNode } from "../drawables/rendering_node";

import { RenderObject } from "./render_object";

export class Sprite2d extends RenderObject<SpriteDrawable> {
  public readonly type = NodeTypes.Draw;

  public texture: ImageBitmap;
  public origin = Vector2.Zero;
  public flipX = false;
  public flipY = false;

  protected _drawable: SpriteDrawable;

  public get drawable(): SpriteDrawable {
    const bounds = this.bounds;
    this._drawable.data = {
      ...this._drawable.data,
      image: this.texture,
      width: bounds.size.x,
      height: bounds.size.y,
      position: this.position,
      rotation: this.rotation,
      origin: this.origin,
      scale: this.scale,
      flipX: this.flipX,
      flipY: this.flipY,
    };
    return this._drawable;
  }

  constructor(name = "", texture: string | ImageBitmap, size: Vector2, isometric?: boolean) {
    super(name);

    if (typeof texture === "string") {
      this.texture = ImageManager.get(texture);
      if (!ImageManager.isLoaded(texture)) {
        void this.loadTexture(texture);
      }
    } else {
      this.texture = texture;
    }

    // @todo: does this need to use pixels_per_unit?
    this._bounds = new Bounds(this.position, size);
    this._drawable = createSprite({
      image: this.texture,
      width: size.x,
      height: size.y,
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
