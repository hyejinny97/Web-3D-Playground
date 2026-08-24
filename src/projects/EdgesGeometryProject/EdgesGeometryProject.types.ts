import * as THREE from "three";
import type { GEOMETRY_OPTIONS } from "./EdgesGeometryProject.constants";

export type GeometryOptions = (typeof GEOMETRY_OPTIONS)[number];

export interface WireframeGeometryHelperType {
  args: {
    geometry: GeometryOptions;
  };
  createGeometry: () => THREE.WireframeGeometry;
  createControlUI: (update: () => void) => void;
  reset: (update: () => void) => void;
}

export interface EdgesGeometryHelperType {
  args: {
    geometry: GeometryOptions;
    thresholdAngle: number;
  };
  createGeometry: () => THREE.BufferGeometry;
  createControlUI: (update: () => void) => void;
  reset: (update: () => void) => void;
}

export interface GeometryHelperType {
  controlUIGroupName: string;
  createGeometry: () => THREE.BufferGeometry;
  createControlUI: (update: () => void) => void;
  reset: (update: () => void) => void;
}

export interface GeometryDictionaryType {
  values: {
    wireframe: {
      helper: WireframeGeometryHelperType;
      model?: THREE.LineSegments;
      position?: THREE.Vector3;
    };
    edges: {
      helper: EdgesGeometryHelperType;
      model?: THREE.LineSegments;
      position?: THREE.Vector3;
    };
  };
  isGeometryName: (
    name: string,
  ) => name is keyof GeometryDictionaryType["values"];
  setPosition: (
    name: keyof GeometryDictionaryType["values"],
    position: THREE.Vector3,
  ) => void;
}
