/* eslint-disable prefer-const */
import { Vector2 } from "@js-mmo/engine";

declare global {
  interface Window {
    re_cfg: RendererConfig;
  }
}

export let PIXEL_RATIO = window.devicePixelRatio;
export let PIXELS_PER_UNIT = 16;
export let ISOMETRIC_PIXELS_PER_UNIT = new Vector2(32, 16);
export let CLEAR_COLOR = "#000000";
export let DEBUG_SHOW_ORIGINS = false;
export let SHOW_UNIT_GRID = false;

class RendererConfig {
  static get pixel_ratio(): number {
    return PIXEL_RATIO;
  }
  static set pixel_ratio(value: number) {
    PIXEL_RATIO = value;
  }

  static get pixels_per_unit(): number {
    return PIXELS_PER_UNIT;
  }
  static set pixels_per_unit(value: number) {
    PIXELS_PER_UNIT = value;
  }

  static get isometric_pixels_per_unit(): Vector2 {
    return ISOMETRIC_PIXELS_PER_UNIT;
  }
  static set isometric_pixels_per_unit(value: Vector2) {
    ISOMETRIC_PIXELS_PER_UNIT = value;
  }

  static get clear_color(): string {
    return CLEAR_COLOR;
  }
  static set clear_color(value: string) {
    CLEAR_COLOR = value;
  }

  static get debug_show_origins(): boolean {
    return DEBUG_SHOW_ORIGINS;
  }
  static set debug_show_origins(value: boolean) {
    DEBUG_SHOW_ORIGINS = value;
  }

  static get show_unit_grid(): boolean {
    return SHOW_UNIT_GRID;
  }
  static set show_unit_grid(value: boolean) {
    SHOW_UNIT_GRID = value;
  }
}

window.re_cfg = RendererConfig;
