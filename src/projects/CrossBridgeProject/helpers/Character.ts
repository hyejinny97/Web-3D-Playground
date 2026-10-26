import * as THREE from "three";
import * as CANNON from "cannon-es";
import { GLTFLoader, type GLTF } from "three/examples/jsm/Addons.js";
import type { CharacterType } from "../CrossBridgeProject.types";
import Crossing from "./Crossing";

abstract class Character implements CharacterType {
  private url: string;
  private loadingManager: THREE.LoadingManager;
  private crossingSpeed: number;
  private initialVisibility: boolean;
  private modelOffset = new THREE.Vector3();
  private gltf: GLTF | null = null;
  model: THREE.Object3D | null = null;
  body: CANNON.Body | null = null;
  crossing: Crossing | null = null;

  constructor({
    url,
    loadingManager,
    crossingSpeed,
    initialVisibility = true,
  }: {
    url: string;
    loadingManager: THREE.LoadingManager;
    crossingSpeed: number;
    initialVisibility?: boolean;
  }) {
    this.url = url;
    this.loadingManager = loadingManager;
    this.crossingSpeed = crossingSpeed;
    this.initialVisibility = initialVisibility;
  }

  async init() {
    await this.loadGLTF();
    this.scaleModel();
    this.setupBody();
    this.transform();

    this.calculateCenterOffset();
    this.crossing = new Crossing({
      body: this.body!,
      gltf: this.gltf!,
      speed: this.crossingSpeed,
    });
    this.crossing.init();

    if (!this.initialVisibility) {
      this.invisible();
    }
  }

  private async loadGLTF() {
    const loader = new GLTFLoader(this.loadingManager);
    this.gltf = await loader.loadAsync(this.url);
    this.model = this.gltf.scene;
  }

  protected scaleModel() {}

  private calculateCenterOffset() {
    if (this.model) {
      const box = new THREE.Box3().setFromObject(this.model);
      const center = box.getCenter(new THREE.Vector3());
      this.modelOffset.copy(center).sub(this.model.position);
    }
  }

  protected abstract setupBody(): void;

  protected transform() {}

  visible() {
    if (this.model && this.body) {
      this.model.visible = true;
      this.body.collisionResponse = true;
      this.body.type = CANNON.Body.DYNAMIC;
    }
  }

  invisible() {
    if (this.model && this.body) {
      this.model.visible = false;
      this.body.collisionResponse = false;
      this.body.type = CANNON.Body.STATIC;
      this.body.velocity.set(0, 0, 0);
      this.body.angularVelocity.set(0, 0, 0);
    }
  }

  update(time: number, onCrossEnd: () => void) {
    if (this.model && this.body) {
      this.crossing?.update(time, onCrossEnd);
      this.model.position.copy(this.body.position).sub(this.modelOffset);
      this.model.quaternion.copy(this.body.quaternion);
    }
  }
}

export default Character;
