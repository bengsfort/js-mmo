import { WorldCell } from "./world/world_cell";
import { Node2d } from "./core/node_2d";
import { Vector2 } from "./math/vector2";
import * as EngineConfig from "./engine_config";

const activeScenes = new Map<Node2d, WorldCell>();

export function addScene(scene: Node2d) {
  // @todo: Create instance of World?? That handles the quadtrees?
  // @todo: How do we insert nodes when they get added? `dirty` flag? Partial graph update?
  const cell = new WorldCell(
    scene.position,
    new Vector2(EngineConfig.WORLD_SIZE, EngineConfig.WORLD_SIZE),
    EngineConfig.MAX_CELL_NODES
  );
}
