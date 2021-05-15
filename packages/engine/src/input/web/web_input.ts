import { KeyboardKeys } from "./keys";
import { Vector2 } from "../../math/vector2";

const buttons = new Map<KeyboardKeys, boolean>();
const pointerCoords = new Vector2(0, 0);

// Default everything to false
for (const control in KeyboardKeys) {
  buttons.set(KeyboardKeys[control as keyof typeof KeyboardKeys], false);
}

// keyboard event handling
if (window) {
  window.onkeydown = ({ key }: KeyboardEvent): void => {
    console.log(key);
    if (buttons.has(key as KeyboardKeys)) {
      buttons.set(key as KeyboardKeys, true);
    }
  };

  window.onkeyup = ({ key }: KeyboardEvent): void => {
    if (buttons.has(key as KeyboardKeys)) {
      buttons.set(key as KeyboardKeys, false);
    }
  };

  window.onmousedown = (ev: MouseEvent): void => {
    pointerCoords.set(ev.x, ev.y);
    buttons.set(KeyboardKeys.Click, true);
  };

  window.onmousemove = (ev: MouseEvent): void => {
    pointerCoords.set(ev.x, ev.y);
  };

  window.onmouseup = (ev: MouseEvent): void => {
    pointerCoords.set(ev.x, ev.y);
    buttons.set(KeyboardKeys.Click, false);
  };
}

export function getButtonStates(): Map<KeyboardKeys, boolean> {
  return buttons;
}

export function getButtonDown(button: KeyboardKeys): boolean {
  return buttons.get(button) || false;
}

export function getMouseDown(): boolean {
  return buttons.get(KeyboardKeys.Click) || false;
}

export function getPointerCoords(): Vector2 {
  return pointerCoords;
}
