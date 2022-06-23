import * as GameWorld from "./world";
import * as Time from "./core/time";
import { FIXED_UPDATE_ONLY, TICKS_PER_SECOND } from "./engine_config";
import { inputSystemLoop } from "./input/input_system";

let idCounter = 0;
let rafId = 0;
let tickLoopId = 0;

export type LoopHandler = (timestamp: number) => void;

// Update handlers are what most client side things will use, things like
// Client Side movement prediction/lerping/UI/etc.
const updateHandlers = new Map<number, LoopHandler>();

// Post update handlers are meant for things like rendering, that
// happen after entity/controller state has been updated.
const postUpdateHandlers = new Map<number, LoopHandler>();

// Fixed update handlers are meant for things like state management, physics,
// and networking.
const fixedUpdateHandlers = new Map<number, LoopHandler>();

let renderHandler: LoopHandler = () => {};

// Handler Registration/Management
export const registerRenderer = (handler: LoopHandler): void => {
  renderHandler = handler;
};

export const registerUpdateHandler = (handler: LoopHandler): number => {
  const handlerId = ++idCounter;
  updateHandlers.set(handlerId, handler);
  return handlerId;
};

export const removeUpdateHandler = (id: number): boolean => {
  if (updateHandlers.has(id)) {
    updateHandlers.delete(id);
    return true;
  }
  return false;
};

export const registerPostUpdateHandler = (handler: LoopHandler): number => {
  const handlerId = ++idCounter;
  postUpdateHandlers.set(handlerId, handler);
  return handlerId;
};

export const removePostUpdateHandler = (id: number): boolean => {
  if (postUpdateHandlers.has(id)) {
    postUpdateHandlers.delete(id);
    return true;
  }
  return false;
};

export const registerFixedUpdateHandler = (handler: LoopHandler): number => {
  const handlerId = ++idCounter;
  fixedUpdateHandlers.set(handlerId, handler);
  return handlerId;
};

export const removeFixedUpdateHandler = (id: number): boolean => {
  if (fixedUpdateHandlers.has(id)) {
    fixedUpdateHandlers.delete(id);
    return true;
  }
  return false;
};

// Game Loops
export function update(timestamp = 0): void {
  Time.frameStart();
  rafId = requestAnimationFrame(update);
  // Sample input first
  inputSystemLoop();
  // Then go on to our custom handlers
  GameWorld.refresh();
  const handlers = [...updateHandlers.values(), ...postUpdateHandlers.values(), renderHandler];
  for (let i = 0; i < handlers.length; i++) {
    if (handlers[i]) handlers[i](timestamp);
  }
}

export function fixedUpdate(timestamp = 0): void {
  const handlers = [...fixedUpdateHandlers.values()];
  for (let i = 0; i < handlers.length; i++) {
    if (handlers[i]) handlers[i](timestamp);
  }
}

export const start = (): void => {
  console.log("Game loop started");
  Time.runtimeStart();
  tickLoopId = setInterval(fixedUpdate, TICKS_PER_SECOND);
  if (!FIXED_UPDATE_ONLY) {
    rafId = requestAnimationFrame(update);
  }
};

export const stop = (): void => {
  console.log("Stopping game loop.");
  if (!FIXED_UPDATE_ONLY) {
    cancelAnimationFrame(rafId);
  }
  clearInterval(tickLoopId);
};
