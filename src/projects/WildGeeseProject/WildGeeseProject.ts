import * as THREE from "three";
import * as YUKA from "yuka";
import type { ConstructorProps } from "@/types/project";
import BaseProject from "../BaseProject";
import { RenderLoop } from "@/decorators/renderLoop";
import type { LoadManagerType } from "./WildGeeseProject.types";
import WildGeese from "./helpers/WildGeese";
import { TARGET_RANGE_LIMIT } from "./WildGeeseProject.constants";
import Target from "./helpers/Target";
import { HDRLoader } from "three/examples/jsm/Addons.js";

type WildGeeseProjectProps = ConstructorProps & {
  loadManager: LoadManagerType;
};

@RenderLoop()
class WildGeeseProject extends BaseProject {
  private loadManager: LoadManagerType;
  private stopRender = false;
  private entityManager = new YUKA.EntityManager();
  private time = new YUKA.Time();
  private wildGeese!: WildGeese;
  private target!: Target;

  constructor({ canvasEl, loadManager }: WildGeeseProjectProps) {
    super({ canvasEl });
    this.loadManager = loadManager;
    this.setupModel();
  }

  init() {
    this.setupRenderer();
    this.setupCamera();
    this.setupScene();
    this.setupControls();
    this.setupResizeObserver();
  }

  setupCamera() {
    super.setupCamera();
    if (this.camera) {
      const fovRad = THREE.MathUtils.degToRad(this.camera.fov);
      const aspect = this.camera.aspect;

      const distForDepth = TARGET_RANGE_LIMIT.z / Math.tan(fovRad / 2);
      const distForWidth =
        TARGET_RANGE_LIMIT.x / (Math.tan(fovRad / 2) * aspect);
      const distance = Math.max(distForDepth, distForWidth);

      const y = 8;
      const z = Math.sqrt(Math.pow(distance * 1.15, 2) - Math.pow(y, 2));
      this.camera.position.set(0, y, z);
    }
  }

  async setupModel() {
    const loadingManager = this.generateLoadingManager();
    const hdrLoader = new HDRLoader(loadingManager);

    this.wildGeese = new WildGeese({ loadingManager, count: 5 });
    this.target = new Target();

    const [skyTexture] = await Promise.all([
      hdrLoader.loadAsync("/textures/pure_sky.hdr"),
      this.wildGeese.init(),
    ]);
    if (this.stopRender) return;

    if (this.renderer && this.scene) {
      skyTexture.mapping = THREE.EquirectangularReflectionMapping;
      this.scene.background = skyTexture;
      this.scene.environment = skyTexture;
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.0;
    }

    const models = [...this.wildGeese.models, this.target.model];
    const entities = [...this.wildGeese.entities];

    models.forEach((model) => this.scene?.add(model));
    entities.forEach((entity) => this.entityManager.add(entity));

    this.wildGeese.seek(this.target.position);
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
    this.wildGeese.update(elapsedTime * 1000);
    this.target.update(elapsedTime);
  }

  dispose() {
    super.dispose();
    this.entityManager.clear();
    this.time.dispose();
    this.stopRender = true;
  }
}

export default WildGeeseProject;
