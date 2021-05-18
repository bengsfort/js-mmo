import { SceneObject, Vector2, Time } from "@js-mmo/engine";
import { createRect, RectDrawable } from "@js-mmo/renderer";
import { registerDrawable } from "@js-mmo/renderer/build/web/web_renderer";

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
      __DEBUG__SHOW_ORIGIN: true,
    });
    this._speed = speed;
  }

  update = () => {
    this.localRotation += (this._speed + (window.SPEED as number)) / Time.getDeltaTime();
  };

  postUpdate = () => {
    this._drawable.data.rotation = this.rotation;
    registerDrawable(this._drawable);
  };
}
