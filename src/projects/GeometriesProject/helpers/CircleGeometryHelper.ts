import * as THREE from "three";
import type { GeometryHelper } from "../GeometriesProject.types";
import type { ConstructorProps } from "@/types/project";

const DEFAULT_ARGS = {
  radius: 1,
  segments: 32,
  thetaStart: 0,
  thetaLength: 2 * Math.PI,
};

class CircleGeometryHelper implements GeometryHelper {
  private controlUIGroupName = "CircleGeometry";
  private args = JSON.parse(JSON.stringify(DEFAULT_ARGS));

  createGeometry() {
    return new THREE.CircleGeometry(
      this.args.radius,
      this.args.segments,
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
        label: "segments",
        min: 1,
        max: 50,
        step: 1,
        initValue: this.args.segments,
        onChange: (value) => {
          this.args.segments = value;
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

export default CircleGeometryHelper;
