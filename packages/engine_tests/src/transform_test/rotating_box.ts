import { RectDrawable, createRect, RenderObject } from "@js-mmo/renderer";
import { SceneObject, Time, Vector2 } from "@js-mmo/engine";

let counter = 0;

export class RotatingBox extends RenderObject<RectDrawable> {
  private _speed: number;

  public get drawable(): RectDrawable {
    this._drawable.data = {
      ...this._drawable.data,
      position: this.position,
      rotation: this.rotation,
      scale: this.scale,
    };
    return this._drawable;
  }

  constructor(pos: Vector2, scale: Vector2, rotation: number, speed: number, parent?: SceneObject) {
    super(`rotating_box_${counter++}`, parent);
    this.position = pos;
    this.scale = scale;
    this.rotation = rotation;
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
}
