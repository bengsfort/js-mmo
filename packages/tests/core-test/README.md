# js-mmo/core-test

Very very basic test implementation of the core pieces of the engine. This package exists to serve as a test bed for the engine core, without any of the additional game loops or functionality.

## Goal

The goal of this package is to verify that the foundations of the engine are working correctly, that is:

- Nodes (active/inactive states, parenting, etc.)
- Transforms (positioning, scaling, rotation, world space calculations)
- Bounds (click detection, extents, etc.)

## Scripts

- `yarn start`: Starts up a webpack dev server with the test page running.
- `yarn build`: Builds a production-type build of the test page.
- `yarn clean`: Remove any pre-existing build artifacts.
- `yarn lint`: Run linting on the codebase.
