import { SceneObject, TiledLayerType, TiledMap, TiledMapLayer, TiledRenderOrder, Vector2 } from "@js-mmo/engine";

import { logger } from "../logger";
import { RenderingNode } from "../drawables/rendering_node";
import { createTilemap, TilemapDrawable } from "../drawables/tilemap/tilemap";
import { RuntimeTileset } from "../asset_management/tileset_manager";

export class Tilemap extends SceneObject implements RenderingNode<TilemapDrawable> {
  readonly type = "draw";
  readonly map: TiledMap;

  public origin = Vector2.Zero;

  private _drawable: TilemapDrawable;
  public get drawable(): TilemapDrawable {
    this._drawable.data = {
      ...this._drawable.data,
      position: this.position,
      scale: this.scale,
    };
    return this._drawable;
  }

  // @todo: pass in the tilemap definition and layer id that you want to render
  // @todo: remove all  the other nonsense
  constructor(
    name: string,
    tilemap: TiledMap,
    tileset: RuntimeTileset,
    layer: number,
    position?: Vector2,
    parent?: SceneObject
  ) {
    super(name, position || Vector2.Zero, Vector2.One, 0, parent);
    this.map = tilemap;
    if (tilemap.type === TiledLayerType.Object) {
      logger.logError(`Tried passing a tilemap object layer to a tilemap renderer! (${name})`);
    }
    this._drawable = createTilemap({
      tilemap,
      layer,
      tileset: tileset,
      position: this.position,
      scale: this.scale,
    });
  }
}
