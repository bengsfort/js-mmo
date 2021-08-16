import { CharacterStatus } from "../players/status";
import Icon from "../assets/spellicon-fireball.png";

import { Ability, CastTarget } from "./ability";
import { AuraEffector } from "./aura";

export const __RangedSpell: Ability = {
  name: "Ranged Spell",
  description: "A casted ranged spell doing 35 damage.",
  image: Icon,
  applyAuras: [
    {
      amount: -35,
      duration: 0,
      effects: AuraEffector.Health,
    },
  ],
  maxRange: 5,
  castTarget: CastTarget.Target,
  castOn: CharacterStatus.Enemy,
  castTime: 1.5,
  cost: 20,
};
