import { Bounds } from "../math/bounds";
import { MAX_CELL_NODES, WORLD_SIZE } from "../engine_config";
import { Vector2 } from "../math/vector2";
import { QueryableObject } from "../scene/queryable_object";
import { NodeTypes } from "../constants";
import { Node, NodeAddedEvent, NodeRemovedEvent } from "../core/node";
import { Node2d } from "../core/node_2d";

import { WorldCell, WorldUnit } from "./world_cell";

const SceneTree = new Map<number, WorldCell>();
const SceneListeners = new Map<number, [(data: NodeAddedEvent) => void, (data: NodeRemovedEvent) => void]>();
const Observations = new Map<Node, WorldUnit>();

(window as any).__TREES__ = SceneTree;

// Utility functions
function isQueryable(node: Node): boolean {
  return node.type === NodeTypes.Query || node.type === NodeTypes.Draw;
}

function* traverseTree(root: Node): Generator<QueryableObject, void, QueryableObject> {
  let currentRoot: Node = root;
  const nextRoots: Node[] = [];

  while (currentRoot.childCount > 0) {
    // Get all of the current children that are queryable
    for (let i = 0; i < currentRoot.childCount; i++) {
      // If this child has children, queue them up
      const node = currentRoot.children[i];
      if (node.childCount > 0) {
        nextRoots.push(node);
      }

      if (isQueryable(currentRoot.children[i])) {
        // Cast to unknown cause my types are bad
        const queryNode = node as QueryableObject;
        yield queryNode;
      }
    }

    if (nextRoots.length > 0) {
      currentRoot = nextRoots.shift() as Node;
    } else {
      // We're done!
      break;
    }
  }
}

function addNode(scene: Node2d, ev: NodeAddedEvent) {
  const graph = SceneTree.get(scene.id);
  const newNode = ev.data.node;

  if (!graph || isQueryable(newNode)) return;
  const unit = new WorldUnit({
    layer: scene.id,
    node: newNode as QueryableObject,
  });
  const added = graph.insert(unit);
  if (added) {
    Observations.set(newNode, unit);
  }
}

function removeNode(scene: Node2d, ev: NodeRemovedEvent) {
  const graph = SceneTree.get(scene.id);
  const oldNode = ev.data.node;
  if (!graph || oldNode.type !== NodeTypes.Query) return;
  const unit = Observations.get(oldNode);
  if (unit) {
    graph.remove(unit);
    Observations.delete(oldNode);
  }
}

// World Control
export function registerActiveScene(scene: Node2d): void {
  console.log("Setting base scene position:", scene.position);
  const graph = new WorldCell(scene.position, new Vector2(WORLD_SIZE, WORLD_SIZE), MAX_CELL_NODES);
  SceneTree.set(scene.id, graph);

  // Iterate through the tree, inserting each node
  const tree = traverseTree(scene);
  let nodes = tree.next();
  while (!nodes.done) {
    const unit = new WorldUnit({
      layer: scene.id,
      node: nodes.value,
    });
    const added = graph.insert(unit);
    if (added) {
      Observations.set(nodes.value, unit);
    }
    nodes = tree.next();
  }

  const addedEvent = addNode.bind(undefined, scene);
  const removedEvent = removeNode.bind(undefined, scene);
  scene.addEventListener("node_added", addedEvent);
  scene.addEventListener("node_removed", removedEvent);
  SceneListeners.set(scene.id, [addedEvent, removedEvent]);
}

export function unregisterScene(scene: Node2d): void {
  // @todo: Clear out scene tree
  if (SceneTree.has(scene.id)) {
    SceneTree.delete(scene.id);
  }

  const listeners = SceneListeners.get(scene.id);
  if (listeners) {
    scene.removeEventListener("node_added", listeners[0]);
    scene.removeEventListener("node_removed", listeners[1]);
  }
}

export function refresh(): void {
  // console.log("Refreshing world units");
  Observations.forEach(unit => {
    if (!unit.cell) return;

    // If the unit has moved to a new cell, update it!
    // console.log(
    //   "Unit",
    //   unit.node.id,
    //   "updating position..",
    //   unit.node.bounds.position,
    //   "cell bounds:",
    //   unit.cell.boundaries.min.toLiteral(),
    //   unit.cell.boundaries.max.toLiteral()
    // );
    if (!unit.cell.includesPoint(unit.node.bounds.position)) {
      // console.log("===============");
      // console.log("Needs to reparent. (pos:", unit.node.bounds.position, ")");
      // console.log("Old cell bounds:", unit.cell.boundaries.min.toLiteral(), unit.cell.boundaries.max.toLiteral());
      unit.cell.remove(unit);
      const root = unit.cell.root;
      console.log("Re-adding node to root:", root);
      if (root.insert(unit)) {
        console.log("New cell bounds:", unit.cell.boundaries.min.toLiteral(), unit.cell.boundaries.max.toLiteral());
      }
    }
  });
  // SceneTree.forEach(cell =>
  // console.log(
  //   "Checking child counts for main tree: (ne, nw, se, sw)",
  //   cell.ne?.totalChildCount ?? 0,
  //   cell.nw?.totalChildCount ?? 0,
  //   cell.se?.totalChildCount ?? 0,
  //   cell.sw?.totalChildCount ?? 0
  // )
  // );
}

// World Querying
// @todo: Store everything in 1, filter in here
// That way you dont have to add the scene you want to search for and we can store everything in one world cell
export function queryPoint(point: Vector2, layer = -1): QueryableObject[] {
  if (layer > -1) {
    let results: QueryableObject[] = [];
    SceneTree.forEach(tree => {
      results = [...tree.queryPoint(point)];
    });
    return results;
  }
  const tree = SceneTree.get(layer);
  return tree?.queryPoint(point) ?? [];
}

export function queryRegion(region: Bounds, layer = -1): QueryableObject[] {
  if (layer === -1) {
    let results: QueryableObject[] = [];
    SceneTree.forEach(tree => {
      // console.log("Looking for region", region, "in tree", tree);
      results = [...tree.queryRegion(region)];
      // console.log("Hits?", results);
    });
    return results;
  }
  const tree = SceneTree.get(layer);
  return tree?.queryRegion(region) ?? [];
}
