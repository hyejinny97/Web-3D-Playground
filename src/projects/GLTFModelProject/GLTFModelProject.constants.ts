export const CAR_PART = {
  frontLeftTireWheel: "node_rim1_-1418",
  frontRightTireWheel: "node_rim2_-1410",
  backLeftTireWheel: "node_rim003_-1414",
  backRightTireWheel: "node_rim004_-1416",
  frontLamps: "node_front_lamps_-1400",
  backLamps: "node_rear_lamps_-1404",
  steeringWheel: "node_steering_wheel_-1426",
};

export const CAR_GEAR_STATES = ["parking", "drive", "reverse"] as const;

export const CAR_PEDAL_STATES = ["idle", "accelerate", "brake"] as const;

export const BASE_SPEED = 90; // 단위: angle/s

export const MIN_SPEED = 0;

export const MAX_SPEED = 900;

export const RECOVERY_ACCELERATION = 5; // 단위: angle/s^2

export const ACCEL_ACCELERATION = 20;

export const BRAKE_ACCELERATION = 20;

export const CAR_STEERING_WHEEL_STATES = ["idle", "left", "right"] as const;

export const STEERING_WHEEL_TURNING_SPEED = 20; // 단위: angle/s

export const STEERING_WHEEL_MAX_TURN = 60; // 단위 angle
