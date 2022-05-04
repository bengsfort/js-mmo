export function throttle<FnType extends (...args: unknown[]) => void>(duration: number, fn: FnType): VoidFunction {
  let lastTriggered = -1;
  let updateQueued = -1;

  return (...args: unknown[]) => {
    const now = performance.now();
    const nextAvailable = lastTriggered + duration;

    // Ignore if throttling. Make sure we queue updates to cover the "last" trigger.
    if (now < nextAvailable) {
      if (updateQueued === -1) {
        updateQueued = window.setTimeout(() => {
          fn(...args);
          window.clearTimeout(updateQueued);
        }, nextAvailable - now);
      }
      return;
    }

    // Clear any delayed executions if they haven't popped yet
    if (updateQueued !== -1) {
      window.clearTimeout(updateQueued);
      updateQueued = -1;
    }

    lastTriggered = now;
    fn(...args);
  };
};
