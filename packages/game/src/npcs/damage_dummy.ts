import { TilesetManager } from "@js-mmo/renderer";
import { Vector2 } from "@js-mmo/engine";

import { Player } from "../players";
import { CharacterStatus } from "../players/status";
import { TILESET_PATH } from "../assets";

export class TargetDummy extends Player {
  //   public character: Character;
  public status = CharacterStatus.Enemy;

  constructor(name: string, pos: Vector2, damaged?: boolean) {
    super(name, pos);
    this.character.name = name;
    this.character.status = CharacterStatus.Enemy;
    if (damaged) {
      this.character.incrementHealth(-this.character.maxHealth * 0.8);
    }
  }

  onActive() {
    if (!this._sprite && !this._nameText) {
      const tileset = TilesetManager.get(TILESET_PATH);
      const [sprite, name] = this._createVisuals(tileset.tiles[2], tileset.tileWidth, tileset.tileHeight);
      this._sprite = sprite;
      this._nameText = name;
    }
  }
}
