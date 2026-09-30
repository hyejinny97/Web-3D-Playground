import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import type { CarHelperType } from "../FollowCurveProject.types";
import CarPedal from "./CarPedal";
import { CAR_PART, TIRE_RADIUS } from "../FollowCurveProject.constants";

class CarHelper implements CarHelperType {
  private loadManager: THREE.LoadingManager;
  private tireWheels: THREE.Object3D[] = [];
  declare root: THREE.Object3D;
  declare pedal: CarPedal;
  speed: number | null = null;
  private then: number = 0;

  constructor({ loadManager }: { loadManager: THREE.LoadingManager }) {
    this.loadManager = loadManager;
  }

  async init() {
    await this.loadGLTF();
    this.transform();

    this.pedal = new CarPedal();
    this.speed = this.rpsToSpeed(this.pedal.rps);
    this.tireWheels = this.getCarTireWheels();
  }

  private async loadGLTF() {
    const loader = new GLTFLoader(this.loadManager);
    const gltf = await loader.loadAsync("/models/race_car/scene.gltf");
    this.root = gltf.scene;
  }

  private transform() {
    this.root.scale.set(0.015, 0.015, 0.015);

    const box = new THREE.Box3().setFromObject(this.root);
    const size = new THREE.Vector3();
    box.getSize(size);

    this.root.position.set(-size.z / 2, 0.001, 0.2);
    this.root.rotation.set(0, Math.PI / 2, 0);

    const frontLeftWheelRoot = this.root.getObjectByName("Empty001");
    const frontRightWheelRoot = this.root.getObjectByName("Empty002");
    if (frontLeftWheelRoot) {
      frontLeftWheelRoot.rotation.set(-Math.PI / 2, Math.PI / 2, Math.PI / 2);
    }
    if (frontRightWheelRoot) {
      frontRightWheelRoot.rotation.set(Math.PI / 2, -Math.PI / 2, -Math.PI / 2);
    }
  }

  private getCarTireWheels(): THREE.Object3D[] {
    const frontLeftWheel = this.root.getObjectByName(
      CAR_PART.frontLeftTireWheel,
    );
    const frontRightWheel = this.root.getObjectByName(
      CAR_PART.frontRightTireWheel,
    );
    const backLeftWheel = this.root.getObjectByName(CAR_PART.backLeftTireWheel);
    const backRightWheel = this.root.getObjectByName(
      CAR_PART.backRightTireWheel,
    );
    return [
      frontLeftWheel,
      frontRightWheel,
      backLeftWheel,
      backRightWheel,
    ].filter((obj) => !!obj);
  }

  private rotateTire(time: number) {
    time *= 0.001; // 단위: s
    const delta = time - this.then;
    this.then = time;

    this.tireWheels.forEach((wheel) => {
      wheel.rotation.x += THREE.MathUtils.degToRad(this.pedal.rps * delta);
    });
  }

  rpsToSpeed(rps: number): number {
    return THREE.MathUtils.degToRad(rps) * TIRE_RADIUS;
  }

  update(time: number) {
    if (this.pedal) {
      this.pedal.update(time);
      this.speed = this.rpsToSpeed(this.pedal.rps);
      this.rotateTire(time);
    }
  }
}

export default CarHelper;
