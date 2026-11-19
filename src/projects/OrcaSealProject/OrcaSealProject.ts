import * as THREE from "three";
import * as YUKA from "yuka";
import type { ConstructorProps } from "@/types/project";
import BaseProject from "../BaseProject";
import { RenderLoop } from "@/decorators/renderLoop";
import type { LoadManagerType } from "./OrcaSealProject.types";
import Seal from "./helpers/Seal";
import SealTarget from "./helpers/SealTarget";
import { TARGET_RANGE_LIMIT } from "./OrcaSealProject.constants";

type OrcaSealProjectProps = ConstructorProps & {
  loadManager: LoadManagerType;
};

@RenderLoop()
class OrcaSealProject extends BaseProject {
  private loadManager: LoadManagerType;
  private stopRender = false;
  private entityManager = new YUKA.EntityManager();
  private time = new YUKA.Time();
  private seal!: Seal;
  private sealTarget!: SealTarget;

  constructor({ canvasEl, loadManager }: OrcaSealProjectProps) {
    super({ canvasEl });
    this.loadManager = loadManager;
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

  setupScene() {
    super.setupScene();
    if (this.scene) {
      this.scene.background = new THREE.Color("#5da5cf");
    }
  }

  setupLight() {
    const ambientLight = new THREE.AmbientLight("white", 0.5);
    const directionalLight1 = new THREE.DirectionalLight("white", 1);
    const directionalLight2 = new THREE.DirectionalLight("white", 1);
    directionalLight1.position.set(2, 2, 2);
    directionalLight2.position.set(-2, 2, 2);
    this.scene?.add(ambientLight);
    this.scene?.add(directionalLight1);
    this.scene?.add(directionalLight2);
  }

  setupCamera() {
    super.setupCamera();
    if (this.camera) {
      this.camera.position.set(
        0,
        TARGET_RANGE_LIMIT.y + 1,
        TARGET_RANGE_LIMIT.z + 1,
      );
    }
  }

  async setupModel() {
    const loadingManager = this.generateLoadingManager();
    this.seal = new Seal({ loadingManager });
    this.sealTarget = new SealTarget();

    await Promise.allSettled([this.seal.init()]);
    if (this.stopRender) return;

    const models = [this.seal.model!, this.sealTarget.model];
    const entities = [this.seal.entity!];

    models.forEach((model) => this.scene?.add(model));
    entities.forEach((entity) => this.entityManager.add(entity));
  }

  generateLoadingManager(): THREE.LoadingManager {
    const { onStart, onProgress, onLoad } = this.loadManager;
    const manager = new THREE.LoadingManager(
      onLoad,
      (_: string, loaded: number, total: number) =>
        onProgress((loaded / total) * 100),
    );
    manager.onStart = onStart;
    return manager;
  }

  update() {
    const delta = this.time.update().getDelta();
    const elapsedTime = this.time.getElapsed(); // 단위: s

    this.entityManager.update(delta);
    this.seal.update(elapsedTime * 1000);
    this.sealTarget.update(elapsedTime);
  }

  dispose() {
    super.dispose();
    this.entityManager.clear();
    this.time.dispose();
    this.stopRender = true;
  }
}

export default OrcaSealProject;
