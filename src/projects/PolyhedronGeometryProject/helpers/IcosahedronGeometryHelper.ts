import * as THREE from "three";
import type { GeometryHelper } from "../PolyhedronGeometryProject.types";
import type { ControlUIType } from "@/types/project";

const DEFAULT_ARGS = {
  radius: 1,
  detail: 0,
} as const;

class IcosahedronGeometryHelper implements GeometryHelper {
  private controlUIGroupName = "IcosahedronGeometry";
  private args = JSON.parse(JSON.stringify(DEFAULT_ARGS));
  controlUI: ControlUIType;

  constructor(controlUI: ControlUIType) {
    this.controlUI = controlUI;
  }

  createGeometry() {
    return new THREE.IcosahedronGeometry(this.args.radius, this.args.detail);
  }

  createControlUI(update: () => void) {
    this.controlUI.add(this.controlUIGroupName, [
      {
        type: "range",
        label: "radius",
        min: 1,
        max: 1.5,
        step: 0.1,
        marks: true,
        initValue: this.args.radius,
        onChange: (value) => {
          this.args.radius = value;
          update();
        },
      },
      {
        type: "range",
        label: "detail",
        min: 0,
        max: 5,
        step: 1,
        marks: true,
        initValue: this.args.detail,
        onChange: (value) => {
          this.args.detail = value;
          update();
        },
      },
    ]);
  }

  setRadius(radius: number) {
    this.args.radius = radius;
  }

  setDetail(detail: number) {
    this.args.detail = detail;
  }
}

export default IcosahedronGeometryHelper;
