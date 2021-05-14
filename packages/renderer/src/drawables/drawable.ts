export enum DrawableType {
  Rect,
  Sprite,
}

export interface Drawable<T> {
  type: DrawableType;
  data: T;
}
