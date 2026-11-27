import * as THREE from "three";
import * as YUKA from "yuka";
import type { PersonType } from "../WalkingStonePathProject.types";
import AnimationHelper from "@/helpers/AnimationHelper";
import { GLTFLoader, type GLTF } from "three/examples/jsm/Addons.js";
import {
  ANIMATION_NAME,
  ARRIVE_TOLERANCE,
  GROUND_SIZE,
  MOVE_THRESHOLD,
} from "../WalkingStonePathProject.constants";

class Person implements PersonType {
  private loadingManager: THREE.LoadingManager;
  private gltf: GLTF | null = null;
  private animation: AnimationHelper | null = null;
  private target: YUKA.Vector3 | null = null;
  model: THREE.Object3D | null = null;
  entity: YUKA.Vehicle | null = null;

  constructor({ loadingManager }: { loadingManager: THREE.LoadingManager }) {
    this.loadingManager = loadingManager;
  }

  async init() {
    await this.loadGLTF();
    this.setupModel();
    this.setupEntity();
    this.transformEntity();
    this.connectEntityToModel(this.entity!, this.model!);
    this.setupAnimation();
  }

  private async loadGLTF() {
    const loader = new GLTFLoader(this.loadingManager);
    this.gltf = await loader.loadAsync("/models/woman_with_headphone.gltf");
  }

  private setupModel() {
    if (!this.gltf) return;

    this.model = new THREE.Group();
    this.model.add(this.gltf.scene);

    const SIZE = 0.01;
    this.gltf.scene.scale.set(SIZE, SIZE, SIZE);
    this.gltf.scene.updateMatrixWorld(true);

    const box = new THREE.Box3().setFromObject(this.gltf.scene);
    this.gltf.scene.position.y = -box.min.y;
  }

  private setupEntity() {
    this.entity = new YUKA.Vehicle();
    this.entity.maxSpeed = 30;
    this.entity.maxForce = 50;
    this.entity.mass = 0.5;
  }

  private connectEntityToModel(entity: YUKA.GameEntity, model: THREE.Object3D) {
    model.matrixAutoUpdate = false;
    entity.setRenderComponent(model, this.sync);
  }

  private sync(entity: YUKA.GameEntity, renderComponent: THREE.Object3D) {
    renderComponent.matrix.copy(entity.worldMatrix as unknown as THREE.Matrix4);
  }

  private transformEntity() {
    if (!this.entity) return;
    this.entity.rotation.fromEuler(0, Math.PI * 0.2, 0);
    this.entity.position.set(
      (-GROUND_SIZE.width / 2) * 0.9,
      0,
      (-GROUND_SIZE.height / 2) * 0.8,
    );
  }

  private setupAnimation() {
    if (!this.model) return;
    this.animation = new AnimationHelper({
      model: this.model,
      clips: this.gltf!.animations,
    });
    this.animation.play({
      name: ANIMATION_NAME.idle,
    });
  }

  setTarget(target: YUKA.Vector3) {
    if (!this.entity) return;
    this.target = target;
    const behavior = new YUKA.ArriveBehavior(target);
    behavior.tolerance = ARRIVE_TOLERANCE;
    behavior.active = false;
    this.entity.steering.add(behavior);
  }

  seek() {
    if (!this.entity || !this.target) return;
    this.entity.steering.behaviors[0].active = true;
  }

  private animate(time: number) {
    this.animation?.update(time);
    if (this.entity && this.animation) {
      const isMoving =
        this.entity.velocity.squaredLength() >= MOVE_THRESHOLD ** 2;

      let animationToPlay: string;
      if (isMoving) {
        animationToPlay = ANIMATION_NAME.walk;
      } else {
        animationToPlay = ANIMATION_NAME.idle;
      }

      if (animationToPlay !== this.animation.getPlayingAnimationName()) {
        this.animation.play({
          name: animationToPlay,
          duration: isMoving ? 1500 : undefined,
        });
      }
    }
  }

  update(time: number) {
    this.animate(time);
  }
}

export default Person;
