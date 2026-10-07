import * as THREE from "three";
import type { CharacterType } from "../MoveCharacterProject.types";
import { GLTFLoader, type GLTF } from "three/examples/jsm/Addons.js";
import AnimationHelper from "@/helpers/AnimationHelper";
import CharacterDirection from "./CharacterDirection";
import CharacterSpeed from "./CharacterSpeed";

class Character implements CharacterType {
  private loadingManager: THREE.LoadingManager;
  private camera: THREE.Camera;
  private animation!: AnimationHelper;
  private gltf!: GLTF;
  root!: THREE.Object3D;
  direction!: CharacterDirection;
  speed!: CharacterSpeed;

  constructor({
    loadingManager,
    camera,
  }: {
    loadingManager: THREE.LoadingManager;
    camera: THREE.Camera;
  }) {
    this.loadingManager = loadingManager;
    this.camera = camera;
  }

  async init() {
    await this.loadModel();
    this.transform();
    this.setupAnimation();

    this.direction = new CharacterDirection({
      camera: this.camera,
      character: this.root,
    });
    this.speed = new CharacterSpeed({ character: this.root });
  }

  private async loadModel() {
    const loader = new GLTFLoader(this.loadingManager);
    this.gltf = await loader.loadAsync("/models/woman_with_headphone.gltf");
    this.root = this.gltf.scene;
  }

  private transform() {
    this.root.scale.set(0.02, 0.02, 0.02);

    const box = new THREE.Box3().setFromObject(this.root);
    const size = box.getSize(new THREE.Vector3());
    const height = size.y;
    this.root.position.set(0, height / 2, 0);
  }

  private setupAnimation() {
    this.animation = new AnimationHelper({
      model: this.gltf.scene,
      clips: this.gltf.animations,
    });
    this.animation.play({ name: "Idle" });
  }

  update(time: number) {
    this.animation?.update(time);
    this.direction?.update();
    this.speed?.update(time);
  }
}

export default Character;
