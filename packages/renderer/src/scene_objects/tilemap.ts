import { Bounds, Node2d, NodeTypes, TiledLayerType, TiledMap, Vector2 } from "@js-mmo/engine";

import { TilemapDrawable, createTilemap } from "../drawables/tilemap/tilemap";
import { RuntimeTileset } from "../asset_management/tileset_manager";
import { logger } from "../logger";

import { RenderObject } from "./render_object";

export class Tilemap extends RenderObject<TilemapDrawable> {
  readonly type = NodeTypes.Draw;
  readonly map: TiledMap;

  public origin = Vector2.Zero;

  protected _drawable: TilemapDrawable;
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
  constructor(name: string, tilemap: TiledMap, tileset: RuntimeTileset, layer: number, position?: Vector2) {
    super(name);
    this.map = tilemap;
    if (tilemap.type === TiledLayerType.Object) {
      logger.logError(`Tried passing a tilemap object layer to a tilemap renderer! (${name})`);
    }

    this.position = position ?? Vector2.Zero;
    this._bounds = new Bounds(this.position, new Vector2(tilemap.width, tilemap.height));
    this._drawable = createTilemap({
      tilemap,
      layer,
      tileset: tileset,
      position: this.position,
      scale: this.scale,
    });
  }
}
