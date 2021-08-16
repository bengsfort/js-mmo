import { Character, Player } from "../players";
import { Sprite2d, Text2d, TilesetManager } from "@js-mmo/renderer";

import { CharacterStatus } from "../players/status";
import { TILESET_PATH } from "../assets";
import { Vector2 } from "@js-mmo/engine";

export class TargetDummy extends Player {
  //   public character: Character;
  public status = CharacterStatus.Enemy;

  constructor(name: string, pos: Vector2) {
    super(name, pos);
    this.character.name = name;
    this.character.status = CharacterStatus.Enemy;

    const tileset = TilesetManager.get(TILESET_PATH);
    this._sprite.texture = tileset.tiles[2];
    this._nameText.color = "#ff8933";
  }

  fixedUpdate = () => {
    this.character.incrementHealth(-1);
  };
}
