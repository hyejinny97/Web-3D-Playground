import * as CANNON from "cannon-es";

export const FLOOR_SIZE = {
  width: 15,
  height: 0.1,
  depth: 10,
} as const;

export const DOLL_SIZE = {
  width: 1,
  height: 1,
  depth: 1,
} as const;

export const MARKER_RADIUS = 0.1;

export const PLANE_SIZE = {
  width: 10,
  height: 10,
} as const;

export const BODY_NAME = {
  doll: "doll",
};

export const DOLL_INIT_POSITION = new CANNON.Vec3(0, DOLL_SIZE.height, 0);
