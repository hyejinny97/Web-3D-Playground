export interface StateType {
  pedal: "idle" | "accelerate" | "brake";
  cameraZoom: boolean;
}

export type ActionType =
  | {
      type: "pedal";
      value: StateType["pedal"];
    }
  | {
      type: "cameraZoom";
      value: StateType["cameraZoom"];
    };
