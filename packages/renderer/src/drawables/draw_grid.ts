import { Bounds, Vector2 } from "@js-mmo/engine";

import { Camera } from "../camera/camera";
import * as RendererConfig from "../renderer_config";

export function drawUnitGrid(context: CanvasRenderingContext2D, camera?: Camera): void {
  context.setTransform(RendererConfig.PIXEL_RATIO, 0, 0, RendererConfig.PIXEL_RATIO, 0, 0);
  context.save();

  const cameraOffset = camera?.getViewPosition(camera.position) ?? Vector2.Zero;
  const viewport = camera?.getViewportBounds() ?? new Bounds(Vector2.Zero, Vector2.One);

  const viewportsFromOrigin = Vector2.Divide(viewport.position, viewport.size);
  const scale = Math.max(0, camera?.zoom ?? 1);

  //   const unitsPerWidth = window.innerWidth / RendererConfig.PIXELS_PER_UNIT;
  //   const unitsPerHeight = window.innerHeight / RendererConfig.PIXELS_PER_UNIT;

  const xStart = Math.floor((viewportsFromOrigin.x - 1) * viewport.size.x) - viewport.halfSize.x;
  const yStart = Math.floor((viewportsFromOrigin.y - 1) * viewport.size.y) - viewport.halfSize.y;

  context.translate(
    -viewport.northWest.x * RendererConfig.PIXELS_PER_UNIT,
    -viewport.northWest.y * RendererConfig.PIXELS_PER_UNIT
  );
  context.rotate(camera?.rotation ?? 0);
  context.scale(scale, scale);

  context.strokeStyle = "rgba(0, 255, 0, 0.2)";
  context.font = "12px monospace";

  const greaterUnits = Math.max(viewport.size.x * 2, viewport.size.y * 2);
  const gridBoxSize = new Vector2(viewport.size.x * 2, viewport.size.y * 2);

  for (let i = 0; i < greaterUnits; i++) {
    const xOffset = xStart * RendererConfig.PIXELS_PER_UNIT + i * RendererConfig.PIXELS_PER_UNIT;
    const yOffset = yStart * RendererConfig.PIXELS_PER_UNIT + i * RendererConfig.PIXELS_PER_UNIT;

    if (i <= viewport.size.x * 2) {
      context.strokeRect(
        xOffset - viewport.northWest.x,
        0,
        RendererConfig.PIXELS_PER_UNIT,
        gridBoxSize.y * RendererConfig.PIXELS_PER_UNIT
      );
    }
    if (i <= viewport.size.y * 2) {
      context.strokeRect(
        0,
        yOffset - viewport.northWest.y,
        gridBoxSize.x * RendererConfig.PIXELS_PER_UNIT,
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
