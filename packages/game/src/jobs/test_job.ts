import { Character } from "../players/Character";
import { Ability, __RangedSpell, __RangedHeal, __InstantDot } from "../abilities";

import { Job } from "./job";

export class TestJob implements Job {
  name = "Wizard";
  description = "A slinger of spells to deal damage.";
  abilities = [__RangedSpell, __InstantDot, __RangedHeal];

  maxHealth = 1.8;
  maxPower = 2.4;
  generatesPower = false;

  cast(ability: Ability, source: Character, target: Character): void {
    console.info("Casting", ability.name, "from", source.name, "at", target.name);
  }
}
