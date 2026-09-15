import * as THREE from "three";
import type { ROTATION_AXES } from "./BasicTransformProject.constants";

export type RotationAxesType = (typeof ROTATION_AXES)[number];

export interface CubeHelperType {
  args: {
    positionX: number;
    positionY: number;
    positionZ: number;
    scaleX: number;
    scaleY: number;
    scaleZ: number;
    rotationX: number;
    rotationY: number;
    rotationZ: number;
    rotationAxes: RotationAxesType;
  };
  mesh: THREE.Mesh;
  createControlUI: () => void;
  reset: () => void;
}
