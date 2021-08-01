import { Time } from "@js-mmo/engine";

import { Ability, ActiveAura, Aura, AuraEffector } from "../abilities";

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
