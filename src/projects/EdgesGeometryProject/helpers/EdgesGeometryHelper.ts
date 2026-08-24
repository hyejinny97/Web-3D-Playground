import * as THREE from "three";
import type { ControlUIType } from "@/types/project";
import type {
  GeometryHelperType,
  GeometryOptions,
  EdgesGeometryHelperType,
} from "../EdgesGeometryProject.types";
import { GEOMETRY_OPTIONS } from "../EdgesGeometryProject.constants";
import BoxGeometryHelper from "./BoxGeometryHelper";
import IcosahedronGeometryHelper from "./IcosahedronGeometryHelper";

export const DEFAULT_ARGS = {
  geometry: "box",
  thresholdAngle: 1,
} as const;

class EdgesGeometryHelper implements EdgesGeometryHelperType {
  private controlUIGroupName = "EdgesGeometry";
  private _args: EdgesGeometryHelperType["args"];
  private geometryOptionHelpers: Record<GeometryOptions, GeometryHelperType>;
  private controlUI: ControlUIType;
  private prevGeometry?: THREE.BufferGeometry;

  constructor(controlUI: ControlUIType) {
    this._args = { ...DEFAULT_ARGS };
    this.controlUI = controlUI;
    this.geometryOptionHelpers = {
      box: new BoxGeometryHelper(controlUI),
      icosahedron: new IcosahedronGeometryHelper(controlUI),
    };
  }

  get args() {
    return this._args;
  }

  createGeometry() {
    const helper = this.geometryOptionHelpers[this._args.geometry];
    const geometry = helper.createGeometry();

    if (this.prevGeometry) this.prevGeometry.dispose();
    this.prevGeometry = geometry;

    return new THREE.EdgesGeometry(geometry, this._args.thresholdAngle);
  }

  createControlUI(update: () => void) {
    this.controlUI.add(this.controlUIGroupName, [
      {
        type: "select",
        label: "geometry",
        options: GEOMETRY_OPTIONS.map((option) => ({
          label: option,
          value: option,
        })),
        initValue: this._args.geometry,
        onChange: (value) => {
          const newValue = value as GeometryOptions;

          const prevHelper = this.geometryOptionHelpers[this._args.geometry];
          prevHelper.reset(() => undefined);

          const currentHelper = this.geometryOptionHelpers[newValue];
          currentHelper.createControlUI(update);

          this._args.geometry = newValue;
          update();
        },
      },
      {
        type: "range",
        label: "thresholdAngle",
        min: 0,
        max: 100,
        step: 1,
        initValue: this._args.thresholdAngle,
        onChange: (value) => {
          this._args.thresholdAngle = value;
          update();
        },
      },
    ]);

    const helper = this.geometryOptionHelpers[this._args.geometry];
    helper.createControlUI(update);
  }

  reset(update: () => void) {
    Object.values(this.geometryOptionHelpers).forEach((helper) =>
      helper.reset(() => void 0),
    );

    this._args = { ...DEFAULT_ARGS };
    update();
    this.controlUI.removeGroup(this.controlUIGroupName);
  }
}

export default EdgesGeometryHelper;
