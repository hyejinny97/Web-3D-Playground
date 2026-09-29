import * as THREE from "three";
import type { PathHelperType } from "../FollowCurveProject.types";
import { PATH_POINTS } from "../FollowCurveProject.constants";

interface PathHelperProps {
  pathColor?: THREE.Color;
}

class PathHelper implements PathHelperType {
  private pathColor: THREE.Color;
  private _path!: THREE.Line;
  private isVisible: boolean = false;

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
    const curve = new THREE.CatmullRomCurve3(points);
    const curvePoints = curve.getPoints(50);

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
}

export default PathHelper;
