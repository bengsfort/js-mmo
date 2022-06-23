export enum NodeTypes {
  // General Nodes.
  Node = "node",
  // Queryable nodes (Mostly used for physics/raycasts).
  Query = "query",
  // Drawable nodes (Used to rendering).
  Draw = "draw",
  // Special nodes.
  Scene = "scene", // Root nodes/scenes.
  Camera = "camera", // Cameras.
}
