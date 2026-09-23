import type { ActionType, StateType } from "./GLTFModelCanvas.types";

export const reducer = (prevState: StateType, action: ActionType) => {
  switch (action.type) {
    case "gear":
      return { ...prevState, gear: action.value };
    case "pedal":
      return { ...prevState, pedal: action.value };
    case "steeringWheel":
      return { ...prevState, steeringWheel: action.value };
    case "lightOn":
      return { ...prevState, lightOn: action.value };
  }
};
