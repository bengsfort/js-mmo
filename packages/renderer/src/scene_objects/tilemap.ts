import { SceneObject, TiledLayerType, TiledMapLayer, TiledRenderOrder, Vector2 } from "@js-mmo/engine";

import { logger } from "../logger";
import { RenderingNode } from "../drawables/rendering_node";
import { createTilemap, TilemapDrawable } from "../drawables/tilemap/tilemap";

export class Tilemap extends SceneObject implements RenderingNode<TilemapDrawable> {
  readonly type = "draw";
  readonly map: TiledMapLayer;

  public origin = Vector2.Zero;

  private _drawable: TilemapDrawable;
  public get drawable(): TilemapDrawable {
    this._drawable.data = {
      ...this._drawable.data,
      position: this.position,
      origin: this.origin,
      scale: this.scale,
    };
    return this._drawable;
  }

  // @todo: pass in the tilemap definition and layer id that you want to render
  // @todo: remove all  the other nonsense
  constructor(
    name: string,
    tilemap: TiledMapLayer,
    tileset: ImageBitmap[],
    renderIsometric = false,
    renderOrder = TiledRenderOrder.LeftDown,
    position?: Vector2,
    parent?: SceneObject
  ) {
    super(name, position || Vector2.Zero, Vector2.One, 0, parent);
    this.map = tilemap;
    if (tilemap.type === TiledLayerType.Object) {
      logger.logError(`Tried passing a tilemap object layer to a tilemap renderer! (${name})`);
    }
    this._drawable = createTilemap({
      renderOrder,
      renderIsometric,
      map: tilemap.data as number[],
      width: tilemap.width as number,
      height: tilemap.height as number,
      tileset: tileset,
      position: this.position,
      origin: this.origin,
      scale: this.scale,
    });
  }
}
