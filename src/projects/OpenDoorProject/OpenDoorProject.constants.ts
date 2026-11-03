import * as THREE from "three";

export const DOOR_OBJET_NAMES = {
  originalDoor: "Door_8",
  newDoor: "Door_Container",
  board: "Object_6",
  hinge: "Circle003_2",
};

export const BODY_NAMES = {
  door: "door",
  hinge: "door-hinge",
} as const;

export const PRESS_FORCE = 0.2;

export const POINT_INIT_DIRECTION = new THREE.Vector3(0, 0, 1);
