import { CharacterStatus } from "../players/status";

import { Aura } from "./aura";

export enum CastTarget {
  Self,
  Target,
  All,
}

export enum CastOn {
  Friendly,
  Enemy,
}

export interface Ability {
  name: string;
  description: string;

  applyAuras: Aura[];
  castTarget: CastTarget;
  castOn: CharacterStatus;
  minRange?: number;
  maxRange?: number;
  castTime?: number;
  channelTime?: number;
  cost?: number;
}
