import * as THREE from "three";
import type { GeometryHelper } from "../GeometriesProject.types";
import type { ConstructorProps } from "@/types/project";

const DEFAULT_ARGS = {
  innerRadius: 0.5,
  outerRadius: 1,
  thetaSegments: 32,
  phiSegments: 1,
  thetaStart: 0,
  thetaLength: 2 * Math.PI,
};

class RingGeometryHelper implements GeometryHelper {
  private controlUIGroupName = "RingGeometry";
  private args = JSON.parse(JSON.stringify(DEFAULT_ARGS));

  createGeometry() {
    return new THREE.RingGeometry(
      this.args.innerRadius,
      this.args.outerRadius,
      this.args.thetaSegments,
      this.args.phiSegments,
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
        label: "innerRadius",
        min: 0,
        max: 1,
        step: 0.5,
        marks: true,
        initValue: this.args.innerRadius,
        onChange: (value) => {
          this.args.innerRadius = value;
          update();
        },
      },
      {
        type: "range",
        label: "outerRadius",
        min: 1,
        max: 2,
        step: 0.5,
        marks: true,
        initValue: this.args.outerRadius,
        onChange: (value) => {
          this.args.outerRadius = value;
          update();
        },
      },
      {
        type: "range",
        label: "thetaSegments",
        min: 3,
        max: 50,
        step: 1,
        initValue: this.args.thetaSegments,
        onChange: (value) => {
          this.args.thetaSegments = value;
          update();
        },
      },
      {
        type: "range",
        label: "phiSegments",
        min: 1,
        max: 20,
        step: 1,
        initValue: this.args.phiSegments,
        onChange: (value) => {
          this.args.phiSegments = value;
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

export default RingGeometryHelper;
