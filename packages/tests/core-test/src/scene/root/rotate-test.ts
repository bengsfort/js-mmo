import { Easing, Node2D, MathUtils } from "@js-mmo/core";

import { Label } from "../../shapes/label";
import { Square } from "../../shapes/square";

import { KeyframeAnimation } from "./keyframe-animation";

const LABEL_COLOR = "#7D5BA6";
const OUTER_COLOR = "#3C3744";
const INNER_COLOR = "#090C9B";

interface RotateKeyframe {
  degrees: number;
  timing(t: number): number;
}

const keyframes: RotateKeyframe[] = [
  {
    degrees: 0,
    timing: Easing.smootherstep,
  },
  {
    degrees: 90,
    timing: Easing.smootherstep,
  },
  {
    degrees: 180,
    timing: Easing.smootherstep,
  },
  {
    degrees: 270,
    timing: Easing.smootherstep,
  },
  {
    degrees: 360,
    timing: Easing.smootherstep,
  },
];

export class RotateTest extends Node2D {
  private _titleLabel: Label;
  private _valuesLabel: Label;
  private _outerSquare: Square;
  private _innerSquare: Square;
  private _animation: KeyframeAnimation<RotateKeyframe>;

  // Animation references
  private _lastFrame = -1;
  private _lastRotation = -1;

  constructor(width: number, height: number) {
    super("RotateTest");

    this._animation = new KeyframeAnimation<RotateKeyframe>(keyframes, 300, 1000);

    // Make labels
    this._valuesLabel = new Label("", "16px monospace", LABEL_COLOR);
    this._valuesLabel.position.set(0, -1 * (64 + 16));
    this._titleLabel = new Label("Rotation test", "24px monospace", LABEL_COLOR);
    this._titleLabel.position.set(0, -1 * (64 + 16 + 24));
    this.addChild(this._valuesLabel, this._titleLabel);

    // Make outer square
    const outerSquare = new Square(width, height);
    outerSquare.bounds.debugColor = `#ff0`;
    outerSquare.position.set(0, 0); // move to center
    outerSquare.color = OUTER_COLOR;
    outerSquare.name = "Rotation Test Outer Square";
    this._outerSquare = outerSquare;

    // Make inner square
    const innerSquare = new Square(width / 2, height / 2);
    innerSquare.position.set(0, 0); // move to center
    outerSquare.bounds.debugColor = `#0ff`;
    innerSquare.color = INNER_COLOR;
    innerSquare.name = "Rotation Test Inner Square";
    this._innerSquare = innerSquare;

    // Add them to the hierarchy
    outerSquare.addChild(innerSquare);
    this.addChild(outerSquare);
  }

  public getLabel(): string {
    return `parent: ${this._outerSquare.rotation.toFixed(2)}x, child: ${this._innerSquare.rotation.toFixed(2)}x`;
  }

  public update(frametime: number): void {
    this._animation.update(frametime);

    // Make the smaller do one full rotation every 2 seconds.
    const newInnerRotation = MathUtils.transformRange(frametime, this._lastRotation, this._lastRotation + 2000, 0, 360);
    if (newInnerRotation >= 360) {
      this._lastRotation = frametime;
    }
    this._innerSquare.rotation = newInnerRotation;

    const keyframe = this._animation.getCurrFrame();
    const t = this._animation.getKeyframeTime();

    // If we are finished with the animation, dont do anything.
    if (t >= 1) {
      this._outerSquare.rotation = keyframe.degrees;
    } else {
      // Animate
      const previousFrame = this._animation.getPrevFrame();
      this._outerSquare.rotation = MathUtils.lerp(previousFrame.degrees, keyframe.degrees, keyframe.timing(t));
    }

    this._valuesLabel.text = this.getLabel();
    this._lastFrame = frametime;
  }

  public render(ctx: CanvasRenderingContext2D): void {
    this._outerSquare.render(ctx);
    this._innerSquare.render(ctx);
    this._valuesLabel.render(ctx);
    this._titleLabel.render(ctx);
  }
}
