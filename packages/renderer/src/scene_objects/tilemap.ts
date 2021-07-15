import { Node2d, NodeTypes, SceneObject, TiledLayerType, TiledMap, Vector2 } from "@js-mmo/engine";
import { TilemapDrawable, createTilemap } from "../drawables/tilemap/tilemap";

import { RenderingNode } from "../drawables/rendering_node";
import { RuntimeTileset } from "../asset_management/tileset_manager";
import { logger } from "../logger";

export class Tilemap extends SceneObject implements RenderingNode<TilemapDrawable> {
  readonly type = NodeTypes.Draw;
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
    parent?: Node2d
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
