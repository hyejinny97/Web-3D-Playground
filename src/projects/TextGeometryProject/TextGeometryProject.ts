import * as THREE from "three";
import { RenderLoop } from "@/decorators/renderLoop.ts";
import BaseProject from "@/projects/BaseProject";
import { FontLoader } from "three/examples/jsm/Addons.js";
import { FONT_URLS } from "./TextGeometryProject.constants";
import type { ConstructorProps } from "@/types/project";
import type { FontsType } from "./TextGeometryProject.types";
import TextGeometryHelper from "./helpers/TextGeometryHelper";
import CameraZoomHelper from "@/helpers/CameraZoomHelper";

type TextGeometryProjectProps = ConstructorProps & {
  loadStart: () => void;
  loading: (percent: number) => void;
  loadComplete: () => void;
};

@RenderLoop()
class TextGeometryProject extends BaseProject {
  private loadStart: TextGeometryProjectProps["loadStart"];
  private loading: TextGeometryProjectProps["loading"];
  private loadComplete: TextGeometryProjectProps["loadComplete"];
  declare private meshMaterial: THREE.Material;
  declare private lineMaterial: THREE.Material;
  declare private textGeometryHelper: TextGeometryHelper;
  private modelName = "Text Model";
  private cancel = false;

  constructor({
    canvasEl,
    controlUI,
    loadStart,
    loading,
    loadComplete,
  }: TextGeometryProjectProps) {
    super({ canvasEl, controlUI });
    this.loadStart = loadStart;
    this.loading = loading;
    this.loadComplete = loadComplete;
    this.setupModel();
  }

  init() {
    this.setupRenderer();
    this.setupCamera();
    this.setupScene();
    this.setupLight();
    this.setupControls();
    this.setupResizeObserver();
  }

  async setupModel() {
    if (!this.controlUI) throw new Error("controlUI 값이 없습니다.");

    const fonts = await this.loadFonts({
      onStart: () => {
        this.loadStart();
      },
      onProgress: (_, loaded, total) => {
        this.loading((loaded / total) * 100);
      },
      onLoad: () => {
        this.loadComplete();
      },
    });

    if (this.cancel) return;
    this.textGeometryHelper = new TextGeometryHelper(
      this.controlUI,
      fonts,
      Object.keys(fonts)[0],
      "Hello, World!",
    );

    this.createMaterials();
    this.createTextModel();
    this.zoomFit({ obj: this.scene! });
    this.addControlUI();
  }

  async loadFonts({
    onStart,
    onLoad,
    onProgress,
    onError,
  }: {
    onStart?: THREE.LoadingManager["onStart"];
    onLoad?: THREE.LoadingManager["onLoad"];
    onProgress?: THREE.LoadingManager["onProgress"];
    onError?: THREE.LoadingManager["onError"];
  }) {
    const manager = new THREE.LoadingManager(onLoad, onProgress, onError);
    manager.onStart = onStart;
    const loader = new FontLoader(manager);
    const results = await Promise.allSettled(
      Object.entries(FONT_URLS).map(async ([name, url]) => {
        const font = await loader.loadAsync(url);
        return { name, font };
      }),
    );
    return results
      .filter((result) => result.status === "fulfilled")
      .reduce<FontsType>(
        (acc, result) => ({ ...acc, [result.value.name]: result.value.font }),
        {},
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

  createTextModel() {
    if (!this.scene) throw new Error("scene 값이 없습니다.");

    const geometry = this.textGeometryHelper.createGeometry();
    const wireframeGeometry = new THREE.WireframeGeometry(geometry);

    const mesh = new THREE.Mesh(geometry, this.meshMaterial);
    const line = new THREE.LineSegments(wireframeGeometry, this.lineMaterial);

    const group = new THREE.Group();
    group.name = this.modelName;
    group.add(mesh, line);

    const oldGroup = this.scene.getObjectByName(this.modelName);
    if (oldGroup) {
      oldGroup.children.forEach((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.LineSegments) {
          obj.geometry.dispose();
        }
      });
      this.scene.remove(oldGroup);
    }
    this.scene.add(group);
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
      duration: "0.3",
      ease: "power1.in",
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

  addControlUI() {
    this.textGeometryHelper.createControlUI((updateZoom) => {
      this.createTextModel();
      if (updateZoom) {
        this.zoomFit({ obj: this.scene! });
      }
    });
  }

  dispose() {
    super.dispose();
    this.cancel = true;
  }
}

export default TextGeometryProject;
