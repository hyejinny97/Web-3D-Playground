import * as THREE from "three";
import * as YUKA from "yuka";
import type { BuffaloType } from "../LionBuffalosProject.types";
import {
  GLTFLoader,
  SkeletonUtils,
  type GLTF,
} from "three/examples/jsm/Addons.js";
import {
  ANIMATION_NAME,
  GROUND_SIZE,
  MOVE_THRESHOLD,
  ORIGINAL_MODEL_NAME,
  PANIC_DISTANCE,
  RESTRICTED_AREA,
} from "../LionBuffalosProject.constants";
import AnimationHelper from "@/helpers/AnimationHelper";

class Buffalo implements BuffaloType {
  private loadingManager: THREE.LoadingManager;
  private count!: number;
  private gltf: GLTF | null = null;
  private animations: AnimationHelper[] = [];
  private target: YUKA.Vector3 | null = null;
  models: THREE.Object3D[] = [];
  entities: YUKA.Vehicle[] = [];

  constructor({
    loadingManager,
    count,
  }: {
    loadingManager: THREE.LoadingManager;
    count: number;
  }) {
    this.loadingManager = loadingManager;
    this.count = count;
  }

  async init() {
    await this.loadGLTF();
    this.setupModels();
    this.setupEntities();
    this.transformEntities();
    this.entities.forEach((entity, idx) =>
      this.connectEntityToModel(entity!, this.models[idx]),
    );
    this.setupAnimations();
  }

  private async loadGLTF() {
    const loader = new GLTFLoader(this.loadingManager);
    this.gltf = await loader.loadAsync("/models/buffalo/scene.gltf");

    const SIZE = 0.3;
    this.gltf.scene.scale.set(SIZE, SIZE, SIZE);
  }

  private setupModels() {
    if (!this.gltf) return;

    Array(this.count)
      .fill(0)
      .forEach(() => {
        const model = SkeletonUtils.clone(this.gltf!.scene);
        model.name = ORIGINAL_MODEL_NAME;

        const group = new THREE.Group();
        group.add(model);
        this.models.push(group);
      });
  }

  private setupEntities() {
    Array(this.count)
      .fill(0)
      .forEach(() => {
        const entity = new YUKA.Vehicle();
        entity.maxSpeed = 1;
        entity.maxForce = 5;
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

  private transformEntities() {
    const CLUSTER_CENTER = new THREE.Vector3(0, 0, 0);
    const CLUSTER_RADIUS =
      (Math.min(GROUND_SIZE.width, GROUND_SIZE.height) * 0.8) / 2;

    const box = new THREE.Box3().setFromObject(this.models[0]);
    const size = box.getSize(new THREE.Vector3());

    const MIN_DISTANCE = size.length() * 0.8;
    const ATTEMPTS_LIMIT = this.count * 7;

    const placedPositions: THREE.Vector3Like[] = [];
    let attempts = 0;

    const getDistance = (
      a: THREE.Vector3Like,
      b: THREE.Vector3Like,
    ): number => {
      return Math.hypot(b.x - a.x, b.y - a.y, b.z - a.z);
    };

    const isOverlap = (position: THREE.Vector3Like): boolean => {
      if (ATTEMPTS_LIMIT < attempts) return false;
      attempts++;
      return placedPositions.some(
        (placedPosition) =>
          getDistance(placedPosition, position) <= MIN_DISTANCE,
      );
    };

    const calculatePosition = (): THREE.Vector3Like => {
      const r = CLUSTER_RADIUS * Math.pow(Math.random(), 0.3);
      const theta = 2 * Math.PI * Math.random();

      const x = CLUSTER_CENTER.x + r * Math.cos(theta);
      const z = CLUSTER_CENTER.z + r * Math.sin(theta);
      const position = { x, y: 0, z };

      if (isOverlap(position)) {
        return calculatePosition();
      } else {
        placedPositions.push(position);
        return position;
      }
    };

    this.entities.forEach((entity) => {
      const { x, y, z } = calculatePosition();
      entity.position.set(x, y, z);
      entity.rotation.fromEuler(0, -2 * Math.PI * Math.random(), 0);
    });
  }

  private setupAnimations() {
    if (!this.gltf) return;
    this.models.forEach((model) => {
      const animation = new AnimationHelper({
        model,
        clips: this.gltf!.animations,
      });
      animation.play({
        name: ANIMATION_NAME.buffalo.idle,
        startAt: Math.random(),
      });
      this.animations.push(animation);
    });
  }

  flee(target: YUKA.Vector3) {
    this.target = target;
    this.entities.forEach((entity) => {
      const fleeBehavior = new YUKA.FleeBehavior(target);
      fleeBehavior.panicDistance = PANIC_DISTANCE;

      const returnBehavior = new YUKA.SeekBehavior(RESTRICTED_AREA.center);
      returnBehavior.active = false;

      entity.steering.add(fleeBehavior);
      entity.steering.add(returnBehavior);
    });
  }

  private animate(time: number) {
    this.animations.forEach((animation) => {
      animation.update(time);
    });
    this.entities.forEach((entity, idx) => {
      const animation = this.animations[idx];
      const isMoving = entity.velocity.squaredLength() > MOVE_THRESHOLD ** 2;

      let animationToPlay: string;
      if (isMoving) {
        animationToPlay = ANIMATION_NAME.buffalo.walk;
      } else {
        animationToPlay = ANIMATION_NAME.buffalo.idle;
      }

      if (animationToPlay !== animation.getPlayingAnimationName()) {
        animation.play({ name: animationToPlay });
      }
    });
  }

  private forceWithinRestrictedArea() {
    if (!this.target) return;

    this.entities.forEach((entity) => {
      let fleeBehavior: YUKA.FleeBehavior | null = null;
      let returnBehavior: YUKA.SeekBehavior | null = null;
      for (const behavior of entity.steering.behaviors) {
        if (behavior instanceof YUKA.FleeBehavior) {
          fleeBehavior = behavior;
        }
        if (behavior instanceof YUKA.SeekBehavior) {
          returnBehavior = behavior;
        }
      }
      if (!fleeBehavior || !returnBehavior) return;

      const distanceFromCenter = entity.position.distanceTo(
        RESTRICTED_AREA.center,
      );
      if (distanceFromCenter > RESTRICTED_AREA.radius) {
        fleeBehavior.active = false;
        returnBehavior.active = true;
      } else {
        const distanceFromTarget = entity.position.distanceTo(this.target!);
        if (distanceFromTarget >= PANIC_DISTANCE * 1.5) {
          fleeBehavior.active = false;
          entity.velocity.set(0, 0, 0);
        } else {
          fleeBehavior.active = true;
        }
        returnBehavior.active = false;
      }
    });
  }

  update(time: number) {
    this.animate(time);
    this.forceWithinRestrictedArea();
  }
}

export default Buffalo;
