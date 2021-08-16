import { ImageManager, Sprite2d } from "@js-mmo/renderer";
import { SceneObject, Vector2 } from "@js-mmo/engine";
import { ISOMETRIC_PIXELS_PER_UNIT } from "@js-mmo/renderer/src/renderer_config";

import BgGreen from "../assets/nameplate-big-green.png";
import BgRed from "../assets/nameplate-big-red.png";
import BorderGreen from "../assets/nameplate-border-big-green.png";
import BorderRed from "../assets/nameplate-border-big-red.png";
import { Character } from "../players";

export class Nameplate extends SceneObject {
  public width = 32;
  public height = 7;

  private _border: Sprite2d;
  private _mainBar: Sprite2d;
  private _source: Character;

  constructor(source: Character) {
    super(`${source.name}:nameplate`);
    this._source = source;
    const [border, bar] = this.createVisuals();
    this._border = border;
    this._mainBar = bar;
  }

  createVisuals(): [Sprite2d, Sprite2d] {
    const borderSprite = new Sprite2d(
      `${this.name}:border`,
      ImageManager.get(BorderGreen),
      new Vector2(this.width, 7),
      true,
      this
    );
    const barSprite = new Sprite2d(
      `${this.name}:bar`,
      ImageManager.get(BgGreen),
      new Vector2(this.width - 2, 5),
      true,
      this
    );
    borderSprite.origin = new Vector2(0.5, 0.5);
    borderSprite.localPosition.set(0, 0);

    barSprite.origin = new Vector2(0, 0);
    // @todo: Really need to find a better way of handling PPU.
    const offset = 6 / ISOMETRIC_PIXELS_PER_UNIT.x;
    barSprite.localPosition.set(-0.5 + 2 / ISOMETRIC_PIXELS_PER_UNIT.x - offset, 0.5 - offset);
    return [borderSprite, barSprite];
  }

  update = () => {
    const currentHpPercent = this._source.health / this._source.maxHealth;
    if (currentHpPercent <= 0.25) {
      this._border.texture = ImageManager.get(BorderRed);
      this._mainBar.texture = ImageManager.get(BgRed);
    }
    this._mainBar.size.x = (this.width - 2) * currentHpPercent;
  };
}
