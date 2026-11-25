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
  ORIGINAL_MODEL_NAME,
} from "../LionBuffalosProject.constants";
import AnimationHelper from "@/helpers/AnimationHelper";

class Buffalo implements BuffaloType {
  private loadingManager: THREE.LoadingManager;
  private count!: number;
  private gltf: GLTF | null = null;
  private animations: AnimationHelper[] = [];
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
    this.transformModels();
    this.setupAnimations();
  }

  private async loadGLTF() {
    const loader = new GLTFLoader(this.loadingManager);
    this.gltf = await loader.loadAsync("/models/buffalo/scene.gltf");

    const SIZE = 0.2;
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

  private transformModels() {
    const CLUSTER_CENTER = new THREE.Vector3(0, 0, 0);
    const CLUSTER_RADIUS =
      (Math.min(GROUND_SIZE.width, GROUND_SIZE.height) * 0.8) / 2;

    const box = new THREE.Box3().setFromObject(this.models[0]);
    const size = box.getSize(new THREE.Vector3());

    const MIN_DISTANCE = size.length() * 0.8;
    const ATTEMPTS_LIMIT = this.count * 5;

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
      const r = CLUSTER_RADIUS * Math.pow(Math.random(), 0.25);
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

    this.models.forEach((model) => {
      const originalModel = model.getObjectByName(ORIGINAL_MODEL_NAME);
      if (!originalModel) return;

      const { x, y, z } = calculatePosition();
      originalModel.position.set(x, y, z);
      originalModel.rotateY(2 * Math.PI * Math.random());
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

  update(time: number) {
    this.animations.forEach((animation) => {
      animation.update(time);
    });
  }
}

export default Buffalo;
