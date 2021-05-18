import { registerFixedUpdateHandler, registerPostUpdateHandler, registerUpdateHandler, removeFixedUpdateHandler, removePostUpdateHandler, removeUpdateHandler } from "game_loop";
import { Node2d } from "../core/node_2d";

export class SceneObject extends Node2d {
  type = "object";
  private _updateHandlerId = -1;
  private _postUpdateHandlerId = -1;
  private _fixedUpdateHandlerId = -1;

  public setActive(active: boolean): void {
    if (active === this.isActive) return;
    if (active) {
      this._updateHandlerId = registerUpdateHandler(this.update);
      this._postUpdateHandlerId = registerPostUpdateHandler(this.postUpdate);
      this._fixedUpdateHandlerId = registerFixedUpdateHandler(this.fixedUpdate);
    } else {
      removeUpdateHandler(this._updateHandlerId);
      removePostUpdateHandler(this._postUpdateHandlerId);
      removeFixedUpdateHandler(this._fixedUpdateHandlerId);
    }
  }
  }
}
