export enum DrawableType {
  Rect,
  Sprite,
  Tilemap,
}

export interface Drawable<T> {
  type: DrawableType;
  data: T;
}
