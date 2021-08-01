import { Ability, ActiveAura, Aura, AuraEffector, CastTarget } from "../abilities";

import { Time } from "@js-mmo/engine";

export enum CharacterStatus {
  Friendly,
  Enemy,
}

// export interface Character {
//   readonly name: string;

//   readonly maxHealth: number;
//   readonly maxPower: number;
//   readonly health: number;
//   readonly power: number;
//   readonly target?: Character;

//   status: CharacterStatus;
//   auras: Aura[];

//   isCasting(): boolean;
//   incrementPower(val: number): void;
//   incrementHealth(val: number): void;
// }

// @todo: need to add physics + collisions for targeting
export class Character {
  // General public state.
  public name: string;
  public target: Character | null = null;
  public status: CharacterStatus;

  // Getters.
  public get maxHealth(): number {
    return this._maxHp;
  }
  public get health(): number {
    return this._hp;
  }
  public get maxPower(): number {
    return this._maxPower;
  }
  public get power(): number {
    return this._power;
  }
  public get isCasting(): boolean {
    return this._casting;
  }

  // Internal state.
  private _maxHp = 1000;
  private _hp = 1000;
  private _maxPower = 1000;
  private _power = 1000;
  private _casting = false;
  private _activeAuras: ActiveAura[] = [];

  canCast(ability: Ability, target?: Character): boolean {
    const tar = target ?? this;
    // Make sure we have enough resources
    if (this._power < (ability.cost ?? 0)) {
      console.log(
        this.name,
        "cannot cast",
        ability.name,
        "as they do not have enough power",
        `(${this._power}/${ability.cost ?? 0})`
      );
      return false;
    }
    // Make sure the target is the correct status (friendly/hostile)
    if (ability.castOn !== tar?.status) {
      console.log(this.name, "cannot cast", ability.name, "on their target.");
      return false;
    }
    // Make sure we are targeting the right thing
    if (
      (ability.castTarget === CastTarget.Target && tar === this) ||
      (ability.castTarget === CastTarget.Self && tar !== this)
    ) {
      console.log(this.name, "cannot cast", ability.name, "on that target!");
      return false;
    }
    return true;
  }

  public applyAura(aura: Aura): void {
    console.log("Applying aura", aura.name, "to character", this.name);

    // If it is an aura that takes place over time, push it into the ActiveAuras array
    if (aura.duration && aura.duration > 0) {
      const startTime = Time.getCurrentTime();
      const ticks = aura.ticks ?? Math.floor(aura.duration);
      this._activeAuras.push({
        ...aura,
        ticks,
        startTime,
        endTime: startTime + aura.duration / 1000,
        tickDuration: ticks / aura.duration / 1000,
        lastTick: 0,
      });
      return;
    }

    switch (aura.effects) {
      case AuraEffector.Health:
        this._hp += aura.amount;
        return;
      case AuraEffector.Power:
        this._power += aura.amount;
        return;
    }
  }
}
