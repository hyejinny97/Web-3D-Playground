import * as THREE from "three";
import type { PathHelperType } from "../FollowCurveProject.types";
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
  private model: THREE.Object3D | null = null;

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

  followPath(model: THREE.Object3D) {
    this.model = model;
  }

  update(time: number) {
    if (!this.model) return;

    const t = ((time / 200) % CURVE_POINTS_COUNT) / CURVE_POINTS_COUNT;
    const position = this.curve.getPointAt(t);
    const tangent = this.curve.getTangentAt(t).normalize();

    if (this.model) {
      this.model.position.copy(position);
      this.model.lookAt(position.clone().add(tangent));
    }
  }
}

export default PathHelper;
