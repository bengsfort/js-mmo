export const easeOut = (val: number): number => Math.sin(val * Math.PI * 0.5);
export const easeIn = (val: number): number => 1 - Math.cos(val * Math.PI * 0.5);
export const exponential = (val: number): number => val * val;
export const smoothstep = (val: number): number => val * val * (3 - 2 * val);
export const smootherstep = (val: number): number => val * val * val * (val * (6 * val - 15) + 10);
