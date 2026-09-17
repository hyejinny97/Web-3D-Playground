import * as THREE from "three";
import type { AstronicObjectType } from "../SolarSystemProject.types";

abstract class AstronicObject implements AstronicObjectType {
  abstract name: string;
  abstract root: THREE.Object3D;
  abstract mesh: THREE.Mesh;
  abstract parent: THREE.Object3D;
  abstract distance: number;
  rootYTilt: number = 0;
  rootRotation: number = 0;
  meshRotation: number = 0;
  then: number = 0;

  private rotateAround(delta: number) {
    this.root.rotation.x = THREE.MathUtils.degToRad(this.rootYTilt % 360);
    this.root.rotation.y += THREE.MathUtils.radToDeg(this.rootRotation * delta);
  }

  private rotateSelf(delta: number) {
    this.mesh.rotateY(this.meshRotation * delta);
  }

  locateRootToParent() {
    const parentPosition = new THREE.Vector3();
    this.parent.updateMatrixWorld();
    this.parent.getWorldPosition(parentPosition);
    this.root.position.set(
      parentPosition.x,
      parentPosition.y,
      parentPosition.z,
    );
  }

  update(time: number) {
    time *= 0.001;
    const delta = time - this.then;
    this.then = time;
    this.rotateAround(delta);
    this.rotateSelf(delta);
  }
}

export default AstronicObject;
