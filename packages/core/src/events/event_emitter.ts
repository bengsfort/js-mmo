// Event Emission base class.
// Meant to be a fast general purpose event system.
// Inspired by https://github.com/primus/eventemitter3

type ValidEventList = object;
type EventNames<List extends ValidEventList> = keyof List;
type EventArgs<List extends ValidEventList, EventName extends EventNames<List>> = List[EventName] extends unknown[]
  ? List[EventName]
  : never[];
type EventListener<List extends ValidEventList, EventName extends EventNames<List>> = (
  ...args: EventArgs<List, EventName>
) => void;

interface Listener<PayloadArgs extends unknown[]> {
  handler: (...args: PayloadArgs) => void;
  once: boolean;
}

type EventsHolder<EventList extends ValidEventList> = {
  [EventName in keyof EventList]?: Listener<EventArgs<EventList, EventName>>[];
};

export class EventEmitter<EventList extends ValidEventList> {
  private _events: EventsHolder<EventList>;
  private _eventsCount: number;

  constructor() {
    this._events = {};
    this._eventsCount = 0;
  }

  private _addListener<EventName extends EventNames<EventList>>(
    event: EventName,
    handler: EventListener<EventList, EventName>,
    once = false
  ): void {
    const listener: Listener<EventArgs<EventList, EventName>> = {
      handler,
      once,
    };

    if (!this._events[event]) {
      this._events[event] = [listener];
      this._eventsCount++;
    } else {
      this._events[event]?.push(listener);
    }
  }

  // Main API
  public removeListener<EventName extends EventNames<EventList>>(
    event: EventName,
    handler: EventListener<EventList, EventName>,
    once = false
  ): void {
    const listeners = this._events[event];
    if (!listeners) return;

    const len = listeners.length;
    const savedEvents: Listener<EventArgs<EventList, EventName>>[] = [];

    for (let i = 0; i < len; i++) {
      // Essentially does the same as `.filter`, but faster.
      if (listeners[i].handler !== handler || (once && !listeners[i].once)) {
        savedEvents.push(listeners[i]);
      }
    }

    if (savedEvents.length > 0) {
      this._events[event] = savedEvents;
    } else {
      this.clearEvent(event);
    }
  }

  public removeAllListeners<EventName extends EventNames<EventList>>(event?: EventName): void {
    if (!event) {
      this._events = {};
      this._eventsCount = 0;
      return;
    }

    if (this._events[event]) {
      this.clearEvent(event);
    }
  }

  public emit<EventName extends EventNames<EventList>>(event: EventName, ...args: EventArgs<EventList, EventName>) {
    const listeners = this._events[event];
    if (!listeners) return;

    const length = listeners.length;
    for (let i = 0; i < length; i++) {
      if (listeners[i].once) this.removeListener(event, listeners[i].handler, true);
      listeners[i].handler(...args);
    }
  }

  public on<EventName extends EventNames<EventList>>(event: EventName, handler: EventListener<EventList, EventName>) {
    this._addListener(event, handler, false);
  }

  public once<EventName extends EventNames<EventList>>(event: EventName, handler: EventListener<EventList, EventName>) {
    this._addListener(event, handler, true);
  }

  // Info
  public listeners<EventName extends EventNames<EventList>>(event: EventName): EventListener<EventList, EventName>[] {
    const handlers = this._events[event];
    if (!handlers) return [];
    return handlers.map(handlerDef => handlerDef.handler);
  }

  public listenerCount<EventName extends EventNames<EventList>>(event: EventName): number {
    const handlers = this._events[event];
    if (!handlers) return 0;
    return handlers.length;
  }

  public clearEvent<EventName extends EventNames<EventList>>(event: EventName): void {
    if (--this._eventsCount === 0) {
      this._events = {};
    } else {
      delete this._events[event];
    }
  }
}
