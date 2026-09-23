import type { StateType } from "./GLTFModelCanvas.types";

export const INITIAL_STATE: StateType = {
  gear: "parking",
  pedal: "idle",
  steeringWheel: "idle",
  lightOn: false,
};

export const TUTORIALS = [
  {
    type: "gear",
    controls: [
      { id: "parking", keyboardKey: "P", description: "Parking" },
      { id: "drive", keyboardKey: "D", description: "Drive" },
      { id: "reverse", keyboardKey: "R", description: "Reverse" },
    ],
  },
  {
    type: "pedal",
    controls: [
      { id: "accelerate", keyboardKey: "↑", description: "Accelerate" },
      { id: "brake", keyboardKey: "↓", description: "Brake" },
    ],
  },
  {
    type: "steeringWheel",
    controls: [
      { id: "left", keyboardKey: "←", description: "Turn left" },
      { id: "right", keyboardKey: "→", description: "Turn right" },
    ],
  },
  {
    type: "lightOn",
    controls: [
      { id: "light", keyboardKey: "L", description: "Turn on the light" },
    ],
  },
] as const;
