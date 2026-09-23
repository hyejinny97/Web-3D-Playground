export interface StateType {
  gear: "parking" | "drive" | "reverse";
  pedal: "idle" | "accelerate" | "brake";
  steeringWheel: "idle" | "left" | "right";
  lightOn: boolean;
}

export type ActionType =
  | {
      type: "gear";
      value: StateType["gear"];
    }
  | {
      type: "pedal";
      value: StateType["pedal"];
    }
  | {
      type: "steeringWheel";
      value: StateType["steeringWheel"];
    }
  | {
      type: "lightOn";
      value: StateType["lightOn"];
    };
