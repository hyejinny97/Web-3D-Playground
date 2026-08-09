import * as THREE from "three";
import type { GeometryHelper } from "../GeometriesProject.types";
import type { ConstructorProps } from "@/types/project";

const DEFAULT_ARGS = {
  radius: 1,
  tube: 0.4,
  tubularSegments: 64,
  radialSegments: 8,
  p: 2,
  q: 3,
};

class TorusKnotGeometryHelper implements GeometryHelper {
  private controlUIGroupName = "TorusKnotGeometry";
  private args = JSON.parse(JSON.stringify(DEFAULT_ARGS));

  createGeometry() {
    return new THREE.TorusKnotGeometry(
      this.args.radius,
      this.args.tube,
      this.args.tubularSegments,
      this.args.radialSegments,
      this.args.p,
      this.args.q,
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
        min: 0,
        max: 1,
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
        label: "tubularSegments",
        min: 1,
        max: 70,
        step: 1,
        initValue: this.args.tubularSegments,
        onChange: (value) => {
          this.args.tubularSegments = value;
          update();
        },
      },
      {
        type: "range",
        label: "radialSegments",
        min: 1,
        max: 20,
        step: 1,
        initValue: this.args.radialSegments,
        onChange: (value) => {
          this.args.radialSegments = value;
          update();
        },
      },
      {
        type: "range",
        label: "p",
        min: 1,
        max: 20,
        step: 1,
        initValue: this.args.p,
        onChange: (value) => {
          this.args.p = value;
          update();
        },
      },
      {
        type: "range",
        label: "q",
        min: 1,
        max: 20,
        step: 1,
        initValue: this.args.q,
        onChange: (value) => {
          this.args.q = value;
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

export default TorusKnotGeometryHelper;
