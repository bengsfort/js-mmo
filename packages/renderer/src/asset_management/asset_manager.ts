import { logger } from "../logger";

export type AssetLoaderFunction<T> = (src: string) => Promise<T>;
export class AssetManager<T> {
  private _default?: T;
  private _assets = new Map<string, T>();
  private _loaderFunc: AssetLoaderFunction<T>;

  /**
   * Creates an instance of the asset loader.
   * @param loader The function to use to load assets.
   */
  constructor(loader: AssetLoaderFunction<T>, defaultAsset?: string) {
    this._loaderFunc = loader;
    if (defaultAsset) {
      void this.loadDefaultAsset(defaultAsset);
    } else {
      this._default = undefined;
    }
  }

  private async loadDefaultAsset(src: string) {
    try {
      const asset = await this._loaderFunc(src);
      this._default = asset;
    } catch (e) {
      logger.logError("There was an error loading the default asset!", src, e);
    }
  }

  public async preload(sources: string[]): Promise<boolean> {
    try {
      const results = await Promise.all(sources.map(src => this.load(src)));
      return results.every(result => result === true);
    } catch (e) {
      logger.logError("Couldn't preload given asset list.", e);
    }
    return false;
  }

  public async load(source: string): Promise<boolean> {
    try {
      logger.verboseLogInfo(`Loading asset ${source}...`);
      if (this._assets.has(source)) {
        logger.verboseLogWarn(`Called to load asset ${source}, but it already is loaded. Ignoring.`);
        return true;
      }
      const asset = await this._loaderFunc(source);
      this._assets.set(source, asset);
      logger.verboseLogInfo(`${source} loaded!`);
      return true;
    } catch (e) {
      logger.logError(`There was an error loading asset ${source}!`, e);
    }
    return false;
  }

  public isLoaded(asset: string): boolean {
    return this._assets.has(asset);
  }

  public get(asset: string): T {
    const item = this._assets.get(asset);
    if (item) {
      return item;
    }
    logger.verboseLogInfo(`Tried getting asset (${asset}) that doesn't exist. Returning default asset.`);
    return this._default as T;
  }
}
