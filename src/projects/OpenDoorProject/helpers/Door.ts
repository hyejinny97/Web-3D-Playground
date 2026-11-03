import * as THREE from "three";
import * as CANNON from "cannon-es";
import type { DoorInfoType, DoorType } from "../OpenDoorProject.types";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { BODY_NAMES, DOOR_OBJET_NAMES } from "../OpenDoorProject.constants";

class Door implements DoorType {
  private loadingManager: THREE.LoadingManager;
  private info: DoorInfoType = {};
  model: THREE.Object3D | null = null;
  bodies: CANNON.Body[] = [];
  constraint: CANNON.HingeConstraint | null = null;

  constructor({ loadingManager }: { loadingManager: THREE.LoadingManager }) {
    this.loadingManager = loadingManager;
  }

  async init() {
    await this.loadGLTF();
    this.centralizeModel();
    this.setupInfo();
    this.setupBody();
    this.setupConstraint();
  }

  private async loadGLTF() {
    const loader = new GLTFLoader(this.loadingManager);
    const gltf = await loader.loadAsync("/models/door.glb");
    this.model = gltf.scene;
  }

  private centralizeModel() {
    if (this.model) {
      const doorObj = this.findObject(
        this.model,
        DOOR_OBJET_NAMES.originalDoor,
      );
      const doorParentObj = doorObj.parent;

      const newDoorObj = new THREE.Object3D();
      newDoorObj.add(doorObj);
      newDoorObj.name = DOOR_OBJET_NAMES.newDoor;

      doorParentObj?.remove(doorObj);
      doorParentObj?.add(newDoorObj);

      const box = new THREE.Box3().setFromObject(this.model);
      const center = box.getCenter(new THREE.Vector3());
      this.model.position.sub(center);
    }
  }

  private setupInfo() {
    const doorObj = this.findObject(this.model!, DOOR_OBJET_NAMES.newDoor);
    const boardObj = this.findObject(this.model!, DOOR_OBJET_NAMES.board);
    const frameObj = this.findObject(this.model!, DOOR_OBJET_NAMES.frame);
    const doorBox = this.getBoundingBox(doorObj);
    const boardBox = this.getBoundingBox(boardObj);
    const frameBox = this.getBoundingBox(frameObj);
    const doorSize = this.getBoxSize(doorBox);
    const boardSize = this.getBoxSize(boardBox);
    const frameSize = this.getBoxSize(frameBox);
    this.info = {
      ...this.info,
      doorObj,
      doorBox,
      boardBox,
      doorSize,
      boardSize,
      frameSize,
    };
  }

  private setupBody() {
    const { doorSize, doorBox, boardBox, boardSize, frameSize } = this.info;
    if (!doorSize || !doorBox || !boardBox || !boardSize || !frameSize) {
      throw new Error(
        "doorSize, doorBox, boardBox, boardSize, frameSize를 찾을 수 없습니다.",
      );
    }

    const doorShape = new CANNON.Box(
      new CANNON.Vec3(doorSize.x / 2, doorSize.y / 2, doorSize.z / 2),
    );
    const doorMaterial = new CANNON.Material("door");
    const doorBody = new CANNON.Body({
      mass: 10,
      shape: doorShape,
      material: doorMaterial,
    });

    const hingeShape = new CANNON.Particle();
    const hingeBody = new CANNON.Body({
      mass: 0,
      shape: hingeShape,
      position: new CANNON.Vec3(doorBox.min.x, doorBox.max.y, boardBox.min.z),
    });

    const frameShape = new CANNON.Box(
      new CANNON.Vec3(
        (frameSize.x - boardSize.x) / 4,
        frameSize.y / 2,
        frameSize.z / 2,
      ),
    );
    const frameMaterial = new CANNON.Material("frame");
    const frameBody = new CANNON.Body({
      mass: 0,
      shape: frameShape,
      material: frameMaterial,
      position: new CANNON.Vec3(
        -(frameSize.x + boardSize.x) / 4 - 0.01,
        0,
        0.04,
      ),
    });

    doorBody.name = BODY_NAMES.door;
    hingeBody.name = BODY_NAMES.hinge;
    frameBody.name = BODY_NAMES.frame;

    this.bodies.push(hingeBody, doorBody, frameBody);
    this.info = { ...this.info, doorBody, hingeBody };
  }

  private setupConstraint() {
    const { hingeBody, doorBody, doorBox, boardBox } = this.info;
    if (!hingeBody || !doorBody || !doorBox || !boardBox) {
      throw new Error(
        "hingeBody, doorBody, doorBox, boardBox를 찾을 수 없습니다.",
      );
    }

    this.constraint = new CANNON.HingeConstraint(hingeBody, doorBody, {
      pivotA: new CANNON.Vec3(0, 0, 0),
      axisA: new CANNON.Vec3(0, 1, 0),
      pivotB: new CANNON.Vec3(doorBox.min.x, doorBox.max.y, boardBox.min.z),
      axisB: new CANNON.Vec3(0, 1, 0),
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

  private getBoxSize(box: THREE.Box3): THREE.Vector3 {
    return box.getSize(new THREE.Vector3());
  }

  update() {
    const { doorObj, doorBody } = this.info;
    if (!this.model) return;
    if (!doorObj || !doorBody) return;

    doorObj.position.copy(doorBody.position);
    doorObj.quaternion.copy(doorBody.quaternion);
  }
}

export default Door;
