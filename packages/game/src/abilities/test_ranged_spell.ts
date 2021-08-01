import { CharacterStatus } from "../players/Character";

import { Ability, AuraEffector, CastTarget } from "./ability";

export const __RangedSpell: Ability = {
  name: "Ranged Spell",
  description: "A casted ranged spell doing 35 damage.",
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
