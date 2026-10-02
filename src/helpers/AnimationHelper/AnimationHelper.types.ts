export interface AnimationHelperType {
  getAnimationNames: () => string[];
  play: (name: string) => void;
  update: (time: number) => void;
}
