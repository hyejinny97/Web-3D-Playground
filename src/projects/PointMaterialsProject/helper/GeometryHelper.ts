import * as THREE from "three";
import type { ControlUIType } from "@/types/project";
import type {
  GeometryHelperType,
  GeometryShapeType,
} from "../PointMaterialsProject.types";
import { GEOMETRY_SHAPES } from "../PointMaterialsProject.constants";

const DEFAULT_ARGS = {
  shape: GEOMETRY_SHAPES[0],
} as const;

class GeometryHelper implements GeometryHelperType {
  private controlUIGroupName = "Geometry";
  private _args: GeometryHelperType["args"];
  controlUI: ControlUIType;

  constructor(controlUI: ControlUIType) {
    this.controlUI = controlUI;
    this._args = { ...DEFAULT_ARGS };
  }

  get args() {
    return this._args;
  }

  createGeometry(): THREE.BufferGeometry {
    switch (this._args.shape) {
      case "Random Points": {
        const RANGE = 100;
        const COUNT = 5000;
        const vertices = [];
        for (let i = 0; i < COUNT; i++) {
          const x = THREE.MathUtils.randFloatSpread(RANGE);
          const y = THREE.MathUtils.randFloatSpread(RANGE);
          const z = THREE.MathUtils.randFloatSpread(RANGE);
          vertices.push(x, y, z);
        }
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute(
          "position",
          new THREE.Float32BufferAttribute(vertices, 3),
        );
        return geometry;
      }
      case "Sphere": {
        const geometry = new THREE.SphereGeometry(50);
        geometry.deleteAttribute("uv");
        return geometry;
      }
    }
  }

  createControlUI(update: () => void) {
    this.controlUI.add(this.controlUIGroupName, [
      {
        type: "select",
        label: "shape",
        options: GEOMETRY_SHAPES.map((shape) => ({
          label: shape,
          value: shape,
        })),
        initValue: this._args.shape,
        onChange: (value) => {
          const shapeValue = value as GeometryShapeType;
          this._args.shape = shapeValue;
          update();
        },
      },
    ]);
  }

  reset(update: () => void) {
    this._args = { ...DEFAULT_ARGS };
    this.controlUI.removeGroup(this.controlUIGroupName);
    update();
  }
}

export default GeometryHelper;
