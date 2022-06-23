import { InputSystem, Time, Vector2 } from "@js-mmo/engine";
import { RectDrawable, createRect, RenderObject } from "@js-mmo/renderer";

import { InputEvents } from "./input_events";

export class MovingBox extends RenderObject<RectDrawable> {
  protected _drawable: RectDrawable;
  private _speed: number;

  public get drawable(): RectDrawable {
    this._drawable.data = {
      ...this._drawable.data,
      position: this.position,
      scale: this.scale,
      rotation: this.rotation,
    };
    return this._drawable;
  }

  constructor(pos: Vector2, scale: Vector2, speed = 20) {
    super("MovingBox");
    this.position = pos;
    this.scale = scale;
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
    this.setActive(true);
  }

  update = () => {
    if (InputSystem.inputEventDown(InputEvents.Grow)) {
      this.localScale.x += 0.1;
      this.localScale.y += 0.1;
    }
    if (InputSystem.inputEventDown(InputEvents.Shrink)) {
      this.localScale.x -= 0.1;
      this.localScale.y -= 0.1;
    }
    if (InputSystem.inputEventDown(InputEvents.Rotate)) {
      this.localRotation += 0.1;
    }
  };
}
