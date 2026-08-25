import * as THREE from "three";
import type { ControlUIType } from "@/types/project";
import type { GeometryHelper, PathType } from "../TubeGeometryProject.types";
import { PATHS } from "../TubeGeometryProject.constants";

const DEFAULT_ARGS = {
  path: "Line",
  tubularSegments: 64,
  radius: 1,
  radialSegments: 8,
  closed: false,
} as const;

class TubeGeometryHelper implements GeometryHelper {
  private controlUIGroupName = "TubeGeometry";
  private _args: GeometryHelper["args"];
  private _paths: Map<PathType, THREE.Curve<THREE.Vector3>> = new Map();
  controlUI: ControlUIType;

  constructor(controlUI: ControlUIType) {
    this.controlUI = controlUI;
    this._args = { ...DEFAULT_ARGS };
    this._paths.set("Line", this.generateLinePath());
    this._paths.set("Sign Curve", this.generateSignCurvePath());
    this._paths.set("Swirl Curve", this.generateSwirlCurvePath());
  }

  get args() {
    return this._args;
  }

  get paths() {
    return this._paths;
  }

  generateLinePath(): THREE.Curve<THREE.Vector3> {
    const SCALE = 10;
    return new THREE.LineCurve3(
      new THREE.Vector3(-SCALE, SCALE, 0),
      new THREE.Vector3(SCALE, -SCALE, 0),
    );
  }

  generateSignCurvePath(): THREE.Curve<THREE.Vector3> {
    class SinCurve extends THREE.Curve<THREE.Vector3> {
      private scale = 1;

      constructor(scale = 1) {
        super();
        this.scale = scale;
      }

      getPoint(t: number, optionalTarget = new THREE.Vector3()) {
        const tx = t * 3 - 1.5;
        const ty = Math.sin(2 * Math.PI * t);
        const tz = 0;
        return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);
      }
    }

    const SCALE = 10;
    return new SinCurve(SCALE);
  }

  generateSwirlCurvePath(): THREE.Curve<THREE.Vector3> {
    const SCALE = 10;
    const POINTS_PER_QUADRANT = 3;
    const REDUCE_PER_POINT = 0.2;
    const anglePerPoint = THREE.MathUtils.degToRad(90) / POINTS_PER_QUADRANT;

    const points: THREE.Vector3[] = [];
    let angle = 0;
    let pointIdx = 0;
    while (true) {
      const reduce = pointIdx * REDUCE_PER_POINT;
      const radius = SCALE - reduce;
      if (radius <= 0) break;

      const x = radius * Math.cos(-angle);
      const y = radius * Math.sin(-angle);

      points.push(new THREE.Vector3(x, y, 0));
      angle += anglePerPoint;
      pointIdx += 1;
    }

    return new THREE.CatmullRomCurve3(points);
  }

  createGeometry() {
    return new THREE.TubeGeometry(
      this._paths.get(this._args.path),
      this._args.tubularSegments,
      this._args.radius,
      this._args.radialSegments,
      this._args.closed,
    );
  }

  createControlUI(update: (updateZoom?: boolean) => void) {
    this.controlUI.add(this.controlUIGroupName, [
      {
        type: "select",
        label: "path",
        options: PATHS.map((path) => ({ label: path, value: path })),
        initValue: this._args.path,
        onChange: (value) => {
          this._args.path = value as PathType;
          update(true);
        },
      },
      {
        type: "range",
        label: "tubularSegments",
        min: 1,
        max: 100,
        step: 1,
        initValue: this._args.tubularSegments,
        onChange: (value) => {
          this._args.tubularSegments = value;
          update();
        },
      },
      {
        type: "range",
        label: "radius",
        min: 0,
        max: 2,
        step: 0.1,
        initValue: this._args.radius,
        onChange: (value) => {
          this._args.radius = value;
          update();
        },
      },
      {
        type: "range",
        label: "radialSegments",
        min: 1,
        max: 20,
        step: 1,
        initValue: this._args.radialSegments,
        onChange: (value) => {
          this._args.radialSegments = value;
          update();
        },
      },
      {
        type: "checkbox",
        label: "closed",
        initChecked: this._args.closed,
        onChange: (value) => {
          this._args.closed = value;
          update();
        },
      },
    ]);
  }
}

export default TubeGeometryHelper;
