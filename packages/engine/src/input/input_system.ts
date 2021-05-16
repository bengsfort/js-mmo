// unused for now

import { Vector2 } from "../math/vector2";
import { makeLogger } from "../core/logging";

import { InputPlatform } from "./platforms";
import { InputSource } from "./input_source";
import { KeyboardKeys } from "./web/keys";
import { WebInputSource } from "./web/web_input";

/**
 * make this event based???
 *
 * set a mapping of events and the keys associated, ie:
 *
 * move_up -> w
 * actionbar_1 -> 1
 *
 * things can subscribe?????
 * classes go like:
 *
 * InputManager.on(move_up, () => do move things);
 * InputManager.on(actionbar_1, () => cast spell);
 */

const log = makeLogger("INPUT");

const inputEventButtonsMap = new Map<string, string | string[]>();
let inputSource: InputSource;

// Public API
const registerInputPlatform = (platform: InputPlatform) => {
  switch (platform) {
    case InputPlatform.Web:
      inputSource = WebInputSource;
      break;
    default:
      log.logInfo("No input platform set! Ignoring input. (Ignore this if running on server)");
  }
};

/**
 * Registers a mapping of input events to their buttons. The key should be the input event, and the value should be
 * the button(s)/key(s) that should trigger that input event.
 *
 * @param map The map of events to buttons.
 */
const registerInputMap = <T extends string = KeyboardKeys>(map: { [inputEvent: string]: T | T[] }): void => {
  const inputEvents = Object.keys(map);

  for (let i = 0; i < inputEvents.length; i++) {
    // This could be simplified but keeping it verbose for readability.
    const inputEvent = inputEvents[i];
    const buttonTriggers = map[inputEvent];
    inputEventButtonsMap.set(inputEvent, buttonTriggers);
  }
};

export const inputEventDown = (inputEvent: string): boolean => {
  const trigger = inputEventButtonsMap.get(inputEvent);
  if (trigger && inputSource) {
    if (typeof trigger === "object") {
      return trigger.some(button => inputSource.getButtonDown(button));
    }
    return inputSource.getButtonDown(trigger);
  }
  return false;
};

export const getButtonDownRaw = (button: string): boolean => {
  if (inputSource) {
    return inputSource.getButtonDown(button);
  }
  return false;
};

export const getPointerCoords = (): Vector2 => {
  if (inputSource) {
    return inputSource.getPointerCoords();
  }
  return Vector2.Zero;
};

export const getPointerDown = (): boolean => {
  if (inputSource) {
    return inputSource.getPointerDown();
  }
  return false;
};

export const InputSystem = {
  registerInputPlatform,
  registerInputMap,
  inputEventDown,
  getButtonDownRaw,
  getPointerCoords,
  getPointerDown,
};

// Internal
/**
 * Main input system loop.
 * @todo: This doesn't do anything now, but in the future should be implemented so we can support 'buttonUp' callbacks.
 */
export const inputSystemLoop = (): void => {
  if (!inputSource) return;
};
