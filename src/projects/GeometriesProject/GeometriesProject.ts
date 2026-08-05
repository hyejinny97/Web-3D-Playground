import * as THREE from "three";
import { RenderLoop } from "@/decorators/renderLoop.ts";
import BaseProject from "@/projects/BaseProject";
import BoxGeometryHelper from "./BoxGeometryHelper";
import type { GeometryHelper } from "./GeometriesProject.type";

@RenderLoop()
class GeometriesProject extends BaseProject {
  declare private meshMaterial: THREE.Material;
  declare private lineMaterial: THREE.Material;

  setupModel() {
    this.meshMaterial = new THREE.MeshPhongMaterial({
      color: "blue",
      flatShading: true,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.75,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
    });
    this.lineMaterial = new THREE.LineBasicMaterial({
      color: "white",
      transparent: true,
      opacity: 0.8,
    });

    const boxGeometryHelper = new BoxGeometryHelper();
    this.createMesh(boxGeometryHelper);
    boxGeometryHelper.createControlUI(this.controlUI, () =>
      this.createMesh(boxGeometryHelper),
    );
  }

  createMesh(geometryHelper: GeometryHelper) {
    const geometry = geometryHelper.createGeometry();
    const wireframeGeometry = new THREE.WireframeGeometry(geometry);

    const mesh = new THREE.Mesh(geometry, this.meshMaterial);
    const line = new THREE.LineSegments(wireframeGeometry, this.lineMaterial);

    const group = new THREE.Group();
    group.name = geometryHelper.name;
    group.add(mesh, line);

    const axesHelper = new THREE.AxesHelper(1);
    group.add(axesHelper);

    const oldGroup = this.scene?.getObjectByName(group.name);
    if (oldGroup) {
      oldGroup.children.forEach((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.LineSegments) {
          obj.geometry.dispose();
        }
      });
      this.scene?.remove(oldGroup);
    }
    this.scene?.add(group);
  }
}

export default GeometriesProject;
