import * as THREE from "three";
import * as YUKA from "yuka";
import type { WildGeeseType } from "../WildGeeseProject.types";
import {
  GLTFLoader,
  SkeletonUtils,
  type GLTF,
} from "three/examples/jsm/Addons.js";
import {
  GEESE_OFFSET,
  ORIGINAL_MODEL_NAME,
} from "../WildGeeseProject.constants";
import AnimationHelper, {
  type AnimationHelperType,
} from "@/helpers/AnimationHelper";

class WildGeese implements WildGeeseType {
  private loadingManager: THREE.LoadingManager;
  private count: number = 1;
  protected gltf: GLTF | null = null;
  private animations: AnimationHelperType[] = [];
  models: THREE.Object3D[] = [];
  entities: YUKA.Vehicle[] = [];

  constructor({
    loadingManager,
    count,
  }: {
    loadingManager: THREE.LoadingManager;
    count: number;
  }) {
    if (this.count < 1) {
      throw new Error("WildGeese count 수는 최소 1 이상이어야 합니다.");
    }
    this.loadingManager = loadingManager;
    this.count = count;
  }

  async init() {
    await this.loadGLTF();
    this.setupModels();
    this.transformModels();
    this.setupEntities();
    this.entities.forEach((entity, idx) =>
      this.connectEntityToModel(entity, this.models[idx]),
    );
    this.setupAnimations();
    this.alignToV();
  }

  private async loadGLTF() {
    const loader = new GLTFLoader(this.loadingManager);
    this.gltf = await loader.loadAsync("/models/goose/scene.gltf");
  }

  private setupModels() {
    if (!this.gltf) return;
    Array(this.count)
      .fill(0)
      .forEach(() => {
        const clonedModel = SkeletonUtils.clone(this.gltf!.scene);
        clonedModel.name = ORIGINAL_MODEL_NAME;

        const group = new THREE.Group();
        group.add(clonedModel);
        this.models.push(group);
      });
  }

  private transformModels() {
    this.models.forEach((model, idx) => {
      const isLeader = idx === 0;
      const size = isLeader ? 0.8 : 0.6;
      const originalModel = model.getObjectByName(ORIGINAL_MODEL_NAME);
      if (originalModel) {
        originalModel.scale.set(size, size, size);
      }
    });
  }

  private setupEntities() {
    Array(this.count)
      .fill(0)
      .forEach((_, idx) => {
        const isLeader = idx === 0;
        const entity = new YUKA.Vehicle();
        entity.maxSpeed = isLeader ? 3 : 15;
        entity.maxForce = isLeader ? 5 : 20;
        this.entities.push(entity);
      });
  }

  private connectEntityToModel(entity: YUKA.GameEntity, model: THREE.Object3D) {
    model.matrixAutoUpdate = false;
    entity.setRenderComponent(model, this.sync);
  }

  private sync(entity: YUKA.GameEntity, renderComponent: THREE.Object3D) {
    renderComponent.matrix.copy(entity.worldMatrix as unknown as THREE.Matrix4);
  }

  private setupAnimations() {
    if (!this.gltf) return;

    this.models.forEach((model) => {
      const animation = new AnimationHelper({
        model,
        clips: this.gltf!.animations,
      });
      animation.play({
        name: "canada_goose_alerted_pose_01|canada_goose_fly_fwd_01",
        startAt: Math.random(),
      });
      this.animations.push(animation);
    });
  }

  private alignToV() {
    const leader = this.entities[0];
    this.entities.forEach((entity, idx) => {
      if (idx === 0) return;

      const { x, y, z } = GEESE_OFFSET;
      const level = Math.trunc((idx - 1) / 2) + 1;
      const sign = idx % 2 === 0 ? -1 : 1;
      const offset = new YUKA.Vector3(
        sign * level ** 2 * x,
        -(level ** 2) * y,
        -(level ** 2) * z,
      );

      const behavior = new YUKA.OffsetPursuitBehavior(leader, offset);
      entity.steering.add(behavior);
      entity.position.copy(offset);
    });
  }

  seek(target: YUKA.Vector3) {
    const leader = this.entities[0];
    if (leader) {
      const behavior = new YUKA.SeekBehavior(target);
      leader.steering.add(behavior);
    }
  }

  update(time: number) {
    this.animations.forEach((animation) => animation.update(time));
  }
}

export default WildGeese;
