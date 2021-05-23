// These are the types associated with tilemaps exported from the Tiled program.

export enum TiledRenderOrder {
  RightDown = "right-down",
  RightUp = "right-up",
  LeftDown = "left-down",
  LeftUp = "left-up",
}

export enum TiledOrientation {
  Orthogonal = "orthogonal",
  Isometric = "isometric",
}

export enum TiledLayerType {
  Tile = "tilelayer",
  Object = "objectgroup",
}

export type TiledEditorSettings = {
  export: {
    format: string;
    target: string;
  };
};

export type TiledMapLayer = {
  data?: number[];
  height?: number;
  width?: number;
  id: number;
  name: string;
  opacity: number;
  type: string | TiledLayerType;
  visible: boolean;
  x: number;
  y: number;
};

export type TiledObject<CustomType, CustomObjectProps> = {
  height: number;
  width: number;
  id: number;
  name: string;
  point: boolean;
  rotation: number;
  visible: boolean;
  x: number;
  y: number;
  type: CustomType;
  properties: CustomObjectProps[];
};

export type TiledObjectLayer<CustomType, CustomObjectProps> = TiledMapLayer & {
  draworder: "topdown" | "manual";
  objects: TiledObject<CustomType, CustomObjectProps>[];
};

export type TiledMap = {
  compressionlevel: number;
  editorsettings: TiledEditorSettings;
  height: number;
  width: number;
  tileheight: number;
  tilewidth: number;
  infinite: boolean;
  nextlayerid: number;
  nextobjectid: number;
  orientation: string | TiledOrientation;
  renderorder: string | TiledRenderOrder;
  tiledversion: string;
  type: string;
  version: number;
  layers: TiledMapLayer[];
  tilesets: { firstgid: number; source: string }[];
};

export type TiledTileset = {
  columns: number;
  image: string;
  imageheight: number;
  imagewidth: number;
  margin: number;
  name: string;
  spacing: number;
  tilecount: number;
  tiledversion: string;
  tileheight: number;
  tilewidth: number;
  type: string;
  version: number;
};
