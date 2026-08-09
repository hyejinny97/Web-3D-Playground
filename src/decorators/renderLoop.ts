export const RenderLoop = () => {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  return function <T extends { new (...args: any[]): any }>(TargetClass: T) {
    return class extends TargetClass {
      loop: boolean;
      constructor(...args: any[]) {
        super(...args);
        this.loop = true;
      }
    };
  };
};
