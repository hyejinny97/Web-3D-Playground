import * as THREE from "three";

class CannonBall {
  root!: THREE.Object3D;

  constructor() {
    this.setupModel();
  }

  setupModel() {
    const geometry = new THREE.SphereGeometry(0.07);
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#333"),
      metalness: 0.5,
      roughness: 0.5,
    });
    this.root = new THREE.Mesh(geometry, material);
  }
}

export default CannonBall;
