import { makeLogger } from "./logging";

const { verboseLogInfo } = makeLogger("CORE");

export interface EngineEvent {
  type: string;
  source: unknown;
  data?: unknown;
}

export type EngineEventListener<E extends EngineEvent = EngineEvent> = (data: E) => void;
export class EventDispatcher<EventList> {
  private _listeners = new Map<keyof EventList, EngineEventListener[]>();

  public addEventListener<E extends keyof EventList = keyof EventList, L extends EventList[E] = EventList[E]>(
    event: E,
    listener: (data: L) => void
  ): void;
  public addEventListener(event: string, listener: EngineEventListener) {
    const listeners = this._listeners.get(event as keyof EventList) ?? [];
    if (listeners.indexOf(listener) === -1) {
      this._listeners.set(event as keyof EventList, [...listeners, listener]);
    }
  }

  public removeEventListener<E extends keyof EventList = keyof EventList, L extends EventList[E] = EventList[E]>(
    event: E,
    listener: L
  ): void;
  public removeEventListener(event: string, listener: EngineEventListener): void {
    const listeners = this._listeners.get(event as keyof EventList);
    if (!listeners) {
      verboseLogInfo("Tried removing listener from event", event, "but there are none! Listener:", listener);
      return;
    }
    const index = listeners.indexOf(listener);
    if (index > -1) {
      // Removes in place, so we don't need to update the Map.
      listeners.splice(index, 1);
    }
  }

  public dispatchEvent<E extends keyof EventList = keyof EventList, D extends EventList[E] = EventList[E]>(
    event: E,
    data: D
  ): void;
  public dispatchEvent<E extends EngineEvent = EngineEvent>(event: string, data: E): void {
    const listeners = this._listeners.get(event as keyof EventList);
    if (!listeners || listeners.length === 0) {
      verboseLogInfo("Tried dispatching event", event, "but there are no listeners!");
      return;
    }

    const message = { ...data };
    message.source = this;

    // Make a copy in case things remove themselves as a result of the event
    const copy = listeners.slice(0);
    for (let i = 0; i < copy.length; i++) {
      copy[i](message);
    }
  }
}
