import type { ControlUIType } from "@/types/project";
import type {
  GeometryHelper,
  FuncsType,
  ParametricFunc,
} from "../ParametricGeometryProject.types";
import { FUNCS } from "../ParametricGeometryProject.constants";
import { ParametricGeometry } from "three/examples/jsm/Addons.js";
import { MathUtils } from "three";

export const DEFAULT_ARGS = {
  func: "plane",
  slices: 8,
  stacks: 8,
} as const;

class ParametricGeometryHelper implements GeometryHelper {
  private controlUIGroupName = "ParametricGeometry";
  private _args: GeometryHelper["args"];
  private funcsDictionary: Record<FuncsType, ParametricFunc> = {
    plane: () => undefined,
    sphere: () => undefined,
    mobius: () => undefined,
    "mobius 3D": () => undefined,
    klein: () => undefined,
  };
  controlUI: ControlUIType;

  constructor(controlUI: ControlUIType) {
    this.controlUI = controlUI;
    this._args = { ...DEFAULT_ARGS };
    this.funcsDictionary["plane"] = this.generatePlaneFunc();
    this.funcsDictionary["sphere"] = this.generateSphereFunc();
    this.funcsDictionary["mobius"] = this.generateMobiusFunc();
    this.funcsDictionary["mobius 3D"] = this.generateMobius3DFunc();
    this.funcsDictionary["klein"] = this.generateKleinFunc();
  }

  get args() {
    return this._args;
  }

  generatePlaneFunc(): ParametricFunc {
    const width = 10;
    const height = 10;

    return function (u, v, target) {
      const x = u * width;
      const y = 0;
      const z = v * height;

      target.set(x, y, z);
    };
  }

  generateSphereFunc(): ParametricFunc {
    const size = 10;

    return function (u, v, target) {
      u *= Math.PI;
      v *= 2 * Math.PI;

      const x = size * Math.sin(u) * Math.cos(v);
      const y = size * Math.sin(u) * Math.sin(v);
      const z = size * Math.cos(u);

      target.set(x, y, z);
    };
  }

  generateMobiusFunc(): ParametricFunc {
    return function (u, t, target) {
      u = u - 0.5;
      const v = 2 * Math.PI * t;

      const a = 2;
      const x = Math.cos(v) * (a + u * Math.cos(v / 2));
      const y = Math.sin(v) * (a + u * Math.cos(v / 2));
      const z = u * Math.sin(v / 2);

      target.set(x, y, z);
    };
  }

  generateMobius3DFunc(): ParametricFunc {
    return function (u, t, target) {
      u *= Math.PI;
      t *= 2 * Math.PI;

      u = u * 2;
      const phi = u / 2;
      const major = 2.25,
        a = 0.125,
        b = 0.65;

      let x = a * Math.cos(t) * Math.cos(phi) - b * Math.sin(t) * Math.sin(phi);
      const z =
        a * Math.cos(t) * Math.sin(phi) + b * Math.sin(t) * Math.cos(phi);
      const y = (major + x) * Math.sin(u);
      x = (major + x) * Math.cos(u);

      target.set(x, y, z);
    };
  }

  generateKleinFunc(): ParametricFunc {
    return function (v, u, target) {
      u *= Math.PI;
      v *= 2 * Math.PI;
      u = u * 2;

      let x;
      let z;

      if (u < Math.PI) {
        x =
          3 * Math.cos(u) * (1 + Math.sin(u)) +
          2 * (1 - Math.cos(u) / 2) * Math.cos(u) * Math.cos(v);
        z =
          -8 * Math.sin(u) -
          2 * (1 - Math.cos(u) / 2) * Math.sin(u) * Math.cos(v);
      } else {
        x =
          3 * Math.cos(u) * (1 + Math.sin(u)) +
          2 * (1 - Math.cos(u) / 2) * Math.cos(v + Math.PI);
        z = -8 * Math.sin(u);
      }

      const y = -2 * (1 - Math.cos(u) / 2) * Math.sin(v);
      target.set(x, y, z).multiplyScalar(0.75);
    };
  }

  createGeometry() {
    const geometry = new ParametricGeometry(
      this.funcsDictionary[this._args.func],
      this._args.slices,
      this._args.stacks,
    );
    geometry.center();
    geometry.rotateX(MathUtils.degToRad(90));
    return geometry;
  }

  createControlUI(update: (updateZoom?: boolean) => void) {
    this.controlUI.add(this.controlUIGroupName, [
      {
        type: "select",
        label: "func",
        options: FUNCS.map((func) => ({ label: func, value: func })),
        initValue: this._args.func,
        onChange: (value) => {
          this._args.func = value as FuncsType;
          update(true);
        },
      },
      {
        type: "range",
        label: "slices",
        min: 1,
        max: 20,
        step: 1,
        initValue: this._args.slices,
        onChange: (value) => {
          this._args.slices = value;
          update();
        },
      },
      {
        type: "range",
        label: "stacks",
        min: 1,
        max: 20,
        step: 1,
        initValue: this._args.stacks,
        onChange: (value) => {
          this._args.stacks = value;
          update();
        },
      },
    ]);
  }
}

export default ParametricGeometryHelper;
