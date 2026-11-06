import * as THREE from "three";
import type { MovementPlaneType } from "../GrabDollProject.types";
import { PLANE_SIZE } from "../GrabDollProject.constants";

class MovementPlane implements MovementPlaneType {
  private camera: THREE.Camera;
  model!: THREE.Object3D;

  constructor({ camera }: { camera: THREE.Camera }) {
    this.camera = camera;
    this.setupModel();
  }

  private setupModel() {
    const geometry = new THREE.PlaneGeometry(
      PLANE_SIZE.width,
      PLANE_SIZE.height,
    );
    const material = new THREE.MeshBasicMaterial();
    this.model = new THREE.Mesh(geometry, material);
    this.model.visible = false;
  }

  locateAt(position: THREE.Vector3) {
    this.model.position.copy(position);
    this.model.quaternion.copy(this.camera.quaternion);
  }
}

export default MovementPlane;
