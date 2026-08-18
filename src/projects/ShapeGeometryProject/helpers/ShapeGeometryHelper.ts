import * as THREE from "three";
import type { ControlUIType } from "@/types/project";
import type { GeometryHelper, ShapeType } from "../ShapeGeometryProject.types";
import koreaGeoData from "@/assets/json/normalized_korea_geolocation.json" with { type: "json" };
import { SHAPES } from "../ShapeGeometryProject.constants";

const DEFAULT_ARGS = {
  shapeName: "Arc",
  curveSegments: 12,
} as const;

class ShapeGeometryHelper implements GeometryHelper {
  private controlUIGroupName = "ShapeGeometry";
  private _args: GeometryHelper["args"];
  private _shapes: Map<ShapeType, THREE.Shape | THREE.Shape[]> = new Map();
  controlUI: ControlUIType;

  constructor(controlUI: ControlUIType) {
    this.controlUI = controlUI;
    this._args = { ...DEFAULT_ARGS };
    this.shapes.set("Arc", this.generateArcShape());
    this.shapes.set("Heart", this.generateHeartShape());
    this.shapes.set("Star", this.generateStarShape());
    this.shapes.set("Korea", this.generateKoreaShape());
  }

  get args() {
    return this._args;
  }

  get shapes() {
    return this._shapes;
  }

  generateArcShape(): THREE.Shape {
    const shape = new THREE.Shape();
    shape.moveTo(5, 1);
    shape.absarc(1, 1, 4, 0, Math.PI * 2, false);
    return shape;
  }

  generateHeartShape(): THREE.Shape {
    const shape = new THREE.Shape();

    const x = 2.5;
    const y = 5;

    shape.moveTo(x - 2.5, y - 2.5);
    shape.bezierCurveTo(x - 2.5, y - 2.5, x - 2, y, x, y);
    shape.bezierCurveTo(x + 3, y, x + 3, y - 3.5, x + 3, y - 3.5);
    shape.bezierCurveTo(x + 3, y - 5.5, x + 1.5, y - 7.7, x - 2.5, y - 9.5);
    shape.bezierCurveTo(x - 6, y - 7.7, x - 8, y - 4.5, x - 8, y - 3.5);
    shape.bezierCurveTo(x - 8, y - 3.5, x - 8, y, x - 5, y);
    shape.bezierCurveTo(x - 3.5, y, x - 2.5, y - 2.5, x - 2.5, y - 2.5);

    return shape;
  }

  generateStarShape(): THREE.Shape {
    const shape = new THREE.Shape();

    const points = 5;
    const outerRadius = 10;
    const innerRadius = 5;

    for (let i = 0; i < 2 * points; i++) {
      const r = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i / (2 * points)) * Math.PI * 2 - Math.PI / 2;
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;

      if (i === 0) {
        shape.moveTo(x, y);
      } else {
        shape.lineTo(x, y);
      }
    }
    shape.closePath();

    return shape;
  }

  generateKoreaShape(): THREE.Shape[] {
    const koreaShapes: THREE.Shape[] = [];
    koreaGeoData.forEach(({ shapes }) => {
      shapes.forEach((shape) => {
        const geoShape = new THREE.Shape();
        shape.forEach((coord, idx) => {
          if (idx === 0) {
            geoShape.moveTo(coord[0], coord[1]);
          } else {
            geoShape.lineTo(coord[0], coord[1]);
          }
        });
        koreaShapes.push(geoShape);
      });
    });
    return koreaShapes;
  }

  validateShapeName(name: string): name is ShapeType {
    if (!SHAPES.some((shape) => shape === name)) {
      throw new Error(`'${name}' name은 올바른 Shape 명이 아닙니다.`);
    }
    return true;
  }

  createGeometry() {
    return new THREE.ShapeGeometry(
      this.shapes.get(this._args.shapeName),
      this._args.curveSegments,
    );
  }

  createControlUI(update: (updateZoom?: boolean) => void) {
    this.controlUI.add(this.controlUIGroupName, [
      {
        type: "select",
        label: "shapes",
        options: SHAPES.map((shape) => ({ label: shape, value: shape })),
        initValue: this._args.shapeName,
        onChange: (value) => {
          if (this.validateShapeName(value)) {
            this._args.shapeName = value;
            update(true);
          }
        },
      },
      {
        type: "range",
        label: "curveSegments",
        min: 1,
        max: 20,
        step: 1,
        initValue: this._args.curveSegments,
        onChange: (value) => {
          this._args.curveSegments = value;
          update();
        },
      },
    ]);
  }
}

export default ShapeGeometryHelper;
