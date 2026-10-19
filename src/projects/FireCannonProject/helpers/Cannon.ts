import * as THREE from "three";
import * as CANNON from "cannon-es";
import type { CannonType } from "../FireCannonProject.types";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { GROUND_WIDTH } from "../FireCannonProject.constants";

class Cannon implements CannonType {
  private loadingManager: THREE.LoadingManager;
  model: THREE.Object3D | null = null;
  body: CANNON.Body | null = null;

  constructor({ loadingManager }: { loadingManager: THREE.LoadingManager }) {
    this.loadingManager = loadingManager;
  }

  async init() {
    await this.loadGLTF();
    this.setupBody();
    this.transform();
  }

  private async loadGLTF() {
    const loader = new GLTFLoader(this.loadingManager);
    const gltf = await loader.loadAsync("/models/cannon.glb");
    this.model = gltf.scene;
  }

  private setupBody() {
    const box = new THREE.Box3().setFromObject(this.model!);
    const size = new THREE.Vector3();
    box.getSize(size);

    const shape = new CANNON.Box(
      new CANNON.Vec3(size.x / 2, size.y / 2, size.z / 2),
    );
    this.body = new CANNON.Body({
      mass: 5,
      shape,
    });
  }

  private transform() {
    this.body?.quaternion.setFromEuler(0, -Math.PI / 2, 0);
    this.body?.position.set(-GROUND_WIDTH / 2 + 3, 0.5, 0);
  }
}

export default Cannon;
