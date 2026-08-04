import * as THREE from "three";
import BaseProject from "./base.project.ts";
import { ProjectConfigure } from "@/decorators/project.ts";

@ProjectConfigure({ loop: true })
class GeometriesProject extends BaseProject {
  setupModel() {
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshPhongMaterial({ color: "blue" });
    this.mesh = new THREE.Mesh(geometry, material);
    this.scene?.add(this.mesh);
  }
}

export default GeometriesProject;
