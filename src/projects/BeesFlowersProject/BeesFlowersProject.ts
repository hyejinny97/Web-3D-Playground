import * as THREE from "three";
import * as YUKA from "yuka";
import type { ConstructorProps } from "@/types/project";
import BaseProject from "../BaseProject";
import { RenderLoop } from "@/decorators/renderLoop";
import type { LoadManagerType } from "./BeesFlowersProject.types";
import Ground from "./helpers/Ground";
import { GROUND_SIZE } from "./BeesFlowersProject.constants";
import TallGrass from "./helpers/grass/TallGrass";
import WideGrass from "./helpers/grass/WideGrass";
import Lavender from "./helpers/flower/Lavender";
import Carnation from "./helpers/flower/Carnation";
import Rose from "./helpers/flower/Rose";
import Hydrangea from "./helpers/flower/Hydrangea";

type BeesFlowersProjectProps = ConstructorProps & {
  loadManager: LoadManagerType;
};

@RenderLoop()
class BeesFlowersProject extends BaseProject {
  private loadManager: LoadManagerType;
  private stopRender = false;
  private entityManager = new YUKA.EntityManager();
  private time = new YUKA.Time();

  constructor({ canvasEl, loadManager }: BeesFlowersProjectProps) {
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

  setupCamera() {
    super.setupCamera();
    if (this.camera) {
      this.camera.position.set(0, GROUND_SIZE / 2 + 0.5, GROUND_SIZE / 2 + 0.5);
    }
  }

  async setupModel() {
    const loadingManager = this.generateLoadingManager();
    const ground = new Ground({ loadingManager });
    const tallGrass = new TallGrass({ loadingManager });
    const wideGrass = new WideGrass({ loadingManager });
    const lavender = new Lavender({ loadingManager });
    const carnation = new Carnation({ loadingManager });
    const rose = new Rose({ loadingManager });
    const hydrangea = new Hydrangea({ loadingManager });

    await Promise.allSettled([
      ground.init(),
      tallGrass.init(),
      wideGrass.init(),
      lavender.init(),
      carnation.init(),
      rose.init(),
      hydrangea.init(),
    ]);
    if (this.stopRender) return;

    const models = [
      ground.model!,
      ...tallGrass.models,
      ...wideGrass.models,
      ...lavender.models,
      ...carnation.models,
      ...rose.models,
      ...hydrangea.models,
    ];
    const entities = [
      ...lavender.entities,
      ...carnation.entities,
      ...rose.entities,
      ...hydrangea.entities,
    ];

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
    this.entityManager.update(delta);
  }

  dispose() {
    super.dispose();
    this.stopRender = true;
  }
}

export default BeesFlowersProject;
