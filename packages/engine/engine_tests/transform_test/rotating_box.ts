import { createRect, RectDrawable, WebRenderer } from "@js-mmo/renderer";
import { SceneObject, Vector2, Time } from "@js-mmo/engine";

let counter = 0;

export class RotatingBox extends SceneObject {
  _drawable: RectDrawable;
  _speed: number;

  constructor(pos: Vector2, scale: Vector2, rotation: number, speed: number, parent?: SceneObject) {
    super(`rotating_box_${counter++}`, pos, scale, rotation, parent);
    this._drawable = createRect({
      position: this.position,
      width: 32,
      height: 32,
      origin: new Vector2(0.5, 0.5),
      scale: this.scale,
      rotation: this.rotation,
      color: "#0000ff",
      renderIsometric: false,
    });
    this._speed = speed;
  }

  update = () => {
    this.localRotation += this._speed / Time.getDeltaTime();
  };

  postUpdate = () => {
    this._drawable.data.rotation = this.rotation;
    WebRenderer.registerDrawable(this._drawable);
  };
}
