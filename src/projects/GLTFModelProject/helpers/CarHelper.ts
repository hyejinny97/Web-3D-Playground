import * as THREE from "three";
import type { CarHelperType, LoadManagerType } from "../GLTFModelProject.types";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { CAR_PART } from "../GLTFModelProject.constants";
import CarGear from "./CarGear";
import CarPedal from "./CarPedal";
import CarLamps from "./CarLamps";
import CarSteeringWheel from "./CarSteeringWheel";

class CarHelper implements CarHelperType {
  declare root: THREE.Object3D;
  declare gear: CarGear;
  declare pedal: CarPedal;
  declare steeringWheel: CarSteeringWheel;
  declare frontLamps: CarLamps;
  declare private backLamps: CarLamps;
  loadManager: LoadManagerType;

  constructor({ loadManager }: { loadManager: LoadManagerType }) {
    this.loadManager = loadManager;
  }

  async init() {
    await this.loadGLTF();

    const tireWheels = this.getCarTireWheels();
    const steeringWheel = this.root.getObjectByName(CAR_PART.steeringWheel);

    this.initCarLamps();
    this.pedal = new CarPedal({ backLamps: this.backLamps });
    this.gear = new CarGear({ pedal: this.pedal, tireWheels: tireWheels });
    if (steeringWheel) {
      this.steeringWheel = new CarSteeringWheel({
        steeringWheel: steeringWheel,
        tireWheels: tireWheels,
      });
    }
  }

  async loadGLTF() {
    const { onStart, onProgress, onLoad } = this.loadManager;
    const manager = new THREE.LoadingManager(
      onLoad,
      (_: string, loaded: number, total: number) => onProgress(loaded, total),
    );
    manager.onStart = onStart;

    const loader = new GLTFLoader(manager);
    const gltf = await loader.loadAsync("/models/car/car.gltf");
    this.root = gltf.scene;
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

  private initCarLamps() {
    const frontLamps = this.root.getObjectByName(CAR_PART.frontLamps);
    const backLamps = this.root.getObjectByName(CAR_PART.backLamps);
    if (frontLamps && frontLamps instanceof THREE.Mesh) {
      this.frontLamps = new CarLamps({
        lamps: frontLamps,
        lightColor: new THREE.Color(0xffffff),
      });
    }
    if (backLamps && backLamps instanceof THREE.Mesh) {
      this.backLamps = new CarLamps({
        lamps: backLamps,
        lightColor: new THREE.Color(0xff0000),
      });
    }
  }

  update(time: number) {
    this.pedal?.update(time);
    this.gear?.update(time);
    this.steeringWheel?.update(time);
  }
}

export default CarHelper;
