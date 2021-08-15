import { SceneObject, Vector2 } from "@js-mmo/engine";
import { Sprite2d, Text2d, TextAlign, TilesetManager } from "@js-mmo/renderer";

import { Ability, Aura } from "../abilities";
import { Job } from "../jobs";
import { TILESET_PATH } from "../assets";

import { CharacterStatus } from "./status";
import { Character } from "./character";

// @todo: we dont want to have this many extends. Need to clean this up big time.
export class Player extends SceneObject {
  // Public state.
  public character: Character;
  public readonly status = CharacterStatus.Friendly;

  public abilities: Ability[] = [];
  public auras: Aura[] = [];
  public get target() {
    return this._target;
  }

  // Internal state.
  protected _job?: Job;
  protected _speed = 1;
  protected _target?: Character;

  // Sub-nodes.
  protected _sprite: Sprite2d;
  protected _nameText: Text2d;

  constructor(name: string, pos: Vector2) {
    super(name, pos, Vector2.One, 0);
    const [sprite, nameText] = this._createVisuals();

    this.character = new Character(name, CharacterStatus.Friendly);
    this._sprite = sprite;
    this._nameText = nameText;
  }

  /**
   * @todo this should be dynamic
   * @returns {[Sprite2d, Text2d]} A tuple with the sprite and name,
   */
  protected _createVisuals(): [Sprite2d, Text2d] {
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
    name.outlineWidth = 1;

    return [sprite, name];
  }
}
