import { InputSystem, SceneObject, Time, Vector2 } from "@js-mmo/engine";
import { Sprite2d, Text2d, TextAlign } from "@js-mmo/renderer";

import { InputEvents } from "./input_events";
import box from "./assets/box.png";

export class TestPlayer extends SceneObject {
  private _speed: number;

  private _box: Sprite2d;
  private _text: Text2d;

  constructor(name: string, pos: Vector2, scale: Vector2, speed = 20) {
    super(name, pos, scale, 0);
    this._speed = speed;
    const boxSprite = new Sprite2d(`${name}-box`, box, new Vector2(32, 32), false, this);
    boxSprite.origin = new Vector2(0.5, 0.5);
    boxSprite.localPosition = new Vector2(0, 10);

    const text = new Text2d(new Vector2(0, -8), name, 16, "monospace", this);
    text.align = TextAlign.Center;
    text.color = "#30e";
    text.fontWeight = "bold";
    text.outlineWidth = 1.5;
    text.outline = "#ff0";

    this._box = boxSprite;
    this._text = text;
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
    if (InputSystem.inputEventDown(InputEvents.Grow)) {
      this._box.localScale.x += 0.1;
      this._box.localScale.y += 0.1;
    }
    if (InputSystem.inputEventDown(InputEvents.Shrink)) {
      this._box.localScale.x -= 0.1;
      this._box.localScale.y -= 0.1;
    }
    if (InputSystem.inputEventDown(InputEvents.Rotate)) {
      this._box.localRotation += 0.1;
    }
  };
}
