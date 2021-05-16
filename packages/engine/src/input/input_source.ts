import { Vector2 } from "../math/vector2";

export interface InputSource {
  getButtonMap: () => Map<string, boolean>;
  getButtonDown: (button: string) => boolean;
  getPointerDown: () => boolean;
  getPointerCoords: () => Vector2;
}
