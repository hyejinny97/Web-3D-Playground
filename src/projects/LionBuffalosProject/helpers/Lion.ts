import * as THREE from "three";
import * as YUKA from "yuka";
import type { LionType } from "../LionBuffalosProject.types";
import { GLTFLoader, type GLTF } from "three/examples/jsm/Addons.js";
import AnimationHelper from "@/helpers/AnimationHelper";
import {
  ANIMATION_NAME,
  ARRIVE_TOLERANCE,
  GROUND_SIZE,
  MAX_TURN_RATE,
  MOVE_THRESHOLD,
} from "../LionBuffalosProject.constants";

class Lion implements LionType {
  private loadingManager: THREE.LoadingManager;
  private gltf: GLTF | null = null;
  private animation: AnimationHelper | null = null;
  private target: YUKA.Vector3 | null = null;
  private isSeeking = false;
  private onArrive: (() => void) | null = null;
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
    this.gltf = await loader.loadAsync("/models/lion/scene.gltf");
  }

  private setupModel() {
    if (!this.gltf) return;

    this.model = new THREE.Group();
    this.model.add(this.gltf.scene);

    const SIZE = 0.3;
    this.gltf.scene.scale.set(SIZE, SIZE, SIZE);
    this.gltf.scene.rotateY(-THREE.MathUtils.degToRad(180 - 22.65));
    this.gltf.scene.updateMatrixWorld(true);

    const bounds = new THREE.Box3().setFromObject(this.gltf.scene);
    const center = bounds.getCenter(new THREE.Vector3());
    this.gltf.scene.position.set(-center.x, -bounds.min.y, -center.z);
  }

  private setupEntity() {
    this.entity = new YUKA.Vehicle();
    this.entity.maxSpeed = 0.5;
    this.entity.maxForce = 2;
    this.entity.maxTurnRate = MAX_TURN_RATE;
    this.entity.updateOrientation = false;
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
    this.entity.position.set(
      (Math.random() - 0.5) * GROUND_SIZE.width * 0.8,
      0,
      (Math.random() - 0.5) * GROUND_SIZE.height * 0.8,
    );
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

  setTarget(target: YUKA.Vector3) {
    if (!this.entity) return;
    this.target = target;
    const behavior = new YUKA.ArriveBehavior(target);
    behavior.tolerance = ARRIVE_TOLERANCE;
    behavior.active = false;
    this.entity.steering.add(behavior);
  }

  async seek(): Promise<void> {
    if (!this.entity || !this.target) return;
    this.isSeeking = true;
    this.entity.steering.behaviors[0].active = true;
    return new Promise<void>((resolve) => {
      this.onArrive = resolve;
    });
  }

  private arriveAtTarget(): boolean {
    if (!this.entity || !this.target) return false;

    const toleranceSq = ARRIVE_TOLERANCE * ARRIVE_TOLERANCE;
    const distanceSq = this.entity.position.squaredDistanceTo(this.target);

    const isClose = distanceSq <= toleranceSq;
    const isMoving =
      this.entity.velocity.squaredLength() >= MOVE_THRESHOLD ** 2;

    return isClose && !isMoving;
  }

  update(time: number, delta: number) {
    this.animation?.update(time);

    if (this.entity && this.animation) {
      const isArrivedAtTarget = this.arriveAtTarget();

      let animationToPlay: string = "";
      if (isArrivedAtTarget) {
        animationToPlay = ANIMATION_NAME.lion.idle;
        this.isSeeking = false;
        this.entity?.velocity.set(0, 0, 0);

        const onArrive = this.onArrive;
        this.onArrive = null;
        onArrive?.();
      } else if (this.target && this.isSeeking) {
        this.entity.rotateTo(this.target, delta * 2);
        animationToPlay = ANIMATION_NAME.lion.walk;
      }

      if (
        animationToPlay &&
        animationToPlay !== this.animation.getPlayingAnimationName()
      ) {
        this.animation.play({ name: animationToPlay });
      }
    }
  }
}

export default Lion;
