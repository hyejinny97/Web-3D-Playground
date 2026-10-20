import * as THREE from "three";
import * as CANNON from "cannon-es";
import type { CannonType } from "../FireCannonProject.types";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import {
  CANNON_MUZZLE_NAME,
  GROUND_WIDTH,
} from "../FireCannonProject.constants";
import CannonBall from "./CannonBall";

class Cannon implements CannonType {
  private loadingManager: THREE.LoadingManager;
  private flyBalls: CannonBall[] = [];
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
      mass: 100,
      shape,
    });
  }

  private transform() {
    this.body?.quaternion.setFromEuler(0, -Math.PI / 2, 0);
    this.body?.position.set(-GROUND_WIDTH / 2 + 3, 0.5, 0);
  }

  fire(speed: number): CannonBall | null {
    const muzzle = this.model?.getObjectByName(CANNON_MUZZLE_NAME);
    if (!muzzle) {
      console.error(`'${CANNON_MUZZLE_NAME}' 이름의 객체를 찾을 수 없습니다.`);
      return null;
    }
    if (!this.body) {
      console.error("cannon의 body가 없습니다.");
      return null;
    }

    const box = new THREE.Box3().setFromObject(muzzle);
    const size = box.getSize(new THREE.Vector3());

    const firePosition = new THREE.Vector3(
      this.body.position.x + size.x / 2,
      this.body.position.y + size.y / 2 + 0.1,
      this.body.position.z,
    );
    const unitVectorXY = new THREE.Vector3(size.x, size.y, 0).normalize();
    const launchVelocity = unitVectorXY.multiplyScalar(speed);

    const ball = new CannonBall();
    ball.body.position.set(firePosition.x, firePosition.y, firePosition.z);
    ball.body.velocity.set(
      launchVelocity.x,
      launchVelocity.y,
      launchVelocity.z,
    );
    this.flyBalls.push(ball);
    return ball;
  }

  update() {
    if (this.body && this.model) {
      this.model.position.copy(this.body.position);
      this.model.quaternion.copy(this.body.quaternion);
    }
    this.flyBalls.forEach((ball) => {
      ball.update();
    });
  }
}

export default Cannon;
