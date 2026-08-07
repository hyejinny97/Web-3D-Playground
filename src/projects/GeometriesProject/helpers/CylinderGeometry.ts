import * as THREE from "three";
import type { GeometryHelper } from "../GeometriesProject.types";
import type { ConstructorProps } from "@/types/project";

const DEFAULT_ARGS = {
  radiusTop: 1,
  radiusBottom: 1,
  height: 1,
  radialSegments: 32,
  heightSegments: 1,
  openEnded: false,
  thetaStart: 0,
  thetaLength: 2 * Math.PI,
};

class CylinderGeometryHelper implements GeometryHelper {
  private controlUIGroupName = "CylinderGeometry";
  private args = JSON.parse(JSON.stringify(DEFAULT_ARGS));

  createGeometry() {
    return new THREE.CylinderGeometry(
      this.args.radiusTop,
      this.args.radiusBottom,
      this.args.height,
      this.args.radialSegments,
      this.args.heightSegments,
      this.args.openEnded,
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
        label: "radiusTop",
        min: 1,
        max: 2,
        step: 0.5,
        marks: true,
        initValue: this.args.radiusTop,
        onChange: (value) => {
          this.args.radiusTop = value;
          update();
        },
      },
      {
        type: "range",
        label: "radiusBottom",
        min: 1,
        max: 2,
        step: 0.5,
        marks: true,
        initValue: this.args.radiusBottom,
        onChange: (value) => {
          this.args.radiusBottom = value;
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
        initValue: this.args.height,
        onChange: (value) => {
          this.args.height = value;
          update();
        },
      },
      {
        type: "range",
        label: "radialSegments",
        min: 1,
        max: 50,
        step: 1,
        initValue: this.args.radialSegments,
        onChange: (value) => {
          this.args.radialSegments = value;
          update();
        },
      },
      {
        type: "range",
        label: "heightSegments",
        min: 1,
        max: 10,
        step: 1,
        marks: true,
        initValue: this.args.heightSegments,
        onChange: (value) => {
          this.args.heightSegments = value;
          update();
        },
      },
      {
        type: "checkbox",
        label: "openEnded",
        initChecked: this.args.openEnded,
        onChange: (value) => {
          this.args.openEnded = value;
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

export default CylinderGeometryHelper;
