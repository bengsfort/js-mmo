import { CharacterStatus } from "../players/Character";

import { Ability, AuraEffector, CastTarget } from "./ability";

export const __InstantDot: Ability = {
  name: "Instant DoT",
  description: "A test instant DoT dealing 55 damage over 9 seconds.",
  applyAuras: [
    {
      amount: -55,
      duration: 9,
      effects: AuraEffector.Health,
    },
  ],
  castTarget: CastTarget.Target,
  castOn: CharacterStatus.Enemy,
  channelTime: 0,
  castTime: 0,
  cost: 20,
};
