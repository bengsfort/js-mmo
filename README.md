# @js-mmo

This repo contains my JS-based web-mmo project. It's split into 3 packages at it's core:

- `engine` - The underlying game engine, managing physics, entities, and the game world management.
- `renderer` - The rendering engine, which provides all of utils/management of drawing things to the screen.
- `game` - The actual game, which uses the engine and renderer to make the actual game.

## Scripts

- `yarn dev:core-tests`: Run watchers on [core](./packages/core)/[core-test](./packages/tests/core-test) packages. Brings up a test page with the core test allowing you to work on both the core test and core package simultaneously.
