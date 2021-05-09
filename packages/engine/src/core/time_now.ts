const processExists = typeof process !== "undefined";
const performanceExists = typeof performance !== "undefined";

let moduleLoadTime: number = Date.now();

if (processExists && process.hrtime) {
  moduleLoadTime = Number(process.hrtime.bigint());
}

export const now = (): number => {
  if (performanceExists && performance.now) {
    return performance.now();
  } else if (processExists && process.hrtime) {
    return (Number(process.hrtime.bigint()) - moduleLoadTime) / 1e6;
  }
  return Date.now() - moduleLoadTime;
};
