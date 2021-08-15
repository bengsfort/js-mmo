import { Ability } from "../abilities/ability";
import { Character } from "../players";

export interface Job {
  name: string;
  description: string;
  abilities: Ability[];

  maxHealth: number;
  maxPower: number;
  generatesPower: boolean;

  cast(ability: Ability, source: Character, target: Character): void;
}
