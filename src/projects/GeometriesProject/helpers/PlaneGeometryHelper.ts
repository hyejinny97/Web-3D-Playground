import * as THREE from "three";
import type { GeometryHelper } from "../GeometriesProject.types";
import type { ConstructorProps } from "@/types/project";

const DEFAULT_ARGS = {
  width: 1,
  height: 1,
  widthSegments: 1,
  heightSegments: 1,
};

class PlaneGeometryHelper implements GeometryHelper {
  private controlUIGroupName = "PlaneGeometry";
  private args = JSON.parse(JSON.stringify(DEFAULT_ARGS));

  createGeometry() {
    return new THREE.PlaneGeometry(
      this.args.width,
      this.args.height,
      this.args.widthSegments,
      this.args.heightSegments,
    );
  }

  createControlUI(
    controlUI: NonNullable<ConstructorProps["controlUI"]>,
    update: () => void,
  ) {
    controlUI.add(this.controlUIGroupName, [
      {
        type: "range",
        label: "width",
        min: 1,
        max: 2,
        step: 0.5,
        marks: true,
        initValue: this.args.width,
        onChange: (value) => {
          this.args.width = value;
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
        label: "widthSegments",
        min: 1,
        max: 10,
        step: 1,
        marks: true,
        initValue: this.args.widthSegments,
        onChange: (value) => {
          this.args.widthSegments = value;
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

export default PlaneGeometryHelper;
