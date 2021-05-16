// Exports should adhere to InputSource interface (../input_source.ts)

import { InputSource } from "../input_source";
import { Vector2 } from "../../math/vector2";

import { KeyboardKeys } from "./keys";

const buttons = new Map<KeyboardKeys, boolean>();
const pointerCoords = new Vector2(0, 0);

// Default everything to false
for (const control in KeyboardKeys) {
  buttons.set(KeyboardKeys[control as keyof typeof KeyboardKeys], false);
}

// keyboard event handling
if (window) {
  window.onkeydown = ({ key }: KeyboardEvent): void => {
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

function getButtonMap(): Map<KeyboardKeys, boolean> {
  return buttons;
}

function getButtonDown(button: KeyboardKeys | string): boolean {
  return buttons.get(button as KeyboardKeys) || false;
}

function getPointerDown(): boolean {
  return buttons.get(KeyboardKeys.Click) || false;
}

function getPointerCoords(): Vector2 {
  return pointerCoords;
}

export const WebInputSource: InputSource = {
  getButtonMap,
  getButtonDown,
  getPointerDown,
  getPointerCoords,
};
