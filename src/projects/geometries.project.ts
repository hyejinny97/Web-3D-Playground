import * as THREE from "three";
import BaseProject from "./base.project.ts";

class GeometriesProject extends BaseProject {
  setupModel() {
    const geo = new THREE.CircleGeometry();
    const mat = new THREE.MeshPhongMaterial({ color: "blue" });
    this.mesh = new THREE.Mesh(geo, mat);
    this.scene?.add(this.mesh);
  }
}

export default GeometriesProject;
