import { TilesetManager } from "@js-mmo/renderer";
import { Vector2 } from "@js-mmo/engine";

import { Player } from "../players";
import { CharacterStatus } from "../players/status";
import { TILESET_PATH } from "../assets";

export class HealingDummy extends Player {
  //   public character: Character;
  public status = CharacterStatus.Friendly;

  constructor(name: string, pos: Vector2) {
    super(name, pos);
    this.character.name = name;
    this.character.status = CharacterStatus.Friendly;
    this.character.incrementHealth(-this.character.maxHealth * 0.95);
  }

  onActive() {
    if (!this._sprite && !this._nameText) {
      const tileset = TilesetManager.get(TILESET_PATH);
      const [sprite, name] = this._createVisuals(tileset.tiles[3], tileset.tileWidth, tileset.tileHeight);
      this._sprite = sprite;
      this._nameText = name;
    }
  }
}
