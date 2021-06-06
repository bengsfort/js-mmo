import { TiledTileset } from "@js-mmo/engine";

import { PINK_1x1 } from "./image_manager";
import { AssetManager } from "./asset_manager";

// Expects the src to the tileset DEFINITION (.json file)
// @todo: Add support for `spacing` and `margin`
const tilesetLoader = async (src: string): Promise<ImageBitmap[]> => {
  const tilesetDef = (await (await fetch(src)).json()) as TiledTileset;

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      // Grab all of the items
      const cols = tilesetDef.columns;
      const rows = tilesetDef.imageheight / tilesetDef.tileheight;

      // @todo: Inject the default 1x1 pink pixel in at the beginning of the array
      const sprites = [];

      // Iterate through all of the tiles and create them
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          sprites.push(
            createImageBitmap(
              img,
              x * tilesetDef.tilewidth,
              y * tilesetDef.tileheight,
              tilesetDef.tilewidth,
              tilesetDef.tileheight
            )
          );
        }
      }

      resolve(Promise.all(sprites));
    };
    img.onerror = e => {
      reject(e);
    };
    img.src = tilesetDef.image;
  });
};

export const TilesetManager = new AssetManager<ImageBitmap[]>(tilesetLoader);
