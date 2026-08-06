import type { ConstructorProps } from "@/types/project";
import * as THREE from "three";

export interface GeometryHelper {
  createGeometry: () => THREE.BufferGeometry;
  createControlUI: (
    controls: NonNullable<ConstructorProps["controlUI"]>,
    onControlChange: () => void,
  ) => void;
  reset: (
    controlUI: NonNullable<ConstructorProps["controlUI"]>,
    update: () => void,
  ) => void;
}

export interface GeometryDictionaryType {
  [name: string]: {
    helper: GeometryHelper;
    model?: THREE.Group;
    position?: THREE.Vector3;
  };
}
