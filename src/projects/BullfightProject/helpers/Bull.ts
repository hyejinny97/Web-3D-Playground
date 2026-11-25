import * as THREE from "three";
import * as YUKA from "yuka";
import type { BullType } from "../BullfightProject.types";
import { GLTFLoader, type GLTF } from "three/examples/jsm/Addons.js";
import type { AnimationHelperType } from "@/helpers/AnimationHelper";
import {
  BULL_ANIMATION_NAME,
  BULL_ATTACK_DISTANCE,
} from "../BullfightProject.constants";
import AnimationHelper from "@/helpers/AnimationHelper";

class Bull implements BullType {
  private loadingManager: THREE.LoadingManager;
  protected gltf: GLTF | null = null;
  private animation: AnimationHelperType | null = null;
  private targets: YUKA.Vehicle[] = [];
  model: THREE.Object3D | null = null;
  entity: YUKA.Vehicle | null = null;

  constructor({ loadingManager }: { loadingManager: THREE.LoadingManager }) {
    this.loadingManager = loadingManager;
  }

  async init() {
    await this.loadGLTF();
    this.setupModel();
    this.setupEntity();
    this.connectEntityToModel(this.entity!, this.model!);
    this.setupAnimation();
  }

  private async loadGLTF() {
    const loader = new GLTFLoader(this.loadingManager);
    this.gltf = await loader.loadAsync("/models/bull/scene.gltf");
  }

  private setupModel() {
    if (!this.gltf) return;

    const SIZE = 35;
    this.gltf.scene.scale.set(SIZE, SIZE, SIZE);
    this.gltf.scene.updateMatrixWorld(true);

    this.model = new THREE.Group();
    this.model.add(this.gltf.scene);
  }

  private setupEntity() {
    this.entity = new YUKA.Vehicle();
    this.entity.maxSpeed = 70;
    this.entity.maxForce = 40;
  }

  private connectEntityToModel(entity: YUKA.GameEntity, model: THREE.Object3D) {
    model.matrixAutoUpdate = false;
    entity.setRenderComponent(model, this.sync);
  }

  private sync(entity: YUKA.GameEntity, renderComponent: THREE.Object3D) {
    renderComponent.matrix.copy(entity.worldMatrix as unknown as THREE.Matrix4);
  }

  private setupAnimation() {
    if (!this.gltf || !this.model) return;

    this.animation = new AnimationHelper({
      model: this.model,
      clips: this.gltf.animations,
    });
    this.animation.play({ name: BULL_ANIMATION_NAME.idle });
  }

  interpose(entity1: YUKA.Vehicle, entity2: YUKA.Vehicle) {
    if (this.entity && this.animation) {
      const behavior = new YUKA.InterposeBehavior(entity1, entity2, 1);
      this.entity.steering.add(behavior);
      this.animation.play({ name: BULL_ANIMATION_NAME.run });
      this.targets = [entity1, entity2];
    }
  }

  private attackWhenClose() {
    if (!this.entity || this.targets.length !== 2 || !this.animation) return;

    const midPoint = new THREE.Vector3().lerpVectors(
      this.targets[0].position,
      this.targets[1].position,
      0.5,
    );
    const attackSq = BULL_ATTACK_DISTANCE * BULL_ATTACK_DISTANCE;
    const distanceSq = this.entity.position.squaredDistanceTo(
      new YUKA.Vector3(midPoint.x, midPoint.y, midPoint.z),
    );

    let animationToPlay: string;
    if (distanceSq <= attackSq) {
      animationToPlay = BULL_ANIMATION_NAME.attack;
    } else {
      animationToPlay = BULL_ANIMATION_NAME.run;
    }

    if (animationToPlay !== this.animation.getPlayingAnimationName()) {
      this.animation.play({ name: animationToPlay });
    }
  }

  update(time: number) {
    this.animation?.update(time);
    this.attackWhenClose();
  }
}

export default Bull;
