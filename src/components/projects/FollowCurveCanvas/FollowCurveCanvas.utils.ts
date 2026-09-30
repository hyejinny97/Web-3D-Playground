import type { ActionType, StateType } from "./FollowCurveCanvas.types";

export const reducer = (prevState: StateType, action: ActionType) => {
  switch (action.type) {
    case "pedal":
      return { ...prevState, pedal: action.value };
    case "cameraZoom":
      return { ...prevState, cameraZoom: action.value };
  }
};
