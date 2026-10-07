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
} as const;

export const MAX_ROTATION_PER_FRAME = 12; // 단위: degree
