import { InputSystem, SceneObject, Time, Vector2 } from "@js-mmo/engine";
import { RectDrawable, RenderingNode, createRect } from "@js-mmo/renderer";

import { InputEvents } from "./input_events";

export class MovingBox extends SceneObject implements RenderingNode<RectDrawable> {
  public type = "draw";

  private _drawable: RectDrawable;
  private _speed: number;

  public get drawable(): RectDrawable {
    this._drawable.data = {
      ...this._drawable.data,
      position: this.position,
    };
    return this._drawable;
  }

  constructor(pos: Vector2, scale: Vector2, speed = 20) {
    super("MovingBox", pos, scale, 0);
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
    if (InputSystem.inputEventDown(InputEvents.MoveUp)) {
      this.localPosition.y -= this._speed / Time.getDeltaTime();
    }
    if (InputSystem.inputEventDown(InputEvents.MoveDown)) {
      this.localPosition.y += this._speed / Time.getDeltaTime();
    }
    if (InputSystem.inputEventDown(InputEvents.MoveLeft)) {
      this.localPosition.x -= this._speed / Time.getDeltaTime();
    }
    if (InputSystem.inputEventDown(InputEvents.MoveRight)) {
      this.localPosition.x += this._speed / Time.getDeltaTime();
    }
  };
}
