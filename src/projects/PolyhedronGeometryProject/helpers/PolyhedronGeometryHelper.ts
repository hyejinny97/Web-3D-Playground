import * as THREE from "three";
import type { GeometryHelper } from "../PolyhedronGeometryProject.types";
import type { ControlUIType } from "@/types/project";

const DEFAULT_ARGS = {
  radius: 1,
  detail: 0,
} as const;

class PolyhedronGeometryHelper implements GeometryHelper {
  private controlUIGroupName: string;
  private _args = JSON.parse(JSON.stringify(DEFAULT_ARGS));
  controlUI: ControlUIType;

  constructor(controlUI: ControlUIType, controlUIGroupName: string) {
    this.controlUI = controlUI;
    this.controlUIGroupName = controlUIGroupName;
  }

  get args() {
    return this._args;
  }

  set args({ radius, detail }: { radius: number; detail: number }) {
    this._args = { radius, detail };
  }

  createGeometry() {
    return new THREE.PolyhedronGeometry();
  }

  createControlUI(
    update: (props?: { radius: number; detail: number }) => void,
  ) {
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
          update({ radius: value, detail: this.args.detail });
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
          update({ radius: this.args.radius, detail: value });
        },
      },
    ]);
  }

  reset(update: () => void) {
    this._args = JSON.parse(JSON.stringify(DEFAULT_ARGS));
    update();
    this.controlUI.removeGroup(this.controlUIGroupName);
  }
}

export default PolyhedronGeometryHelper;
