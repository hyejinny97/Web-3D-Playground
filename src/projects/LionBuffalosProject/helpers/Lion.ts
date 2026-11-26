import * as THREE from "three";
import * as YUKA from "yuka";
import type { LionType } from "../LionBuffalosProject.types";
import { GLTFLoader, type GLTF } from "three/examples/jsm/Addons.js";
import AnimationHelper from "@/helpers/AnimationHelper";
import { ANIMATION_NAME } from "../LionBuffalosProject.constants";

class Lion implements LionType {
  private loadingManager: THREE.LoadingManager;
  private gltf: GLTF | null = null;
  private animation: AnimationHelper | null = null;
  model: THREE.Object3D | null = null;
  entity: YUKA.Vehicle | null = null;

  constructor({ loadingManager }: { loadingManager: THREE.LoadingManager }) {
    this.loadingManager = loadingManager;
  }

  async init() {
    await this.loadGLTF();
    this.setupModel();
    this.setupAnimation();
  }

  private async loadGLTF() {
    const loader = new GLTFLoader(this.loadingManager);
    this.gltf = await loader.loadAsync("/models/lion/scene.gltf");
  }

  private setupModel() {
    if (!this.gltf) return;

    this.model = new THREE.Group();
    this.model.add(this.gltf.scene);

    const SIZE = 0.3;
    this.gltf.scene.scale.set(SIZE, SIZE, SIZE);
    this.gltf.scene.updateMatrixWorld(true);

    const bounds = new THREE.Box3().setFromObject(this.gltf.scene);
    const center = bounds.getCenter(new THREE.Vector3());
    this.gltf.scene.position.set(-center.x, -bounds.min.y, -center.z);
  }

  private setupAnimation() {
    if (!this.model) return;
    this.animation = new AnimationHelper({
      model: this.model,
      clips: this.gltf!.animations,
    });
    this.animation.play({
      name: ANIMATION_NAME.lion.idle,
    });
  }

  update(time: number) {
    this.animation?.update(time);
  }
}

export default Lion;
