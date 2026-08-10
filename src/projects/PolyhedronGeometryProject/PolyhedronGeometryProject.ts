import * as THREE from "three";
import BaseProject from "../BaseProject";
import type { GeometryHelper } from "./PolyhedronGeometryProject.types";
import { RenderLoop } from "@/decorators/renderLoop";
import GeometryDictionary from "./GeometryDictionary";
import GridAlignHelper from "@/helpers/GridAlignHelper";
import CameraZoomHelper from "@/helpers/CameraZoomHelper";
import PolyhedronGeometryHelper from "./helpers/PolyhedronGeometryHelper";

@RenderLoop()
class PolyhedronGeometryProject extends BaseProject {
  declare private root: THREE.Group;
  declare private meshMaterial: THREE.Material;
  declare private lineMaterial: THREE.Material;
  declare private geometryDictionary: GeometryDictionary;

  setupModel() {
    if (!this.controlUI) throw new Error("controlUI 값이 없습니다.");

    this.geometryDictionary = new GeometryDictionary(this.controlUI);
    this.root = new THREE.Group();
    this.scene?.add(this.root);

    this.createMaterials();
    this.createAllModels();
    this.arrangeInGrid();
    this.zoomFit();
    this.addControlsUI();
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

  generateModel(name: string, geometryHelper: GeometryHelper): THREE.Group {
    const geometry = geometryHelper.createGeometry();
    const wireframeGeometry = new THREE.WireframeGeometry(geometry);

    const mesh = new THREE.Mesh(geometry, this.meshMaterial);
    const line = new THREE.LineSegments(wireframeGeometry, this.lineMaterial);

    const group = new THREE.Group();
    group.name = name;
    group.add(mesh, line);
    return group;
  }

  addModelToRoot(model: THREE.Group) {
    const oldModel = this.root.getObjectByName(model.name);
    if (oldModel) {
      oldModel.children.forEach((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.LineSegments) {
          obj.geometry.dispose();
        }
      });
      this.root.remove(oldModel);
    }
    this.root.add(model);
  }

  createAllModels() {
    Object.entries(this.geometryDictionary.value).forEach(
      ([name, { helper, model }]) => {
        if (model) return;
        const modelObj = this.generateModel(name, helper);
        this.addModelToRoot(modelObj);
        this.geometryDictionary.setModel(name, modelObj);
      },
    );
  }

  arrangeInGrid() {
    const geometryArr = Object.entries(this.geometryDictionary.value);
    const models = geometryArr
      .map(([, value]) => value.model)
      .filter((model) => model !== undefined);
    if (models.length === 0) return;

    const gridHelper = new GridAlignHelper({
      columnGap: 3.5,
      maxGridColumns: 4,
    });
    gridHelper.align(models);

    models.forEach((model, idx) => {
      const name = geometryArr[idx][0];
      this.geometryDictionary.value[name].position = model.position;
    });
  }

  zoomFit() {
    if (!this.camera) return;

    const zoomHelper = new CameraZoomHelper(this.camera);
    zoomHelper.fit({
      obj: this.root,
    });
  }

  updateModel(name: string) {
    const { helper, position } = this.geometryDictionary.value[name];
    const modelObj = this.generateModel(name, helper);
    this.addModelToRoot(modelObj);
    this.geometryDictionary.setModel(name, modelObj);
    if (position) modelObj.position.copy(position);
  }

  createAllGeometryControlUI() {
    const geometryArr = Object.entries(this.geometryDictionary.value);
    const polyHelper = new PolyhedronGeometryHelper(
      this.controlUI!,
      "All PolyhedronGeometry",
    );
    polyHelper.createControlUI((props) => {
      if (!props) return;
      const { radius, detail } = props;
      geometryArr.forEach(([name, { helper }]) => {
        helper.args = { radius, detail };
        this.updateModel(name);
      });
    });
  }

  addControlsUI() {
    const geometryArr = Object.entries(this.geometryDictionary.value);
    geometryArr.forEach(([name, { helper }]) => {
      helper.createControlUI(() => this.updateModel(name));
    });
  }
}

export default PolyhedronGeometryProject;
