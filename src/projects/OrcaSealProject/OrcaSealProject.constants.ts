export const ANIMATION_NAME = {
  seal: {
    swim: "GltfAnimation 0",
  },
  orca: {
    swim: "Swim",
    attack: "BiteAttack",
  },
} as const;

export const TARGET_RANGE_LIMIT = {
  x: 5, // -5 ~ 5
  y: 3, // -3 ~ 3
  z: 2, // -2 ~ 2
} as const;

export const ORIGINAL_MODEL_NAME = "model" as const;

export const ORCA_ATTACK_DISTANCE = 2 as const;
