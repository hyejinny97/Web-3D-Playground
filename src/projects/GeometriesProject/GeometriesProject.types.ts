import type { ConstructorProps } from "@/types/project";
import * as THREE from "three";

export interface GeometryHelper {
  createGeometry: () => THREE.BufferGeometry;
  createControlUI: (
    controls: ConstructorProps["controlUI"],
    onControlChange: () => void,
  ) => void;
}

export interface GeometryDictionaryType {
  [name: string]: {
    helper: GeometryHelper;
    model?: THREE.Group;
    position?: THREE.Vector3;
  };
}
