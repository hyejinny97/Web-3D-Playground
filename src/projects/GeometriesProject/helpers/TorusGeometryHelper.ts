import * as THREE from "three";
import type { GeometryHelper } from "../GeometriesProject.types";
import type { ConstructorProps } from "@/types/project";

const DEFAULT_ARGS = {
  radius: 1,
  tube: 0.4,
  radialSegments: 12,
  tubularSegments: 48,
  arc: 2 * Math.PI,
  thetaStart: 0,
  thetaLength: 2 * Math.PI,
};

class TorusGeometryHelper implements GeometryHelper {
  private controlUIGroupName = "TorusGeometry";
  private args = JSON.parse(JSON.stringify(DEFAULT_ARGS));

  createGeometry() {
    return new THREE.TorusGeometry(
      this.args.radius,
      this.args.tube,
      this.args.radialSegments,
      this.args.tubularSegments,
      this.args.arc,
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
        label: "tube",
        min: 0.1,
        max: 1.5,
        step: 0.1,
        marks: true,
        initValue: this.args.tube,
        onChange: (value) => {
          this.args.tube = value;
          update();
        },
      },
      {
        type: "range",
        label: "radialSegments",
        min: 2,
        max: 30,
        step: 1,
        initValue: this.args.radialSegments,
        onChange: (value) => {
          this.args.radialSegments = value;
          update();
        },
      },
      {
        type: "range",
        label: "tubularSegments",
        min: 2,
        max: 50,
        step: 1,
        initValue: this.args.tubularSegments,
        onChange: (value) => {
          this.args.tubularSegments = value;
          update();
        },
      },
      {
        type: "range",
        label: "arc",
        min: 0,
        max: 360,
        step: 10,
        initValue: THREE.MathUtils.radToDeg(this.args.arc),
        onChange: (value) => {
          this.args.arc = THREE.MathUtils.degToRad(value);
          update();
        },
      },
      {
        type: "range",
        label: "thetaStart",
        min: 0,
        max: 360,
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
        max: 360,
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

export default TorusGeometryHelper;
