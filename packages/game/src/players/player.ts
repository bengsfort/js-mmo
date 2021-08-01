import { InputSystem, Math, SceneObject, Time, Vector2 } from "@js-mmo/engine";
import { Sprite2d, Text2d, TextAlign, TilesetManager } from "@js-mmo/renderer";

import { Ability, Aura } from "../abilities";
import { Job } from "../jobs";
import { InputEvents } from "../input/input_events";
import { TILESET_PATH } from "../assets";

import { Character, CharacterStatus } from "./Character";

export class Player extends SceneObject implements Character {
  // Public state.
  public readonly status = CharacterStatus.Friendly;
  public get maxHealth() {
    return this._maxHealth;
  }
  public get maxPower() {
    return this._maxPower;
  }
  public get health() {
    return this._health;
  }
  public get power() {
    return this._power;
  }
  public get target() {
    return this._target;
  }
  public abilities: Ability[] = [];
  public auras: Aura[] = [];

  // Internal state.
  protected _job?: Job;
  protected _maxHealth = 1000;
  protected _maxPower = 1000;
  protected _health = 1000;
  protected _power = 1000;
  protected _speed = 1;
  protected _casting = false;
  protected _target?: Character;

  // Sub-nodes.
  protected _sprite: Sprite2d;
  protected _nameText: Text2d;

  constructor(name: string, pos: Vector2) {
    super(name, pos, Vector2.One, 0);
    const [sprite, nameText] = this._createVisuals();
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
    name.outlineWidth = 2;

    return [sprite, name];
  }

  /**
   * Apply a certain job to this player.
   * @param {Job} job The Job to apply to the player.
   */
  setJob(job: Job): void {
    const baseHp = 1000 * job.maxHealth;
    const basePower = 1000 * job.maxPower;

    this._maxHealth = baseHp;
    this._health = baseHp;
    this._maxPower = basePower;
    this._power = job.generatesPower ? 0 : basePower;
    this.abilities = [...job.abilities];
  }

  isCasting(): boolean {
    return this._casting;
  }

  incrementPower(val: number): void {
    this._power = Math.clamp(this._power + val, 0, this.maxPower);
  }

  incrementHealth(val: number): void {
    this._health = Math.clamp(this._health + val, 0, this.maxHealth);
  }
}
