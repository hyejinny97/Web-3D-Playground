import * as THREE from "three";
import type { GeometryHelper } from "../GeometriesProject.types";
import type { ConstructorProps } from "@/types/project";

const DEFAULT_ARGS = {
  radius: 1,
  widthSegments: 32,
  heightSegments: 16,
  phiStart: 0,
  phiLength: 2 * Math.PI,
  thetaStart: 0,
  thetaLength: Math.PI,
};

class SphereGeometryHelper implements GeometryHelper {
  private controlUIGroupName = "SphereGeometry";
  private args = JSON.parse(JSON.stringify(DEFAULT_ARGS));

  createGeometry() {
    return new THREE.SphereGeometry(
      this.args.radius,
      this.args.widthSegments,
      this.args.heightSegments,
      this.args.phiStart,
      this.args.phiLength,
      this.args.thetaStart,
      this.args.thetaLength,
    );
  }

  createControlUI(
    controlUI: NonNullable<ConstructorProps["controlUI"]>,
    update: () => void,
  ) {
    controlUI.add(this.controlUIGroupName, [
      {
        type: "range",
        label: "radius",
        min: 1,
        max: 2,
        step: 0.5,
        marks: true,
        initValue: this.args.radius,
        onChange: (value) => {
          this.args.radius = value;
          update();
        },
      },
      {
        type: "range",
        label: "widthSegments",
        min: 3,
        max: 50,
        step: 1,
        initValue: this.args.widthSegments,
        onChange: (value) => {
          this.args.widthSegments = value;
          update();
        },
      },
      {
        type: "range",
        label: "heightSegments",
        min: 2,
        max: 30,
        step: 1,
        initValue: this.args.heightSegments,
        onChange: (value) => {
          this.args.heightSegments = value;
          update();
        },
      },
      {
        type: "range",
        label: "phiStart",
        min: 0,
        max: 360,
        step: 10,
        initValue: THREE.MathUtils.radToDeg(this.args.phiStart),
        onChange: (value) => {
          this.args.phiStart = THREE.MathUtils.degToRad(value);
          update();
        },
      },
      {
        type: "range",
        label: "phiLength",
        min: 0,
        max: 360,
        step: 10,
        initValue: THREE.MathUtils.radToDeg(this.args.phiLength),
        onChange: (value) => {
          this.args.phiLength = THREE.MathUtils.degToRad(value);
          update();
        },
      },
      {
        type: "range",
        label: "thetaStart",
        min: 0,
        max: 180,
        step: 10,
        initValue: THREE.MathUtils.radToDeg(this.args.thetaStart),
        onChange: (value) => {
          this.args.thetaStart = THREE.MathUtils.degToRad(value);
          update();
        },
      },
      {
        type: "range",
        label: "thetaLength",
        min: 0,
        max: 180,
        step: 10,
        initValue: THREE.MathUtils.radToDeg(this.args.thetaLength),
        onChange: (value) => {
          this.args.thetaLength = THREE.MathUtils.degToRad(value);
          update();
        },
      },
    ]);
  }

  reset(
    controlUI: NonNullable<ConstructorProps["controlUI"]>,
    update: () => void,
  ) {
    this.args = JSON.parse(JSON.stringify(DEFAULT_ARGS));
    update();
    controlUI.removeGroup(this.controlUIGroupName);
  }
}

export default SphereGeometryHelper;
