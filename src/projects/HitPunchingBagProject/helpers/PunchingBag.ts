import * as THREE from "three";
import * as CANNON from "cannon-es";
import type {
  PunchingBagInfoType,
  PunchingBagType,
} from "../HitPunchingBagProject.types";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import {
  PUNCHING_BAG_BODY_NAMES,
  PUNCHING_BAG_OBJECT_NAMES,
} from "../HitPunchingBagProject.constants";

class PunchingBag implements PunchingBagType {
  private loadingManager: THREE.LoadingManager;
  private gltf: THREE.Object3D | null = null;
  private info: PunchingBagInfoType = {};
  model: THREE.Object3D | null = null;
  bodies: CANNON.Body[] = [];
  constraint: CANNON.ConeTwistConstraint | null = null;

  constructor({ loadingManager }: { loadingManager: THREE.LoadingManager }) {
    this.loadingManager = loadingManager;
  }

  async init() {
    await this.loadGLTF();
    this.transform();
    this.setupModel();
    this.setupInfo();
    this.setupBodies();
    this.setupConstraint();
  }

  private async loadGLTF() {
    const loader = new GLTFLoader(this.loadingManager);
    const gltf = await loader.loadAsync("models/punching_bag.glb");
    this.gltf = gltf.scene;
  }

  private transform() {
    if (!this.gltf) return;
    this.gltf.quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI);
    this.gltf.scale.set(0.3, 0.3, 0.3);
  }

  private setupModel() {
    if (!this.gltf) return;
    this.model = new THREE.Group();
    this.model.add(this.gltf);

    const box = this.getBoundingBox(this.gltf);
    const center = box.getCenter(new THREE.Vector3());
    this.gltf.position.set(-center.x, -center.y, -center.z);
    this.gltf.updateMatrixWorld(true);
  }

  private setupInfo() {
    if (!this.model) return;
    const bagObj = this.findObject(this.model, PUNCHING_BAG_OBJECT_NAMES.bag);
    const bagBox = this.getBoundingBox(bagObj);
    this.info = { bagObj, bagBox };
  }

  private setupBodies() {
    const { bagBox } = this.info;
    if (!bagBox) {
      throw new Error("bagBox를 찾을 수 없습니다.");
    }

    const radius = (bagBox.max.x - bagBox.min.x) / 2;
    const height = bagBox.max.y - bagBox.min.y;
    const bagInitPosition = new CANNON.Vec3(
      (bagBox.max.x + bagBox.min.x) / 2,
      (bagBox.max.y + bagBox.min.y) / 2,
      (bagBox.max.z + bagBox.min.z) / 2,
    );
    const anchorPosition = new CANNON.Vec3(
      (bagBox.max.x + bagBox.min.x) / 2,
      bagBox.max.y,
      (bagBox.max.z + bagBox.min.z) / 2,
    );

    const bagShape = new CANNON.Cylinder(radius, radius, height, 20);
    const bagBody = new CANNON.Body({
      mass: 10,
      shape: bagShape,
      position: bagInitPosition,
    });
    bagBody.name = PUNCHING_BAG_BODY_NAMES.bag;

    const anchorShape = new CANNON.Particle();
    const anchorBody = new CANNON.Body({
      mass: 0,
      shape: anchorShape,
      position: anchorPosition,
    });

    this.info = { ...this.info, bagBody, anchorBody };
    this.bodies.push(...[bagBody, anchorBody]);
  }

  private setupConstraint() {
    const { bagBody, anchorBody, bagBox } = this.info;
    if (!bagBody || !anchorBody || !bagBox) {
      throw new Error("bagBody, anchorBody, bagBox를 찾을 수 없습니다.");
    }

    this.constraint = new CANNON.ConeTwistConstraint(bagBody, anchorBody, {
      pivotA: new CANNON.Vec3(0, (bagBox.max.y - bagBox.min.y) / 2, 0),
      pivotB: new CANNON.Vec3(0, 0, 0),
      axisA: new CANNON.Vec3(0, -1, 0),
      axisB: new CANNON.Vec3(0, -1, 0),
      angle: THREE.MathUtils.degToRad(80),
      twistAngle: THREE.MathUtils.degToRad(100),
    });
  }

  private findObject(target: THREE.Object3D, name: string): THREE.Object3D {
    const obj = target.getObjectByName(name);
    if (!obj) {
      throw new Error(`${name} 이름의 객체를 찾을 수 없습니다.`);
    }
    return obj;
  }

  private getBoundingBox(obj: THREE.Object3D): THREE.Box3 {
    return new THREE.Box3().setFromObject(obj);
  }

  update() {
    const { bagObj, bagBody } = this.info;
    if (!this.model || !bagObj || !bagBody) return;

    const worldPos = new THREE.Vector3(
      bagBody.position.x,
      bagBody.position.y,
      bagBody.position.z,
    );
    bagObj.worldToLocal(worldPos.clone());
    bagObj.quaternion.copy(bagBody.quaternion);
  }
}

export default PunchingBag;
