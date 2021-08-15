import { CharacterStatus } from "../players/status";

import { Ability, CastTarget } from "./ability";
import { AuraEffector } from "./aura";

export const __RangedHeal: Ability = {
  name: "Ranged Heal",
  description: "Test ranged heal to heal a friendly target or yourself for 50 health.",
  applyAuras: [
    {
      amount: 50,
      duration: 0,
      effects: AuraEffector.Health,
    },
  ],
  maxRange: 10,
  castTarget: CastTarget.All,
  castOn: CharacterStatus.Friendly,
  castTime: 1.5,
  cost: 60,
};
