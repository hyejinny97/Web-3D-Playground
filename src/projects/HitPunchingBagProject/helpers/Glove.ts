import * as THREE from "three";
import { gsap } from "gsap";
import type { GloveType } from "../HitPunchingBagProject.types";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { GLOVE_PUNCH_OFFSET } from "../HitPunchingBagProject.constants";

class Glove implements GloveType {
  private loadingManager: THREE.LoadingManager;
  model: THREE.Object3D | null = null;

  constructor({ loadingManager }: { loadingManager: THREE.LoadingManager }) {
    this.loadingManager = loadingManager;
  }

  async init() {
    await this.loadGLTF();
    this.transform();
  }

  private async loadGLTF() {
    const loader = new GLTFLoader(this.loadingManager);
    const gltf = await loader.loadAsync("models/glove/scene.gltf");
    this.model = gltf.scene;
    this.model.visible = false;
  }

  private transform() {
    if (!this.model) return;
    this.model.position.set(0, 0, 3);
    this.model.quaternion.setFromAxisAngle(
      new THREE.Vector3(0, 1, 0),
      -Math.PI,
    );
  }

  private show() {
    if (!this.model) return;
    this.model.visible = true;
  }

  private hide() {
    if (!this.model) return;
    this.model.visible = false;
  }

  async punch({
    position,
    direction,
  }: {
    position: THREE.Vector3;
    direction: THREE.Vector3;
  }) {
    if (!this.model) return;
    const normal = new THREE.Vector3().copy(direction).normalize();

    const startPosition = new THREE.Vector3()
      .copy(position)
      .sub(normal.multiplyScalar(GLOVE_PUNCH_OFFSET));
    this.model.position.copy(startPosition);

    const lookAtPosition = new THREE.Vector3().copy(position).add(normal);
    this.model.lookAt(lookAtPosition);

    await gsap.to(this.model!.position, {
      x: position.x,
      y: position.y,
      z: position.z,
      ease: "power3.inOut",
      duration: 0.3,
      onStart: () => {
        this.show();
      },
      onComplete: () => {
        this.hide();
      },
    });
  }
}

export default Glove;
