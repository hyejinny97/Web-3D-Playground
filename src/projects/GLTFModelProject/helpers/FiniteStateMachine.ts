import type {
  FiniteStateMachineType,
  StateInfo,
} from "../GLTFModelProject.types";

class FiniteStateMachine<
  S extends Record<string, StateInfo>,
> implements FiniteStateMachineType<S> {
  private statesInfo: S;
  private currentState: keyof S;
  private then: number = 0;

  constructor({
    statesInfo,
    initialState,
  }: {
    statesInfo: S;
    initialState: keyof S;
  }) {
    this.statesInfo = statesInfo;
    this.currentState = initialState;
    this.translate(initialState);
  }

  get state(): keyof S {
    return this.currentState;
  }

  translate(newState: keyof S) {
    const oldStateInfo = this.statesInfo[this.currentState];
    oldStateInfo.exit?.call(this);

    this.currentState = newState;
    const newStateInfo = this.statesInfo[newState];
    newStateInfo.enter?.call(this);
  }

  update(time: number) {
    time *= 0.001;
    const delta = time - this.then;
    this.then = time;

    const stateInfo = this.statesInfo[this.currentState];
    stateInfo.update?.call(this, delta);
  }
}

export default FiniteStateMachine;
