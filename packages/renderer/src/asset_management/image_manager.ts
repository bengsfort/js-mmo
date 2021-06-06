import { AssetManager } from "./asset_manager";

export const PINK_1x1 =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUCJlj+J/w/z8ACB4DXtqA9gYAAAAASUVORK5CYII=";

const imageLoader = async (src: string): Promise<ImageBitmap> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve(createImageBitmap(img));
    };
    img.onerror = e => {
      reject(e);
    };
    img.src = src;
  });
};

export const ImageManager = new AssetManager<ImageBitmap>(imageLoader, PINK_1x1);
