import * as THREE from "three";
import BaseProject from "../BaseProject";
import { RenderLoop } from "@/decorators/renderLoop";
import ShapeGeometryHelper from "./helpers/ShapeGeometryHelper";
import CameraZoomHelper from "@/helpers/CameraZoomHelper";

@RenderLoop()
class ShapeGeometryProject extends BaseProject {
  declare private root: THREE.Group;
  declare private meshMaterial: THREE.Material;
  declare private lineMaterial: THREE.Material;
  declare private geometryHelper: ShapeGeometryHelper;

  setupModel() {
    if (!this.controlUI) throw new Error("controlUI 값이 없습니다.");

    this.geometryHelper = new ShapeGeometryHelper(this.controlUI);
    this.root = new THREE.Group();
    this.scene?.add(this.root);

    this.createMaterials();
    this.createModel();
    this.centralizeRoot();
    this.zoomFit();
    this.addGeometryControlUI();
  }

  createMaterials() {
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
  }

  createModel() {
    const geometry = this.geometryHelper.createGeometry();
    const wireframeGeometry = new THREE.WireframeGeometry(geometry);

    const mesh = new THREE.Mesh(geometry, this.meshMaterial);
    const line = new THREE.LineSegments(wireframeGeometry, this.lineMaterial);

    const groupName = "ShapeModel";
    const group = new THREE.Group();
    group.name = groupName;
    group.add(mesh, line);

    const oldGroup = this.root.getObjectByName(groupName);
    if (oldGroup) {
      oldGroup.children.forEach((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.LineSegments) {
          obj.geometry.dispose();
        }
      });
      this.root.remove(oldGroup);
    }
    this.root.add(group);
  }

  centralizeRoot() {
    const rootBox = new THREE.Box3().setFromObject(this.root);
    const center = rootBox.getCenter(new THREE.Vector3());
    this.root.position.sub(center);
  }

  zoomFit() {
    if (!this.camera) return;

    const zoomHelper = new CameraZoomHelper(this.camera);
    zoomHelper.fit({
      obj: this.root,
    });
  }

  addGeometryControlUI() {
    this.geometryHelper.createControlUI((updateZoom) => {
      this.createModel();
      this.centralizeRoot();
      if (updateZoom) {
        this.zoomFit();
      }
    });
  }
}

export default ShapeGeometryProject;
