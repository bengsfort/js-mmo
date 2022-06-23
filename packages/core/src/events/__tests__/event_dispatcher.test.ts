import { EventDispatcher } from "../event_dispatcher";

interface TestEvent {
  eventName: "test_event";
  data: number;
}

interface EventList {
  test_event: TestEvent;
}

describe("EventDispatcher", () => {
  const dispatcher = new EventDispatcher<EventList>();

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

    dispatcher.addEventListener("test_event", callback);
    dispatcher.dispatchEvent("test_event", eventData);
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

    dispatcher.addEventListener("test_event", callback);
    dispatcher.dispatchEvent("test_event", eventData);
    dispatcher.removeEventListener("test_event", callback);
    dispatcher.dispatchEvent("test_event", eventData);

    expect(callback).toBeCalledTimes(1);
  });
});
