import { InputSystem, Math, SceneObject, Time, Vector2 } from "@js-mmo/engine";
import { Sprite2d, Text2d, TextAlign, TilesetManager } from "@js-mmo/renderer";

import { Ability, Aura } from "../abilities";
import { Job } from "../jobs";
import { InputEvents } from "../input/input_events";
import { TILESET_PATH } from "../assets";

import { Character, CharacterStatus } from "./Character";
import { Player } from "./player";

export class LocalPlayer extends Player implements Character {
  // Public state.
  public readonly status = CharacterStatus.Friendly;
  public abilities: Ability[] = [];
  public auras: Aura[] = [];

  constructor(name: string, pos: Vector2) {
    super(name, pos);
    const [sprite, nameText] = this._createVisuals();
    this._sprite = sprite;
    this._nameText = nameText;
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
    // Temp
    this.localPosition.clamp(0, 29, -1, 28);

    if (InputSystem.inputEventDown(InputEvents.Hotbar1)) {
      if (!this._casting && this.canCastAbility(this.abilities[0], this._target)) {
        this._job?.cast(this.abilities[0], this, this._target as Character);
      }
    }
  };

  canCastAbility(ability: Ability, target?: Character): boolean {
    return this._power >= ability.cost && target?.status === ability.castOn;
  }
}
