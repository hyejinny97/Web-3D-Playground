export const TILE_COLOR = "#fde68a";

export const DIRECTION = {
  W: 0,
  A: Math.PI / 2,
  S: Math.PI,
  D: -Math.PI / 2,
  WA: Math.PI / 4,
  SA: (Math.PI * 3) / 4,
  SD: (-Math.PI * 3) / 4,
  WD: -Math.PI / 4,
} as const; // 단위: radian

export const MAX_ROTATION_PER_FRAME = 12; // 단위: degree

export const DIRECTION_KEYS = ["w", "s", "a", "d"] as const;

export const SPEED = {
  IDLE: 0,
  WALK: 3,
  RUN: 7,
} as const; // 단위: world unit/s

export const DISTANCE_FROM_CHARACTER = 5;
