/* eslint-disable @typescript-eslint/no-explicit-any */
export function throttle<T extends (...args: any[]) => void>(
  func: T,
  delay: number, // 단위: ms
): (...args: Parameters<T>) => void {
  let lastTime = 0;

  return function (this: any, ...args: Parameters<T>) {
    const now = Date.now();
    if (now - lastTime >= delay) {
      func.apply(this, args);
      lastTime = now;
    }
  };
}
