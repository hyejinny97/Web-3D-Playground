import type { ConstructorProps } from "@/types/project";
import * as THREE from "three";

export interface GeometryHelper {
  name: string;
  createGeometry: () => THREE.BufferGeometry;
  createControlUI: (
    controls: ConstructorProps["controlUI"],
    onControlChange: () => void,
  ) => void;
}
