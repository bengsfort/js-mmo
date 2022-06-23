export class FPSCounter {
  private _lastFrameStart = -1;
  private _lastFrameEnd = -1;
  private _currentFrameStart = -1;

  public frameStart() {
    this._lastFrameStart = this._currentFrameStart;
    this._lastFrameEnd = performance.now();
    this._currentFrameStart = this._lastFrameEnd;
  }

  public deltaTime() {
    return this._lastFrameEnd - this._lastFrameStart;
  }

  public currentFps() {
    return 1000 / this.deltaTime();
  }

  public now() {
    return this._currentFrameStart;
  }
}
