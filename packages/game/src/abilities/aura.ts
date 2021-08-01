export enum AuraEffector {
  Health,
  Power,
}

export interface Aura {
  name?: string;
  description?: string;
  amount: number;
  duration?: number;
  ticks?: number;
  effects: AuraEffector;
  // Things that can also be added:
  // auraType: buff | debuff | aura;
  // tickOnApply: boolean;
}

export interface ActiveAura extends Aura {
  startTime: number;
  endTime: number;
  tickDuration?: number;
  lastTick?: number;
}
