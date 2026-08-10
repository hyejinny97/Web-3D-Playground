import * as THREE from "three";
import { RenderLoop } from "@/decorators/renderLoop.ts";
import BaseProject from "@/projects/BaseProject";
import type {
  GeometryDictionaryType,
  GeometryHelper,
} from "./GeometriesProject.types";
import { geometryDictionary } from "./GeometriesProject.constants";
import { isGeometryName } from "./GeometriesProject.utils";
import type { ConstructorProps } from "@/types/project";
import GridAlignHelper from "@/helpers/GridAlignHelper";
import CameraZoomHelper from "@/helpers/CameraZoomHelper";

type GeometriesProjectProps = ConstructorProps & { onModelSelect: () => void };

@RenderLoop()
class GeometriesProject extends BaseProject {
  declare private root: THREE.Group;
  declare private meshMaterial: THREE.Material;
  declare private lineMaterial: THREE.Material;
  declare private geometryDictionary: GeometryDictionaryType;
  declare private selectedGeometry?: keyof typeof geometryDictionary;
  declare private handleCanvasClick: (event: MouseEvent) => void;
  declare private onModelSelect: GeometriesProjectProps["onModelSelect"];

  constructor({ canvasEl, controlUI, onModelSelect }: GeometriesProjectProps) {
    super({ canvasEl, controlUI });
    this.onModelSelect = onModelSelect;
  }

  init() {
    super.init();
    this.setupEvent();
  }

  setupModel() {
    this.geometryDictionary = this.getGeometryDictionary();
    this.root = new THREE.Group();
    this.scene?.add(this.root);

    this.createMaterials();
    this.createAllModels();
    this.arrangeInGrid();
    this.zoomFit(this.root);
  }

  getGeometryDictionary(): GeometryDictionaryType {
    return Object.fromEntries(
      Object.entries(geometryDictionary).map(([name, entry]) => [
        name,
        { helper: entry.helper, model: undefined, position: undefined },
      ]),
    );
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

  updateModel(name: keyof typeof geometryDictionary) {
    const { helper } = this.geometryDictionary[name];
    const model = this.createModel(name, helper);
    this.addModelToRoot(model);
    model.position.copy(this.geometryDictionary[name].position!);
    this.geometryDictionary[name].model = model;
  }

  addGeometryToControlUI(name: keyof typeof geometryDictionary) {
    if (!this.controlUI) return;
    const { helper } = this.geometryDictionary[name];
    helper.createControlUI(this.controlUI, () => {
      this.updateModel(name);
    });
  }

  arrangeInGrid() {
    const geometryArr = Object.entries(this.geometryDictionary);
    const models = geometryArr
      .map(([, value]) => value.model)
      .filter((model) => model !== undefined);
    if (models.length === 0) return;

    const gridHelper = new GridAlignHelper({
      rowGap: 5,
      columnGap: 5,
      maxGridColumns: 3,
    });
    gridHelper.align(models);

    models.forEach((model, idx) => {
      const name = geometryArr[idx][0];
      this.geometryDictionary[name].position = model.position;
    });
  }

  zoomFit(obj: THREE.Object3D, animate: boolean = false, margin: number = 0) {
    if (!this.camera) return;

    const zoomHelper = new CameraZoomHelper(this.camera);
    zoomHelper.fit({
      obj,
      margin,
      animate,
      duration: 1,
      ease: "power2.in",
      initLookAtTarget: this.controls?.target,
      onAnimationComplete: (lookAtTarget) => {
        if (this.controls) {
          this.controls.target.copy(lookAtTarget);
          this.controls.update();
        }
      },
    });
  }

  displayBoxHelper(obj: THREE.Object3D) {
    const boxHelper = new THREE.BoxHelper(this.root, "yellow");
    obj.add(boxHelper);
  }

  displayAxisHelper(obj: THREE.Object3D) {
    const axesHelper = new THREE.AxesHelper(1);
    obj.add(axesHelper);
  }

  setupEvent() {
    const raycaster = new THREE.Raycaster();
    this.handleCanvasClick = (event: MouseEvent) => {
      if (this.selectedGeometry) return;

      const x = (event.clientX / this.canvasEl.clientWidth) * 2 - 1;
      const y = -(event.clientY / this.canvasEl.clientHeight) * 2 + 1;
      const clickedPosition = new THREE.Vector2(x, y);

      raycaster.setFromCamera(clickedPosition, this.camera!);
      const intersects = raycaster.intersectObjects(this.root.children);

      if (intersects.length > 0) {
        for (const intersect of intersects) {
          const obj = intersect.object;
          if (obj instanceof THREE.Mesh && obj.parent instanceof THREE.Group) {
            const group = obj.parent;
            if (isGeometryName(group.name)) {
              this.selectedGeometry = group.name;
              this.zoomFit(group, true, 1);
              this.addGeometryToControlUI(group.name);
              this.onModelSelect();
              break;
            }
          }
        }
      }
    };
    this.canvasEl.addEventListener("click", this.handleCanvasClick);
  }

  reset() {
    this.zoomFit(this.root, true);
    if (this.selectedGeometry && this.controlUI) {
      const { helper } = this.geometryDictionary[this.selectedGeometry];
      helper.reset(this.controlUI, () => {
        this.updateModel(this.selectedGeometry!);
      });
      this.selectedGeometry = undefined;
    }
  }

  dispose() {
    super.dispose();
    this.canvasEl.removeEventListener("click", this.handleCanvasClick);
  }
}

export default GeometriesProject;
