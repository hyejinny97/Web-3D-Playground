import * as THREE from "three";
import * as CANNON from "cannon-es";
import { GLTFLoader, type GLTF } from "three/examples/jsm/Addons.js";
import type { BirdType } from "../CrossBridgeProject.types";
import Crossing from "./Crossing";

class Bird implements BirdType {
  private loadingManager: THREE.LoadingManager;
  private modelOffset = new THREE.Vector3();
  private gltf: GLTF | null = null;
  model: THREE.Object3D | null = null;
  body: CANNON.Body | null = null;
  crossing: Crossing | null = null;

  constructor({ loadingManager }: { loadingManager: THREE.LoadingManager }) {
    this.loadingManager = loadingManager;
  }

  async init() {
    await this.loadGLTF();
    this.scaleUpModel();
    this.setupBody();
    this.transform();

    this.calculateCenterOffset();
    this.crossing = new Crossing({ body: this.body!, gltf: this.gltf! });
    this.crossing.init();
  }

  private async loadGLTF() {
    const loader = new GLTFLoader(this.loadingManager);
    this.gltf = await loader.loadAsync("models/kiwi-bird/scene.gltf");
    this.model = this.gltf.scene;
  }

  private scaleUpModel() {
    if (this.model) {
      this.model.scale.set(50, 50, 50);
      this.model.updateMatrixWorld();
    }
  }

  private calculateCenterOffset() {
    if (this.model) {
      const box = new THREE.Box3().setFromObject(this.model);
      const center = box.getCenter(new THREE.Vector3());
      this.modelOffset.copy(center).sub(this.model.position);
    }
  }

  private setupBody() {
    const box = new THREE.Box3().setFromObject(this.model!);
    const size = box.getSize(new THREE.Vector3());

    const shape = new CANNON.Box(
      new CANNON.Vec3(size.x / 2, size.y / 2, size.z / 2),
    );
    const material = new CANNON.Material("character");
    this.body = new CANNON.Body({
      mass: 10,
      shape,
      material,
    });
  }

  private transform() {
    if (this.body) {
      this.body.quaternion.setFromAxisAngle(
        new CANNON.Vec3(0, 1, 0),
        Math.PI / 2,
      );
    }
  }

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

export default Bird;
