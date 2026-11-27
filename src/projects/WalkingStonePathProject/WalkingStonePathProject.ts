import * as THREE from "three";
import * as YUKA from "yuka";
import type { ConstructorProps } from "@/types/project";
import BaseProject from "../BaseProject";
import { RenderLoop } from "@/decorators/renderLoop";
import type { LoadManagerType } from "./WalkingStonePathProject.types";
import CameraZoomHelper from "@/helpers/CameraZoomHelper";
import { GROUND_SIZE } from "./WalkingStonePathProject.constants";
import Ground from "./helpers/Ground";
import Stone from "./helpers/Stone";
import Person from "./helpers/Person";

type WalkingStonePathProjectProps = ConstructorProps & {
  loadManager: LoadManagerType;
};

@RenderLoop()
class WalkingStonePathProject extends BaseProject {
  private loadManager: LoadManagerType;
  private stopRender = false;
  private entityManager = new YUKA.EntityManager();
  private time = new YUKA.Time();
  private person!: Person;

  constructor({ canvasEl, loadManager }: WalkingStonePathProjectProps) {
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

  setupLight() {
    const ambientLight = new THREE.AmbientLight("white", 0.3);
    const directionalLight1 = new THREE.DirectionalLight("white", 0.5);
    const directionalLight2 = new THREE.DirectionalLight("white", 0.5);
    directionalLight1.position.set(2, 2, 2);
    directionalLight2.position.set(-2, 2, 2);
    this.scene?.add(ambientLight);
    this.scene?.add(directionalLight1);
    this.scene?.add(directionalLight2);
  }

  setupCamera() {
    super.setupCamera();
    if (this.camera) {
      const zoomHelper = new CameraZoomHelper(this.camera);
      zoomHelper.fitAreaWithOffsetY({
        area: { width: GROUND_SIZE.width, depth: GROUND_SIZE.height },
        offsetY: 3,
        distanceFactor: 1.25,
      });
    }
  }

  async setupModel() {
    const loadingManager = this.generateLoadingManager();
    const ground = new Ground({ loadingManager });
    const stone = new Stone({ loadingManager, count: 10 });
    this.person = new Person({ loadingManager });

    await Promise.allSettled([ground.init(), stone.init(), this.person.init()]);
    if (this.stopRender) return;

    const models = [ground.model!, ...stone.models, this.person.model!];
    const entities = [...stone.entities, this.person.entity!];

    entities.forEach((entity) => this.entityManager.add(entity));
    models.forEach((model) => this.scene?.add(model));
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
    this.person.update(elapsedTime * 1000);
  }

  dispose() {
    super.dispose();
    this.stopRender = true;
    this.entityManager.clear();
    this.time.dispose();
  }
}

export default WalkingStonePathProject;
