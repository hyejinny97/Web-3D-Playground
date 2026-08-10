import * as THREE from "three";

export interface GeometryHelper {
  createGeometry: () => THREE.BufferGeometry;
  createControlUI: (update: () => void) => void;
  setRadius: (radius: number) => void;
  setDetail: (detail: number) => void;
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
