export interface AnimationHelperType {
  getAnimationNames: () => string[];
  play: ({ name, startAt }: { name: string; startAt?: number }) => void;
  update: (time: number) => void;
}
