import * as THREE from "three";
import type { ControlUIType } from "@/types/project";
import type { GeometryHelperType } from "../EdgesGeometryProject.types";

const DEFAULT_ARGS = {
  width: 1,
  height: 1,
  depth: 1,
  widthSegments: 1,
  heightSegments: 1,
  depthSegments: 1,
};

class BoxGeometryHelper implements GeometryHelperType {
  private _controlUIGroupName = "BoxGeometry";
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
    return new THREE.BoxGeometry(
      this._args.width,
      this._args.height,
      this._args.depth,
      this._args.widthSegments,
      this._args.heightSegments,
      this._args.depthSegments,
    );
  }

  createControlUI(update: () => void) {
    this.controlUI.add(this.controlUIGroupName, [
      {
        type: "range",
        label: "width",
        min: 1,
        max: 2,
        step: 0.5,
        marks: true,
        initValue: this._args.width,
        onChange: (value) => {
          this._args.width = value;
          update();
        },
      },
      {
        type: "range",
        label: "height",
        min: 1,
        max: 2,
        step: 0.5,
        marks: true,
        initValue: this._args.height,
        onChange: (value) => {
          this._args.height = value;
          update();
        },
      },
      {
        type: "range",
        label: "depth",
        min: 1,
        max: 2,
        step: 0.5,
        marks: true,
        initValue: this._args.depth,
        onChange: (value) => {
          this._args.depth = value;
          update();
        },
      },
      {
        type: "range",
        label: "widthSegments",
        min: 1,
        max: 5,
        step: 1,
        marks: true,
        initValue: this._args.widthSegments,
        onChange: (value) => {
          this._args.widthSegments = value;
          update();
        },
      },
      {
        type: "range",
        label: "heightSegments",
        min: 1,
        max: 5,
        step: 1,
        marks: true,
        initValue: this._args.heightSegments,
        onChange: (value) => {
          this._args.heightSegments = value;
          update();
        },
      },
      {
        type: "range",
        label: "depthSegments",
        min: 1,
        max: 5,
        step: 1,
        marks: true,
        initValue: this._args.depthSegments,
        onChange: (value) => {
          this._args.depthSegments = value;
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

export default BoxGeometryHelper;
