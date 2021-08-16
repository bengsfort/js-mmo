import { ImageManager, RendererConfig, Sprite2d, Text2d } from "@js-mmo/renderer";
import { SceneObject, Vector2 } from "@js-mmo/engine";

import { Character } from "../players";
import SpellIconBg from "../assets/spellicon-bg.png";
import { getHotbarKeyText } from "../input/input_mappings";

const DEFAULT_MAX_ICONS = 6;
const DEFAULT_ICON_SIZE = 32;
const DEFAULT_ICON_SPACING = 1;

export class Hotbar extends SceneObject {
  iconCount: number;
  iconSize: number;
  iconSpacing: number;
  barWidth: number;

  constructor(source: Character) {
    super(`${source.name}:hotbar`);
    this.iconCount = DEFAULT_MAX_ICONS;
    this.iconSize = DEFAULT_ICON_SIZE;
    this.iconSpacing = DEFAULT_ICON_SPACING;
    this.barWidth = DEFAULT_MAX_ICONS * DEFAULT_ICON_SIZE + (DEFAULT_MAX_ICONS - 1) * DEFAULT_ICON_SPACING;

    this.generateSprites(source);
  }

  generateSprites(source: Character): void {
    // @todo: Need to find a better way of handling pixel ratio. This either looks good on my macbook (if pixel ratio used) OR my PC (if not used).
    const size = this.iconSize;
    const defaultIcon = ImageManager.get(SpellIconBg);
    for (let i = 0; i < this.iconCount; i++) {
      const img = source.abilities[i]?.image ?? defaultIcon;
      const sprite = new Sprite2d(`${this.name}:${i + 1}`, img, new Vector2(size, size), false, this);
      sprite.localPosition.set((this.iconSize + this.iconSpacing) * i - this.barWidth / 2, 0);
      // @todo: YUCK
      new Text2d(new Vector2(4, 10), getHotbarKeyText(1, i + 1), 12, "Monospace", sprite);
    }
  }
}
