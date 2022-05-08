import { Vector2, MathUtils, Easing } from "@js-mmo/core";

import { Square } from "../../shapes/square";

interface ScaleKeyframe {
  innerScale: number;
  outerScale: number;
  innerTiming(t: number): number;
  outerTiming(t: number): number;
}

// @todo add text: "parent %x, child %y"
export class ScaleTest extends Square {
  private _innerSquare: Square;

  // Animation Config
  private readonly _animationTime = 300;
  private readonly _intervalDelay = 1000;
  private readonly _keyframes: ScaleKeyframe[] = [
    {
      innerScale: 1,
      outerScale: 1,
      innerTiming: Easing.smootherstep,
      outerTiming: Easing.easeIn,
    },
    {
      innerScale: 1,
      outerScale: 2,
      innerTiming: Easing.smoothstep,
      outerTiming: Easing.smootherstep,
    },
    {
      innerScale: 0.5,
      outerScale: 2,
      innerTiming: Easing.smootherstep,
      outerTiming: Easing.smootherstep,
    },
  ];

  // Animation state
  private _keyframeIndex = 0;
  private _animationStepStarted = -1;
  private _animationStepEnds = -1;
  private _nextKeyframeStart = -1;

  // Animation references
  private _innerStartVector = Vector2.Zero;
  private _innerEndVector = Vector2.Zero;
  private _outerStartVector = Vector2.Zero;
  private _outerEndVector = Vector2.Zero;

  constructor(width: number, height: number) {
    super(width, height);

    this.color = "#3C3744";

    // Make inner square
    const innerSquare = new Square(width / 2, height / 2);
    innerSquare.position.set(0, 0); // move to center
    innerSquare.color = "#090C9B";
    this._innerSquare = innerSquare;

    this.addChild(innerSquare);
  }

  public getLabel(): string {
    return `parent: ${this.scale.x.toFixed(2)}x, child: ${this._innerSquare.scale.x.toFixed(2)}x`;
  }

  public update(delta: number): void {
    this._innerSquare.debug = this.debug;

    // Check if the animation should start
    if (delta >= this._nextKeyframeStart) {
      this._animationStepStarted = delta;
      this._animationStepEnds = delta + this._animationTime;
      this._nextKeyframeStart = delta + this._animationTime + this._intervalDelay;

      // Cache animation targets
      const prevFrame = this._keyframeIndex;
      const nextFrame = (this._keyframeIndex + 1) % this._keyframes.length;
      this._keyframeIndex = nextFrame;

      this._innerStartVector.set(this._keyframes[prevFrame].innerScale, this._keyframes[prevFrame].innerScale);
      this._outerStartVector.set(this._keyframes[prevFrame].outerScale, this._keyframes[prevFrame].outerScale);
      this._innerEndVector.set(this._keyframes[nextFrame].innerScale, this._keyframes[nextFrame].innerScale);
      this._outerEndVector.set(this._keyframes[nextFrame].outerScale, this._keyframes[nextFrame].outerScale);
    }

    const keyframe = this._keyframes[this._keyframeIndex];

    // If we are finished with the animation, dont do anything.
    if (delta >= this._animationStepEnds) {
      this.scale.set(keyframe.outerScale, keyframe.outerScale);
      this._innerSquare.scale.set(keyframe.innerScale, keyframe.innerScale);
      return;
    }

    // Animate
    const t = MathUtils.transformRange(delta, this._animationStepStarted, this._animationStepEnds);
    this.scale = Vector2.Lerp(this._outerStartVector, this._outerEndVector, keyframe.outerTiming(t));
    this._innerSquare.scale = Vector2.Lerp(this._innerStartVector, this._innerEndVector, keyframe.innerTiming(t));
  }

  public render(ctx: CanvasRenderingContext2D): void {
    super.render(ctx);
    this._innerSquare.render(ctx);
  }
}
