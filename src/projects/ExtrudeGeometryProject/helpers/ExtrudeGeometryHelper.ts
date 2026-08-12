import * as THREE from "three";
import type { ControlUIType } from "@/types/project";
import type { GeometryHelper } from "../ExtrudeGeometryProject.types";
import type { ControlType } from "@/types/controls";

export const DEFAULT_ARGS = {
  curveSegments: 12,
  steps: 1,
  depth: 1,
  bevelEnabled: true,
  bevelThickness: 0.2,
  bevelSize: 0.1,
  bevelOffset: 0,
  bevelSegments: 3,
} as const;

class ExtrudeGeometryHelper implements GeometryHelper {
  private controlUIGroupName = "ExtrudeGeometry";
  private _args: GeometryHelper["args"];
  private shape: THREE.Shape;
  private extrudePath: THREE.Curve<THREE.Vector3> | undefined;
  private shapeName: string;
  private extrudePathName: string;
  controlUI: ControlUIType;

  constructor(controlUI: ControlUIType) {
    this.controlUI = controlUI;
    this._args = this.createInitArgs();
    this.shapeName = this.setShapeName();
    this.extrudePathName = this.setExtrudePathName();
    this.shape = this.createShape();
    this.extrudePath = this.createExtrudePath();
  }

  get args() {
    return this._args;
  }

  set args(newArgs: GeometryHelper["args"]) {
    this._args = newArgs;
  }

  createInitArgs(): GeometryHelper["args"] {
    return JSON.parse(JSON.stringify(DEFAULT_ARGS));
  }

  setShapeName(): string {
    return "";
  }

  setExtrudePathName(): string {
    return "";
  }

  createShape(): THREE.Shape {
    return new THREE.Shape();
  }

  createExtrudePath(): THREE.Curve<THREE.Vector3> | undefined {
    return;
  }

  createGeometry() {
    const geometry = new THREE.ExtrudeGeometry(this.shape, {
      curveSegments: this._args.curveSegments,
      steps: this._args.steps,
      depth: this._args.depth,
      bevelEnabled: this._args.bevelEnabled,
      bevelThickness: this._args.bevelThickness,
      bevelSize: this._args.bevelSize,
      bevelOffset: this._args.bevelOffset,
      bevelSegments: this._args.bevelSegments,
      extrudePath: this.extrudePath,
    });
    geometry.center();
    return geometry;
  }

  createControlUI(update: () => void) {
    const controlsToAdd: ControlType[] = [
      {
        type: "plain-text",
        label: "shapes",
        content: this.shapeName,
      },
      {
        type: "range",
        label: "curveSegments",
        min: 1,
        max: 20,
        step: 1,
        initValue: this._args.curveSegments,
        onChange: (value) => {
          this._args.curveSegments = value;
          update();
        },
      },
      {
        type: "range",
        label: "steps",
        min: 1,
        max: 30,
        step: 1,
        initValue: this._args.steps,
        onChange: (value) => {
          this._args.steps = value;
          update();
        },
      },
      {
        type: "range",
        label: "depth",
        min: 1,
        max: 20,
        step: 1,
        initValue: this._args.depth,
        onChange: (value) => {
          this._args.depth = value;
          update();
        },
      },
      {
        type: "checkbox",
        label: "bevelEnabled",
        initChecked: this._args.bevelEnabled,
        onChange: (value) => {
          this._args.bevelEnabled = value;
          update();
        },
      },
      {
        type: "range",
        label: "bevelThickness",
        min: 0,
        max: 1,
        step: 0.1,
        marks: true,
        initValue: this._args.bevelThickness,
        onChange: (value) => {
          this._args.bevelThickness = value;
          update();
        },
      },
      {
        type: "range",
        label: "bevelSize",
        min: 0,
        max: 1,
        step: 0.1,
        marks: true,
        initValue: this._args.bevelSize,
        onChange: (value) => {
          this._args.bevelSize = value;
          update();
        },
      },
      {
        type: "range",
        label: "bevelOffset",
        min: 0,
        max: 1,
        step: 0.1,
        marks: true,
        initValue: this._args.bevelOffset,
        onChange: (value) => {
          this._args.bevelOffset = value;
          update();
        },
      },
      {
        type: "range",
        label: "bevelSegments",
        min: 1,
        max: 10,
        step: 1,
        marks: true,
        initValue: this._args.bevelSegments,
        onChange: (value) => {
          this._args.bevelSegments = value;
          update();
        },
      },
    ];

    if (this.extrudePath) {
      controlsToAdd.push({
        type: "plain-text",
        label: "extrudePath",
        content: this.extrudePathName,
      });
    }

    this.controlUI.add(this.controlUIGroupName, controlsToAdd);
  }

  reset(update: () => void) {
    this._args = this.createInitArgs();
    update();
    this.controlUI.removeGroup(this.controlUIGroupName);
  }
}

export default ExtrudeGeometryHelper;
