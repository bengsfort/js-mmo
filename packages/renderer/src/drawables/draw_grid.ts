import { Bounds, Vector2 } from "@js-mmo/engine";

import { Camera } from "../camera/camera";
import * as RendererConfig from "../renderer_config";

export function drawUnitGrid(context: CanvasRenderingContext2D, camera?: Camera): void {
  context.setTransform(RendererConfig.PIXEL_RATIO, 0, 0, RendererConfig.PIXEL_RATIO, 0, 0);
  context.save();

  const cameraOffset = camera?.getViewPosition(camera.position) ?? Vector2.Zero;
  const viewport = camera?.getViewportBounds() ?? new Bounds(Vector2.Zero, Vector2.Zero);

  const distanceFromOrigin = Vector2.Divide(viewport.position, viewport.size);
  console.log(
    "distance from origin:",
    distanceFromOrigin.toString(),
    "viewport",
    viewport.position.toString(),
    viewport.size.toString()
  );

  const scale = Math.max(0, camera?.zoom ?? 1);

  //   const unitsPerWidth = window.innerWidth / RendererConfig.PIXELS_PER_UNIT;
  //   const unitsPerHeight = window.innerHeight / RendererConfig.PIXELS_PER_UNIT;

  const xStart = Math.floor(distanceFromOrigin.x);
  const yStart = Math.floor(distanceFromOrigin.y);

  const offset = Vector2.Multiply(viewport.size, new Vector2(xStart, yStart));

  context.translate(
    -viewport.size.x * RendererConfig.PIXELS_PER_UNIT * xStart,
    -viewport.size.y * RendererConfig.PIXELS_PER_UNIT * yStart
  );
  context.rotate(camera?.rotation ?? 0);
  context.scale(scale, scale);

  context.strokeStyle = "rgba(0, 255, 0, 0.2)";
  context.font = "12px monospace";

  const greaterUnits = Math.max(viewport.size.x * 2, viewport.size.y * 2);
  for (let i = 0; i < greaterUnits; i++) {
    const x = i * RendererConfig.PIXELS_PER_UNIT;
    const y = i * RendererConfig.PIXELS_PER_UNIT;

    if (i <= viewport.size.x * 2) {
      context.strokeRect(x, 0, RendererConfig.PIXELS_PER_UNIT, viewport.size.y * RendererConfig.PIXELS_PER_UNIT * 2);
    }
    if (i <= viewport.size.y * 2) {
      context.strokeRect(
        viewport.size.x * xStart,
        viewport.size.y * yStart + y,
        viewport.size.x * 2,
        RendererConfig.PIXELS_PER_UNIT
      );
    }
  }

  //   for (let i = viewport.size.x)

  //   const greaterUnits = Math.max(camera

  //   const greaterUnits = Math.max(unitsPerWidth, unitsPerHeight);
  //   context.fillStyle = "rgba(255, 0, 0, 0.65)";
  //   context.fillText("0, 0", 0, 0);

  //   for (let i = 0; i < greaterUnits; i++) {
  //     const xPosition = i * RendererConfig.PIXELS_PER_UNIT;
  //     const yPosition = i * RendererConfig.PIXELS_PER_UNIT;

  //     const xOffset = cameraOffset.x - Math.floor(cameraOffset.x / RendererConfig.PIXELS_PER_UNIT);
  //     const xAxisStart = cameraOffset.x - xOffset;

  //     const xTranslated = cameraOffset.x + xOffset + xPosition;

  //     const yTranslated = Math.floor(cameraOffset.y) - cameraOffset.y + yPosition;

  //     if (i <= unitsPerWidth) {
  //       context.fillStyle = "rgba(0, 255, 0, 0.65)";
  //       context.strokeRect(xAxisStart + xPosition, cameraOffset.y, RendererConfig.PIXELS_PER_UNIT, window.innerHeight);
  //       context.fillText(
  //         `${Math.floor(cameraOffset.x / RendererConfig.PIXELS_PER_UNIT) + i}`,
  //         xTranslated,
  //         12 - cameraOffset.y
  //       );
  //     }
  //     if (i <= unitsPerHeight) {
  //       context.fillStyle = "rgba(255, 0, 0, 0.65)";
  //       context.strokeRect(0, yPosition, window.innerWidth, RendererConfig.PIXELS_PER_UNIT);
  //       //   context.fillText(`${yTranslated}`, 6 - cameraOffset.x, yPosition + 12);
  //     }
  //   }

  context.restore();
}
