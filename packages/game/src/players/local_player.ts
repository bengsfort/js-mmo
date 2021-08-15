import { InputSystem, Time, Vector2 } from "@js-mmo/engine";

import { Ability, Aura } from "../abilities";
import { InputEvents } from "../input/input_events";

import { Character } from "./character";
import { CharacterStatus } from "./status";
import { Player } from "./player";

export class LocalPlayer extends Player {
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
    const movementSpeed = this._speed / Time.getDeltaTime();
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
      // @todo: I dont think an array is going to work here, migrate to command pattern!
      if (!this.character.isCasting && this.character.canCast(this.character.abilities[0], this._target)) {
        this._job?.cast(this.character.abilities[0], this.character, this._target as Character);
      }
    } else if (InputSystem.inputEventDown(InputEvents.Hotbar2)) {
      // @todo: I dont think an array is going to work here, migrate to command pattern!
      if (!this.character.isCasting && this.character.canCast(this.character.abilities[1], this._target)) {
        this._job?.cast(this.character.abilities[1], this.character, this._target as Character);
      }
    } else if (InputSystem.inputEventDown(InputEvents.Hotbar3)) {
      // @todo: I dont think an array is going to work here, migrate to command pattern!
      if (!this.character.isCasting && this.character.canCast(this.character.abilities[2], this._target)) {
        this._job?.cast(this.character.abilities[2], this.character, this._target as Character);
      }
    }
  };
}
