import * as GameLoop from "../game_loop";
import { Node2d } from "../core/node_2d";
import { NodeTypes } from "../constants";
import { Vector2 } from "../math/vector2";

export class SceneObject extends Node2d {
  type = NodeTypes.Node;

  private _updateHandlerId = -1;
  private _postUpdateHandlerId = -1;
  private _fixedUpdateHandlerId = -1;
  private _activating = false;
  private _deactivating = false;

  constructor(name = "", parent?: Node2d) {
    super(name, parent);
    this.setActive(true);
  }

  public setActive(active: boolean): void {
    if (active === this.isActive) return;
    this._active = active;
    if (active) {
      this._activating = true;
      // Call onActive on first tick
      this._updateHandlerId = GameLoop.registerUpdateHandler((timestamp: number) => {
        if (this._activating) {
          this.onActive();
          this._activating = false;
        }
        this.update(timestamp);
      });
      // If deactivating, remove after the next frame
      this._postUpdateHandlerId = GameLoop.registerPostUpdateHandler((timestamp: number) => {
        this.postUpdate(timestamp);
        if (this._deactivating) {
          GameLoop.removeUpdateHandler(this._updateHandlerId);
          GameLoop.removePostUpdateHandler(this._postUpdateHandlerId);
          GameLoop.removeFixedUpdateHandler(this._fixedUpdateHandlerId);
          this.onInactive();
          this._deactivating = false;
        }
      });
      this._fixedUpdateHandlerId = GameLoop.registerFixedUpdateHandler((timestamp: number) =>
        this.fixedUpdate(timestamp)
      );
    } else {
      this._deactivating = true;
    }
  }

  update: GameLoop.LoopHandler = (): void => {};
  postUpdate: GameLoop.LoopHandler = (): void => {};
  fixedUpdate: GameLoop.LoopHandler = (): void => {};
}
