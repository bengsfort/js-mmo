import * as GameLoop from "../game_loop";
import { Node2d } from "../core/node_2d";
import { NodeTypes } from "../constants";

export class SceneObject extends Node2d {
  type = NodeTypes.Node;
  private _updateHandlerId = -1;
  private _postUpdateHandlerId = -1;
  private _fixedUpdateHandlerId = -1;

  public setActive(active: boolean): void {
    if (active === this.isActive) return;
    if (active) {
      this._updateHandlerId = GameLoop.registerUpdateHandler(() => this.update());
      this._postUpdateHandlerId = GameLoop.registerPostUpdateHandler(() => this.postUpdate());
      this._fixedUpdateHandlerId = GameLoop.registerFixedUpdateHandler(() => this.fixedUpdate());
    } else {
      GameLoop.removeUpdateHandler(this._updateHandlerId);
      GameLoop.removePostUpdateHandler(this._postUpdateHandlerId);
      GameLoop.removeFixedUpdateHandler(this._fixedUpdateHandlerId);
    }
  }

  update = (): void => {};
  postUpdate = (): void => {};
  fixedUpdate = (): void => {};
}
