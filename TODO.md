# Todo

## Short Term

### Engine
- [ ] Add additional (physics cell tests)[packages/engine/src/world/__tests__/phys_cell.test.ts] for querying and inclusion checks.
- [ ] Create physics body class for automatic physics body management
    + [ ] Figure out how we are going to sync physics bodies with their Bounds....
- [ ] Create physics world class for managing/storing the physics bodies, and inserting them/moving them throughout the physics cells automatically
- [ ] Add some sort of debug module that can expose important engine related data for some sort of renderer to render.
- [ ] Refactor main game loop logic/scene graph logic to also utilise physics cells/physics world
- [ ] Fix broken tests (node2d)

### Renderer
- [ ] Make renderer pull drawables from the new scene graph logic in engine (currently it is self-contained)
- [ ] Add `outline` to rect drawables, also add rect2d helper class (similar to sprite2d, text2d, etc)
- [ ] Investigate the relationship between the pixels per unit + actual in-game elements, as it seems a bit scuffed at the moment and can be difficult to move things where we want them.
- [ ] Add debug renderers
    + [ ] debug mode toggle
    + [ ] scroll view
    + [ ] button
    + [ ] visualization for bounds/rects
    + [ ] visualization for quadtree
    + [ ] Rendering time/game logic processing time
    + [ ] scene hierarchy/scene graph
    + [ ] Draw calls?
    + [ ] # of nodes
    + [ ] # of bounds
    + [ ] # of active quadtree cells
- [ ] Add screen to world coordinates calculation for isometric camera (`public worldFromScreen(pos: Vector2): Vector2`, see [camera.ts](packages/renderer/src/camera/camera.ts))
