import * as THREE from "three";
import * as CANNON from "cannon-es";
import type { DollType } from "../GrabDollProject.types";
import { BODY_NAME } from "../GrabDollProject.constants";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

class Doll implements DollType {
  private loadingManager: THREE.LoadingManager;
  private gltf: THREE.Object3D | null = null;
  private size = new THREE.Vector3();
  private center = new THREE.Vector3();
  model: THREE.Object3D | null = null;
  body: CANNON.Body | null = null;

  constructor({ loadingManager }: { loadingManager: THREE.LoadingManager }) {
    this.loadingManager = loadingManager;
  }

  async init() {
    await this.loadGLTF();
    this.transform();
    this.setupModel();
    this.setupBody();
  }

  private async loadGLTF() {
    const loader = new GLTFLoader(this.loadingManager);
    const gltf = await loader.loadAsync("/models/doll.glb");
    this.gltf = gltf.scene;
  }

  private transform() {
    if (!this.gltf) return;

    this.gltf.scale.set(10, 10, 10);
    this.gltf.updateMatrixWorld(true);

    const box = new THREE.Box3().setFromObject(this.gltf);
    box.getSize(this.size);
    box.getCenter(this.center);
  }

  private setupModel() {
    if (!this.gltf) return;

    this.model = new THREE.Group();
    this.model.add(this.gltf);
    this.gltf.position.set(-this.center.x, -this.center.y, -this.center.z);

    const geometry = new THREE.BoxGeometry(
      this.size.x,
      this.size.y,
      this.size.z,
    );
    const material = new THREE.MeshPhongMaterial();
    const containerBox = new THREE.Mesh(geometry, material);
    containerBox.visible = false;
    this.model.add(containerBox);
  }

  private setupBody() {
    const shape = new CANNON.Box(
      new CANNON.Vec3(this.size.x / 2, this.size.y / 2, this.size.z / 2),
    );
    this.body = new CANNON.Body({
      mass: 1,
      shape,
      position: new CANNON.Vec3(0, this.size.y, 0),
    });
    this.body.name = BODY_NAME.doll;
  }

  reset() {
    if (this.body) {
      this.body.position.set(0, this.size.y, 0);
      this.body.quaternion.set(0, 0, 0, 1);
      this.body.velocity.set(0, 0, 0);
      this.body.angularVelocity.set(0, 0, 0);
    }
  }

  update() {
    if (!this.model || !this.body) return;
    this.model.position.copy(this.body.position);
    this.model.quaternion.copy(this.body.quaternion);
  }
}

export default Doll;
