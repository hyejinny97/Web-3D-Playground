import * as THREE from "three";
import type { ControlUIType } from "@/types/project";
import type { GeometryHelper, PointsType } from "../LatheGeometryProject.types";
import { POINTS } from "../LatheGeometryProject.constants";

export const DEFAULT_ARGS = {
  points: "C-points",
  segments: 12,
  phiStart: 0,
  phiLength: 2 * Math.PI,
} as const;

class LatheGeometryHelper implements GeometryHelper {
  private controlUIGroupName = "LatheGeometry";
  private _args: GeometryHelper["args"];
  private pointsDictionary: Record<PointsType, Array<THREE.Vector2>> = {
    "C-points": [],
    "L-points": [],
  };
  controlUI: ControlUIType;

  constructor(controlUI: ControlUIType) {
    this.controlUI = controlUI;
    this._args = { ...DEFAULT_ARGS };
    this.pointsDictionary["C-points"] = this.generateCPoints();
    this.pointsDictionary["L-points"] = this.generateLPoints();
  }

  get args() {
    return this._args;
  }

  generateCPoints(): Array<THREE.Vector2> {
    const points = [];
    const count = 20;
    const offset = 5;
    const width = 10;
    const height = 20;
    for (let i = 0; i < count; i++) {
      points.push(
        new THREE.Vector2(
          Math.sin(Math.PI * (i / count)) * width + offset,
          (i - count / 2) * (height / count),
        ),
      );
    }
    return points;
  }

  generateLPoints(): Array<THREE.Vector2> {
    const width = 10;
    const height = 20;
    return [
      new THREE.Vector2(width, height / 2),
      new THREE.Vector2(width, -height / 2),
      new THREE.Vector2(0, -height / 2),
    ];
  }

  createGeometry() {
    return new THREE.LatheGeometry(
      this.pointsDictionary[this._args.points],
      this._args.segments,
      this._args.phiStart,
      this._args.phiLength,
    );
  }

  createControlUI(update: () => void) {
    this.controlUI.add(this.controlUIGroupName, [
      {
        type: "select",
        label: "points",
        options: POINTS.map((point) => ({ label: point, value: point })),
        initValue: this._args.points,
        onChange: (value) => {
          this._args.points = value as PointsType;
          update();
        },
      },
      {
        type: "range",
        label: "segments",
        min: 1,
        max: 20,
        step: 1,
        initValue: this._args.segments,
        onChange: (value) => {
          this._args.segments = value;
          update();
        },
      },
      {
        type: "range",
        label: "phiStart",
        min: 0,
        max: 360,
        step: 10,
        initValue: THREE.MathUtils.radToDeg(this._args.phiStart),
        onChange: (value) => {
          this._args.phiStart = THREE.MathUtils.degToRad(value);
          update();
        },
      },
      {
        type: "range",
        label: "phiLength",
        min: 0,
        max: 360,
        step: 10,
        initValue: THREE.MathUtils.radToDeg(this._args.phiLength),
        onChange: (value) => {
          this._args.phiLength = THREE.MathUtils.degToRad(value);
          update();
        },
      },
    ]);
  }
}

export default LatheGeometryHelper;
