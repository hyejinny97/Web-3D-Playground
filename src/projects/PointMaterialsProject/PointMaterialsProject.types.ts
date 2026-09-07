import * as THREE from "three";
import type {
  GEOMETRY_SHAPES,
  POINT_TEXTURES,
  SIDES,
} from "./PointMaterialsProject.constants";

export type SideType = (typeof SIDES)[keyof typeof SIDES];

export type PointTextureType = keyof typeof POINT_TEXTURES;

export type GeometryShapeType = (typeof GEOMETRY_SHAPES)[number];

export interface MaterialHelperType {
  args: {
    transparent: boolean;
    opacity: number;
    alphaTest: number;
    side: SideType;
    visible: boolean;
  };
  createControlUI: (update: () => void) => void;
  reset: (update: () => void) => void;
}

export interface PointMaterialHelperType {
  args: {
    color: THREE.Color;
    fog: boolean;
    size: number;
    sizeAttenuation: boolean;
    map: PointTextureType;
  };
  material: THREE.PointsMaterial;
  createControlUI: () => void;
  reset: () => void;
}

export interface FogHelperType {
  args: {
    fog: boolean;
    fogColor: THREE.Color;
    fogDensity: number;
  };
  createControlUI: () => void;
  reset: () => void;
}

export interface GeometryHelperType {
  args: {
    shape: GeometryShapeType;
  };
  createGeometry: () => THREE.BufferGeometry;
  createControlUI: (update: () => void) => void;
  reset: (update: () => void) => void;
}
