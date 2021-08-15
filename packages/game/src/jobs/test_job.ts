import { Ability, __InstantDot, __RangedHeal, __RangedSpell } from "../abilities";
import { Character } from "../players";

import { Job } from "./job";

class TestJob implements Job {
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

export const __test_job = new TestJob();
