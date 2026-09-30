import type { StateType } from "./FollowCurveCanvas.types";

export const INITIAL_STATE: StateType = {
  pedal: "idle",
  cameraZoom: false,
};

export const TUTORIALS = [
  {
    type: "pedal",
    controls: [
      { id: "accelerate", keyboardKey: "↑", description: "Accelerate" },
      { id: "brake", keyboardKey: "↓", description: "Brake" },
    ],
  },
  {
    type: "cameraZoom",
    controls: [
      {
        id: "cameraZoom",
        keyboardKey: "Z",
        description: "Zoom in/out on the car",
      },
    ],
  },
] as const;
