# @js-mmo/engine/input

## Overview

Each [platform](./platforms.ts) has it's own [`InputSource`](./input_source.ts), which reads and stores the current input for the given platform, and exports a simple API for retrieving whether or not a key is down, pointer coordinates, and whether the pointer button is down (an example can be seen in [`web_input.ts`](./web/web_input.ts)).

Platforms should only start listening for input if they have been activated, which is done by passing the platform to [`InputSystem.registerInputPlatform`](./input_system.ts). From there the game can register an input map, which maps input actions/events to the keys that should trigger it. After registring an input map, the game can listen for those particular actions (as well as raw input) to react and make things happen.

## Basic example

```ts
import {InputSystem, InputPlatforms, KeyboardKeys} from "@js-mmo/engine";

enum InputActions {
    Move = "move",
    Jump = "jump"
}

// Specify web as the platform
InputSystem.registerInputPlatform(InputPlatform.Web);

// Register the input actions + the keys that trigger them
InputSystem.registerInputMap({
    [InputActions.Move]: [KeyboardKeys.W, KeyboardKeys.A, KeyboardKeys.S, KeyboardKeys.D],
    [InputActions.Jump]: KeyboardKeys.Space,
});

// Use it wherever!
if (InputSystem.inputEventDown(InputActions.Move)) {
    const direction = new Vector2();
    
    // Are they moving vertically?
    if (InputSystem.getButtonDownRaw(KeyboardKeys.W)) {
        direction.y = 1;
    } else if (InputSystem.getButtonDownRaw(KeyboardKeys.S)) {
        direction.y = -1;
    }

    // Are they moving sideways?
    if (InputSystem.getButtonDownRaw(KeyboardKeys.D)) {
        direction.x = 1;
    } else if (InputSystem.getButtonDownRaw(KeyboardKeys.A)) {
        direction.x = -1;
    }
    player.DoMove(direction);
}

// Jump!
if (InputSystem.inputEventDown(InputActions.Jump)) {
    player.DoJump();
}

// Do something with the mouse
if (InputSystem.getPointerDown()) {
    // Returns a vec2:
    ui.raycast(InputSystem.getPointerCoords());
}
```