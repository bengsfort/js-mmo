import { EventEmitter } from "../event_emitter";

interface TestEvent {
  eventName: "test_event";
  data: number;
}

interface EventList {
  test_event: [ev: TestEvent];
}

describe("EventEmitter", () => {
  const dispatcher = new EventEmitter<EventList>();

  afterEach(() => {
    dispatcher.removeAllListeners();
  });

  it("should dispatch events", () => {
    const eventData: TestEvent = {
      eventName: "test_event",
      data: 5,
    };

    const callback = jest.fn((data: TestEvent) => {
      expect(data.eventName).toEqual(eventData.eventName);
      expect(data.data).toEqual(eventData.data);
    });

    dispatcher.on("test_event", callback);
    dispatcher.emit("test_event", eventData);
    expect(callback).toBeCalledTimes(1);
  });

  it("should allow removing event listeners", () => {
    const eventData: TestEvent = {
      eventName: "test_event",
      data: 20,
    };

    const callback = jest.fn((data: TestEvent) => {
      expect(data.eventName).toEqual(eventData.eventName);
      expect(data.data).toEqual(eventData.data);
    });

    dispatcher.on("test_event", callback);
    dispatcher.emit("test_event", eventData);
    dispatcher.removeListener("test_event", callback);
    dispatcher.emit("test_event", eventData);

    expect(callback).toBeCalledTimes(1);
  });
});
