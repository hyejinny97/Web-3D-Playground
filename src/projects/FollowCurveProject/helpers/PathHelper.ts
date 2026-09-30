import * as THREE from "three";
import type {
  CarHelperType,
  PathHelperType,
} from "../FollowCurveProject.types";
import {
  CURVE_POINTS_COUNT,
  PATH_POINTS,
} from "../FollowCurveProject.constants";

interface PathHelperProps {
  pathColor?: THREE.Color;
}

class PathHelper implements PathHelperType {
  private pathColor: THREE.Color;
  private curve!: THREE.Curve<THREE.Vector3>;
  private _path!: THREE.Line;
  private isVisible: boolean = false;
  private model: CarHelperType | null = null;
  private modelPoint = 0; // 범위: 0 ~ 1
  private then: number = 0; // 단위: s

  constructor(props?: PathHelperProps) {
    const { pathColor = new THREE.Color(0xff0000) } = props || {};
    this.pathColor = pathColor;

    this.createPath();
  }

  get path() {
    return this._path;
  }

  private createPath() {
    const points = PATH_POINTS.map((point) => new THREE.Vector3(...point));
    this.curve = new THREE.CatmullRomCurve3(points);
    const curvePoints = this.curve.getPoints(CURVE_POINTS_COUNT);

    const geometry = new THREE.BufferGeometry().setFromPoints(curvePoints);
    const material = new THREE.LineBasicMaterial({
      color: this.pathColor,
      depthTest: false,
    });
    this._path = new THREE.Line(geometry, material);
    this._path.renderOrder = 999;
    this._path.visible = this.isVisible;
  }

  visible() {
    this.isVisible = true;
    this._path.visible = this.isVisible;
  }

  invisible() {
    this.isVisible = false;
    this._path.visible = this.isVisible;
  }

  followPath(model: CarHelperType) {
    this.model = model;
  }

  update(time: number) {
    if (!this.model || this.model.speed === null) return;

    time *= 0.001;
    const delta = time - this.then;
    this.then = time;

    const t =
      (this.modelPoint + (this.model.speed * delta) / this.curve.getLength()) %
      1;
    this.modelPoint = t;

    const position = this.curve.getPointAt(t);
    const tangent = this.curve.getTangentAt(t).normalize();

    if (this.model) {
      this.model.root.position.copy(position);
      this.model.root.lookAt(position.clone().add(tangent));
    }
  }
}

export default PathHelper;
