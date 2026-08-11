import * as THREE from "three";

export interface GeometryHelper {
  args: { radius: number; detail: number };
  createGeometry: () => THREE.BufferGeometry;
  createControlUI: (update: () => void) => void;
  reset: (update: () => void) => void;
}

export interface GeometryDictionaryType {
  value: {
    [name: string]: {
      helper: GeometryHelper;
      model?: THREE.Group;
      position?: THREE.Vector3;
    };
  };
}
