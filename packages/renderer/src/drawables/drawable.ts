export enum DrawableType {
  Rect,
  Sprite,
  Tilemap,
  Text,
}

export interface Drawable<T> {
  type: DrawableType;
  data: T;
}
