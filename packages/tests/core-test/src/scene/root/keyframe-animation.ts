import { Log, MathUtils, Events } from "@js-mmo/core";

const logger = Log.makeLogger("ANIMATION");

interface KeyframeEvents<KeyframeDef> {
  new_keyframe: [previous: KeyframeDef, next: KeyframeDef];
}

export class KeyframeAnimation<KeyframeDef> extends Events.EventEmitter<KeyframeEvents<KeyframeDef>> {
  // Animation Config
  private readonly _animationTime: number;
  private readonly _intervalDelay: number;
  private readonly _keyframes: KeyframeDef[] = [];

  // Animation state
  private _keyframeIndex = 0;
  private _animationStepStarted = -1;
  private _animationStepEnds = -1;
  private _nextKeyframeStart = -1;
  private _currentT = -1;

  //.References
  private _prevFrame: KeyframeDef;
  private _currFrame: KeyframeDef;

  constructor(keyframes: KeyframeDef[], animTime: number, delay: number) {
    super();

    this._keyframes = keyframes;
    this._animationTime = animTime;
    this._intervalDelay = delay;

    this._prevFrame = keyframes[0];
    if (keyframes.length < 1) {
      logger.logWarn("Animation initialized with no keyframes! This will cause errors.");
      this._currFrame = keyframes[0];
    } else {
      this._currFrame = keyframes[1];
    }
  }

  public getPrevFrame(): KeyframeDef {
    return this._prevFrame;
  }

  public getCurrFrame(): KeyframeDef {
    return this._currFrame;
  }

  public getKeyframeTime(): number {
    return this._currentT;
  }

  public update(frametime: number): void {
    // Check if the animation should start
    if (frametime >= this._nextKeyframeStart) {
      this._animationStepStarted = frametime;
      this._animationStepEnds = frametime + this._animationTime;
      this._nextKeyframeStart = frametime + this._animationTime + this._intervalDelay;

      // Cache animation targets
      const prevFrame = this._keyframeIndex;
      const nextFrame = (this._keyframeIndex + 1) % this._keyframes.length;
      this._keyframeIndex = nextFrame;

      this._prevFrame = this._keyframes[prevFrame];
      this._currFrame = this._keyframes[nextFrame];
      this.emit("new_keyframe", this._prevFrame, this._currFrame);
    }

    if (frametime >= this._animationStepEnds) {
      this._currentT = 1;
    } else {
      this._currentT = MathUtils.transformRange(frametime, this._animationStepStarted, this._animationStepEnds);
    }
  }
}
