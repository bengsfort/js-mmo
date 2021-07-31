import { InputSystem, SceneObject, Time, Vector2 } from "@js-mmo/engine";
import { Sprite2d, Text2d, TextAlign, TilesetManager } from "@js-mmo/renderer";

import { InputEvents } from "../input/input_events";
import { TILESET_PATH } from "../assets";

export class LocalPlayer extends SceneObject {
  // @todo: figure out where to store stuff like this
  private _speed = 1;

  private _sprite: Sprite2d;
  private _nameText: Text2d;

  constructor(name: string, pos: Vector2) {
    super(name, pos, Vector2.One, 0);
    const [sprite, nameText] = this._createVisuals();
    this._sprite = sprite;
    this._nameText = nameText;
  }

  private _createVisuals(): [Sprite2d, Text2d] {
    // Setup sprite for player
    const tileset = TilesetManager.get(TILESET_PATH);
    const sprite = new Sprite2d(
      `${this.name}-character`,
      tileset.tiles[4],
      new Vector2(tileset.tileWidth, tileset.tileHeight),
      true,
      this
    );
    sprite.origin = new Vector2(0.5, 0.5);
    sprite.localPosition = Vector2.Zero;

    // Setup text above player
    const name = new Text2d(new Vector2(-1.5, -1.5), this.name, 10, "monospace", this);
    name.align = TextAlign.Center;
    name.color = "#ff8933";
    name.fontWeight = "bold";

    name.outline = "#383838";
    name.outlineWidth = 2;

    return [sprite, name];
  }

  update = () => {
    const movementSpeed = (this._speed / Time.getDeltaTime()) * 0.16;
    if (InputSystem.inputEventDown(InputEvents.MoveUp)) {
      this.localPosition.x -= movementSpeed;
      this.localPosition.y -= movementSpeed;
    }
    if (InputSystem.inputEventDown(InputEvents.MoveDown)) {
      this.localPosition.y += movementSpeed;
      this.localPosition.x += movementSpeed;
    }
    if (InputSystem.inputEventDown(InputEvents.MoveLeft)) {
      this.localPosition.x -= movementSpeed;
      this.localPosition.y += movementSpeed;
    }
    if (InputSystem.inputEventDown(InputEvents.MoveRight)) {
      this.localPosition.x += movementSpeed;
      this.localPosition.y -= movementSpeed;
    }
  };
}
