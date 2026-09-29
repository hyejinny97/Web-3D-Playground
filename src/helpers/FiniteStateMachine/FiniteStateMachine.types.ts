export interface StateInfo {
  enter?: () => void;
  update?: (delta: number) => void; // 단위: s
  exit?: () => void;
}

export interface FiniteStateMachineType<S extends Record<string, StateInfo>> {
  state: keyof S;
  translate: (newState: keyof S) => void;
  update: (time: number) => void;
}
