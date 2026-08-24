import * as THREE from "three";
import type { ControlUIType } from "@/types/project";
import type { GeometryHelperType } from "../EdgesGeometryProject.types";

const DEFAULT_ARGS = {
  radius: 1,
  detail: 0,
};

class IcosahedronGeometryHelper implements GeometryHelperType {
  private _controlUIGroupName = "IcosahedronGeometry";
  private _args = { ...DEFAULT_ARGS };
  private controlUI: ControlUIType;

  constructor(controlUI: ControlUIType) {
    this.controlUI = controlUI;
  }

  get args() {
    return this._args;
  }

  get controlUIGroupName() {
    return this._controlUIGroupName;
  }

  createGeometry() {
    return new THREE.IcosahedronGeometry(this._args.radius, this._args.detail);
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
        initValue: this._args.radius,
        onChange: (value) => {
          this._args.radius = value;
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
        initValue: this._args.detail,
        onChange: (value) => {
          this._args.detail = value;
          update();
        },
      },
    ]);
  }

  reset(update: () => void) {
    this._args = { ...DEFAULT_ARGS };
    update();
    this.controlUI.removeGroup(this.controlUIGroupName);
  }
}

export default IcosahedronGeometryHelper;
