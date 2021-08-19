import { KeyboardKeys } from "@js-mmo/engine";

import { InputEvents } from "./input_events";

type InputDictionary = { [inputEvent: string]: KeyboardKeys | KeyboardKeys[] };
export const inputMap: InputDictionary = {
  [InputEvents.MoveUp]: [KeyboardKeys.W, KeyboardKeys.ArrowUp],
  [InputEvents.MoveDown]: [KeyboardKeys.S, KeyboardKeys.ArrowDown],
  [InputEvents.MoveLeft]: [KeyboardKeys.A, KeyboardKeys.ArrowLeft],
  [InputEvents.MoveRight]: [KeyboardKeys.D, KeyboardKeys.ArrowRight],
  [InputEvents.Interact]: KeyboardKeys.Space,
  [InputEvents.Hotbar1]: KeyboardKeys.N1,
  [InputEvents.Hotbar2]: KeyboardKeys.N2,
  [InputEvents.Hotbar3]: KeyboardKeys.N3,
  [InputEvents.Hotbar4]: KeyboardKeys.N4,
  [InputEvents.Hotbar5]: KeyboardKeys.Q,
  [InputEvents.Hotbar6]: KeyboardKeys.E,
};

/**
 * Changes the key mappings for a given input event. This can be used for adding, updating, or removing keybinds.
 * @param {InputEvents} event The event to update mappings for.
 * @param {KeyboardKeys | KeyboardKeys[]} keys The key binding(s).
 */
export function changeMapping(event: InputEvents, keys: KeyboardKeys | KeyboardKeys[]): void {
  if (inputMap[event]) {
    inputMap[event] = keys;
  }
}

export function getHotbarKeyText(_hotbar: number, button: number): string {
  switch (button) {
    case 1:
      return (inputMap[InputEvents.Hotbar1] as string).toUpperCase();
    case 2:
      return (inputMap[InputEvents.Hotbar2] as string).toUpperCase();
    case 3:
      return (inputMap[InputEvents.Hotbar3] as string).toUpperCase();
    case 4:
      return (inputMap[InputEvents.Hotbar4] as string).toUpperCase();
    case 5:
      return (inputMap[InputEvents.Hotbar5] as string).toUpperCase();
    case 6:
      return (inputMap[InputEvents.Hotbar6] as string).toUpperCase();
    default:
      return "";
  }
}
