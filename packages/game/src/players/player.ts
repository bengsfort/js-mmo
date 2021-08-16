import { SceneObject, Vector2 } from "@js-mmo/engine";
import { Sprite2d, Text2d, TextAlign, TilesetManager } from "@js-mmo/renderer";

import { Ability, Aura } from "../abilities";
import { Job } from "../jobs";
import { Nameplate } from "../ui/character-nameplate";
import { TILESET_PATH } from "../assets";

import { CharacterStatus } from "./status";
import { Character } from "./character";

// @todo: we dont want to have this many extends. Need to clean this up big time.
export class Player extends SceneObject {
  // Public state.
  public character: Character;
  public status = CharacterStatus.Friendly;

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
  protected _sprite?: Sprite2d;
  protected _nameText?: Text2d;
  protected _nameplate: Nameplate;

  constructor(name: string, pos: Vector2) {
    super(name, pos, Vector2.One, 0);

    this.character = new Character(name, CharacterStatus.Friendly);
    this._nameplate = new Nameplate(this.character);
    this.addChild(this._nameplate);
    this._nameplate.localPosition.set(-1.25, -1.25);
  }

  onActive(): void {
    if (!this._sprite && !this._nameText) {
      const [sprite, nameText] = this._createVisuals();
      this._sprite = sprite;
      this._nameText = nameText;
    }
  }

  /**
   * @todo this should be dynamic
   * @returns {[Sprite2d, Text2d]} A tuple with the sprite and name,
   */
  protected _createVisuals(texture?: string | ImageBitmap, width?: number, height?: number): [Sprite2d, Text2d] {
    // Setup sprite for player
    if (typeof texture === "undefined") {
      const tileset = TilesetManager.get(TILESET_PATH);
      texture = tileset.tiles[4];
      width = tileset.tileWidth;
      height = tileset.tileHeight;
    }

    const sprite = new Sprite2d(`${this.name}-character`, texture, new Vector2(width, height), true, this);
    sprite.origin = new Vector2(0.5, 0.5);
    sprite.localPosition = Vector2.Zero;

    // Setup text above player
    console.log(`${this.name} status is: ${this.status}`);
    const name = new Text2d(new Vector2(-1.75, -1.75), this.name, 10, "monospace", this);
    name.align = TextAlign.Center;
    name.color = this.status === CharacterStatus.Friendly ? "#59bf45" : "#ff3633";
    name.fontWeight = "bold";
    name.outline = "#333";
    name.outlineWidth = 1;

    return [sprite, name];
  }
}
