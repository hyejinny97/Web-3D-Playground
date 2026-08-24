import * as THREE from "three";
import BaseProject from "../BaseProject";
import { RenderLoop } from "@/decorators/renderLoop";
import type { GeometryDictionaryType } from "./EdgesGeometryProject.types";
import GeometryDictionary from "./GeometryDictionary";
import GridAlignHelper from "@/helpers/GridAlignHelper";
import CameraZoomHelper from "@/helpers/CameraZoomHelper";
import type { ConstructorProps } from "@/types/project";

type edgesGeometryProjectProps = ConstructorProps & {
  onModelSelect: () => void;
};

@RenderLoop()
class EdgesGeometryProject extends BaseProject {
  declare private root: THREE.Group;
  declare private lineMaterial: THREE.Material;
  declare private geometryDictionary: GeometryDictionaryType;
  declare private selectedGeometry?: keyof GeometryDictionaryType["values"];
  declare private handleCanvasClick: (event: MouseEvent) => void;
  declare private onModelSelect: edgesGeometryProjectProps["onModelSelect"];

  constructor({
    canvasEl,
    controlUI,
    onModelSelect,
  }: edgesGeometryProjectProps) {
    super({ canvasEl, controlUI });
    this.onModelSelect = onModelSelect;
  }

  init() {
    super.init();
    this.setupEvent();
  }

  setupModel() {
    if (!this.controlUI) throw new Error("controlUI가 존재하지 않습니다.");

    this.geometryDictionary = new GeometryDictionary(this.controlUI);
    this.root = new THREE.Group();
    this.scene?.add(this.root);

    this.createMaterials();
    this.createAllModels();
    this.arrangeInGrid();
    this.zoomFit({ obj: this.root });
  }

  createMaterials() {
    this.lineMaterial = new THREE.LineBasicMaterial({
      color: "white",
      transparent: true,
      opacity: 0.8,
    });
  }

  createModel(name: keyof GeometryDictionaryType["values"]) {
    const { helper, position } = this.geometryDictionary.values[name];
    const wireframeGeometry = helper.createGeometry();
    const line = new THREE.LineSegments(wireframeGeometry, this.lineMaterial);
    line.name = name;

    const oldModel = this.root.getObjectByName(name);
    if (oldModel instanceof THREE.LineSegments) {
      oldModel.geometry.dispose();
      this.root.remove(oldModel);
    }
    this.root.add(line);

    this.geometryDictionary.values[name].model = line;
    if (position) line.position.copy(position);
  }

  createAllModels() {
    Object.keys(this.geometryDictionary.values).forEach((name) =>
      this.createModel(name as keyof GeometryDictionaryType["values"]),
    );
  }

  arrangeInGrid() {
    const geometryArr = Object.entries(this.geometryDictionary.values);
    const models = geometryArr
      .map(([, value]) => value.model)
      .filter((model) => model !== undefined);
    if (models.length === 0) return;

    const gridHelper = new GridAlignHelper({
      columnGap: 3,
      maxGridColumns: 2,
    });
    gridHelper.align(models);

    models.forEach((model, idx) => {
      const name = geometryArr[idx][0];
      this.geometryDictionary.setPosition(
        name as keyof GeometryDictionaryType["values"],
        model.position,
      );
    });
  }

  zoomFit({
    obj,
    animate,
    margin,
  }: {
    obj: THREE.Object3D;
    animate?: boolean;
    margin?: number;
  }) {
    if (!this.camera) return;

    const zoomHelper = new CameraZoomHelper(this.camera);
    zoomHelper.fit({
      obj,
      animate,
      margin,
      initLookAtTarget: this.controls?.target,
      onAnimationComplete: (lookAtTarget) => {
        if (this.controls) {
          this.controls.target.copy(lookAtTarget);
          this.controls.update();
        }
      },
    });
  }

  addGeometryControlUI(name: keyof GeometryDictionaryType["values"]) {
    this.geometryDictionary.values[name].helper.createControlUI(() =>
      this.createModel(name),
    );
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
          if (obj instanceof THREE.LineSegments) {
            if (this.geometryDictionary.isGeometryName(obj.name)) {
              this.selectedGeometry = obj.name;
              this.zoomFit({ obj, animate: true, margin: 1 });
              this.addGeometryControlUI(obj.name);
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
    this.zoomFit({ obj: this.root, animate: true });
    const geometryArr = Object.entries(this.geometryDictionary.values);
    geometryArr.forEach(([name, { helper }]) => {
      helper.reset(() =>
        this.createModel(name as keyof GeometryDictionaryType["values"]),
      );
    });
    this.selectedGeometry = undefined;
  }

  dispose() {
    super.dispose();
    this.canvasEl.removeEventListener("click", this.handleCanvasClick);
  }
}

export default EdgesGeometryProject;
