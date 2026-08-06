import * as THREE from "three";
import type { GeometryHelper } from "../GeometriesProject.types";
import type { ConstructorProps } from "@/types/project";

class BoxGeometryHelper implements GeometryHelper {
  private args = {
    width: 1,
    height: 1,
    depth: 1,
    widthSegments: 1,
    heightSegments: 1,
    depthSegments: 1,
  };

  createGeometry() {
    return new THREE.BoxGeometry(
      this.args.width,
      this.args.height,
      this.args.depth,
      this.args.widthSegments,
      this.args.heightSegments,
      this.args.depthSegments,
    );
  }

  createControlUI(
    controlUI: ConstructorProps["controlUI"],
    onControlChange: () => void,
  ) {
    controlUI.add("BoxGeometry", [
      {
        type: "range",
        label: "width",
        min: 1,
        max: 5,
        step: 1,
        initValue: this.args.width,
        onChange: (value) => {
          this.args.width = value;
          onControlChange();
        },
      },
      {
        type: "range",
        label: "height",
        min: 1,
        max: 5,
        step: 1,
        initValue: this.args.height,
        onChange: (value) => {
          this.args.height = value;
          onControlChange();
        },
      },
      {
        type: "range",
        label: "depth",
        min: 1,
        max: 5,
        step: 1,
        initValue: this.args.depth,
        onChange: (value) => {
          this.args.depth = value;
          onControlChange();
        },
      },
      {
        type: "range",
        label: "widthSegments",
        min: 1,
        max: 5,
        step: 1,
        initValue: this.args.widthSegments,
        onChange: (value) => {
          this.args.widthSegments = value;
          onControlChange();
        },
      },
      {
        type: "range",
        label: "heightSegments",
        min: 1,
        max: 5,
        step: 1,
        initValue: this.args.heightSegments,
        onChange: (value) => {
          this.args.heightSegments = value;
          onControlChange();
        },
      },
      {
        type: "range",
        label: "depthSegments",
        min: 1,
        max: 5,
        step: 1,
        initValue: this.args.depthSegments,
        onChange: (value) => {
          this.args.depthSegments = value;
          onControlChange();
        },
      },
    ]);
  }
}

export default BoxGeometryHelper;
