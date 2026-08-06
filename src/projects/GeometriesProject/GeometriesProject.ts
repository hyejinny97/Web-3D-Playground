import * as THREE from "three";
import { RenderLoop } from "@/decorators/renderLoop.ts";
import BaseProject from "@/projects/BaseProject";
import type {
  GeometryDictionaryType,
  GeometryHelper,
} from "./GeometriesProject.types";
import { geometryDictionary } from "./GeometriesProject.constants";

@RenderLoop()
class GeometriesProject extends BaseProject {
  declare private root: THREE.Group;
  declare private meshMaterial: THREE.Material;
  declare private lineMaterial: THREE.Material;
  declare private geometryDictionary: GeometryDictionaryType;
  declare private selectedGeometry: keyof typeof geometryDictionary;

  init() {
    super.init();
    this.setupEvent();
  }

  setupModel() {
    this.geometryDictionary = geometryDictionary;
    this.root = new THREE.Group();
    this.scene?.add(this.root);

    this.createMaterials();
    this.createAllModels();
    this.arrangeInGrid();
    this.zoomFit(this.root);
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

  createAllModels() {
    Object.entries(this.geometryDictionary).forEach(
      ([name, { helper, model }]) => {
        if (model) return;
        const modelObj = this.createModel(name, helper);
        this.addModelToRoot(modelObj);
        this.geometryDictionary[name].model = modelObj;
      },
    );
  }

  createModel(name: string, geometryHelper: GeometryHelper): THREE.Group {
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

  showControlUI() {
    const { helper } = this.geometryDictionary[this.selectedGeometry];
    helper.createControlUI(this.controlUI, () => {
      const model = this.createModel(this.selectedGeometry, helper);
      this.addModelToRoot(model);
      this.geometryDictionary[this.selectedGeometry].model = model;
    });
  }

  arrangeInGrid() {
    const models = Object.values(this.geometryDictionary)
      .map((val) => val.model)
      .filter((model) => model !== undefined);
    if (models.length === 0) return;

    const ROW_GAP = 2;
    const COLUMN_GAP = 2;
    const MAX_GRID_COLUMNS = 5;
    const geometriesCount = Object.keys(this.geometryDictionary).length;
    const gridColumns = Math.min(geometriesCount, MAX_GRID_COLUMNS);
    const gridRows = Math.ceil(geometriesCount / gridColumns);

    const rowMiddle = (gridRows + 1) / 2;
    const columnMiddle = (gridColumns + 1) / 2;
    for (let row = 1; row <= gridRows; row++) {
      for (let column = 1; column <= gridColumns; column++) {
        const idx = gridColumns * (row - 1) + (column - 1);
        if (idx > models.length - 1) break;

        const model = models[idx];
        model.position.set(
          (column - columnMiddle) * COLUMN_GAP,
          (rowMiddle - row) * ROW_GAP,
          0,
        );
      }
    }
  }

  zoomFit(obj: THREE.Object3D) {
    if (!this.camera) return;

    const box = new THREE.Box3().setFromObject(obj);
    const sizeBox = box.getSize(new THREE.Vector3()).length();
    const centerBox = box.getCenter(new THREE.Vector3());

    const halfSizeModel = sizeBox * 0.5;
    const halfFov = THREE.MathUtils.degToRad(this.camera.fov * 0.5);
    const distance = halfSizeModel / Math.tan(halfFov);

    const direction = new THREE.Vector3()
      .subVectors(this.camera.position, centerBox)
      .normalize();
    const position = direction.multiplyScalar(distance).add(centerBox);

    this.camera.position.copy(position);
    this.camera.near = sizeBox / 10;
    this.camera.far = sizeBox * 10;
    this.camera.updateProjectionMatrix();
    this.camera.lookAt(centerBox.x, centerBox.y, centerBox.z);
  }

  displayBoxHelper(obj: THREE.Object3D) {
    const boxHelper = new THREE.BoxHelper(this.root, "yellow");
    obj.add(boxHelper);
  }

  displayAxisHelper(obj: THREE.Object3D) {
    const axesHelper = new THREE.AxesHelper(1);
    obj.add(axesHelper);
  }

  // TODO: click 이벤트 감지 -> model을 클릭한 경우, this.selectedGeometry에 등록 + showControlUI() 함수 호출
  setupEvent() {}
}

export default GeometriesProject;
