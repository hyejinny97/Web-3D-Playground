import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import type { CarHelperType } from "../FollowCurveProject.types";

class CarHelper implements CarHelperType {
  declare root: THREE.Object3D;
  private loadManager: THREE.LoadingManager;

  constructor({ loadManager }: { loadManager: THREE.LoadingManager }) {
    this.loadManager = loadManager;
  }

  async init() {
    await this.loadGLTF();
    this.transform();
  }

  async loadGLTF() {
    const loader = new GLTFLoader(this.loadManager);
    const gltf = await loader.loadAsync("/models/race_car/scene.gltf");
    this.root = gltf.scene;
  }

  transform() {
    this.root.scale.set(0.015, 0.015, 0.015);

    const box = new THREE.Box3().setFromObject(this.root);
    const size = new THREE.Vector3();
    box.getSize(size);

    this.root.position.set(-size.z / 2, 0.001, 0.2);
    this.root.rotation.set(0, Math.PI / 2, 0);
  }
}

export default CarHelper;
