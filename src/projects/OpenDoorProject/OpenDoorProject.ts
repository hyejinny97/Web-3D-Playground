import * as THREE from "three";
import * as CANNON from "cannon-es";
import type { ConstructorProps } from "@/types/project";
import BaseProject from "../BaseProject";
import { RenderLoop } from "@/decorators/renderLoop";
import type { LoadManagerType } from "./OpenDoorProject.types";
import { EARTH_GRAVITY } from "@/constants/gravity";
import Door from "./helpers/Door";
import { PHYSICS_TIMESTEP } from "../FireCannonProject/FireCannonProject.constants";
import {
  BODY_NAMES,
  DOOR_OBJET_NAMES,
  PRESS_FORCE,
} from "./OpenDoorProject.constants";
import Point from "./helpers/Point";

type OpenDoorProjectProps = ConstructorProps & {
  loadManager: LoadManagerType;
};

@RenderLoop()
class OpenDoorProject extends BaseProject {
  private loadManager: LoadManagerType;
  private stopRender = false;
  private physics!: CANNON.World;
  private door!: Door;
  private point!: Point;
  declare private handlePointDown: (event: PointerEvent) => void;
  declare private handlePointMove: (event: PointerEvent) => void;
  declare private handlePointUp: (event: PointerEvent) => void;
  declare private handlePointCancel: (event: PointerEvent) => void;
  private pressedPoint: THREE.Vector3 | null = null;
  private pressedForce: THREE.Vector3 | null = null;

  constructor({ canvasEl, loadManager }: OpenDoorProjectProps) {
    super({ canvasEl });
    this.loadManager = loadManager;
    this.setupModel();
    this.setupEvent();
  }

  init() {
    this.setupRenderer();
    this.setupCamera();
    this.setupScene();
    this.setupLight();
    this.setupControls();
    this.setupResizeObserver();
  }

  async setupModel() {
    this.createPhysicsWorld();
    const loadingManager = this.generateLoadingManager();
    this.door = new Door({ loadingManager });
    this.point = new Point();

    await this.door.init();
    if (this.stopRender) return;

    const models = [this.door.model!, this.point.model];
    const contactMaterial = this.generateContactMaterial();

    models.forEach((model) => this.scene?.add(model));
    this.door.bodies.forEach((body) => this.physics.addBody(body));
    if (this.door.constraint) this.physics.addConstraint(this.door.constraint);
    if (contactMaterial) this.physics.addContactMaterial(contactMaterial);
  }

  generateLoadingManager(): THREE.LoadingManager {
    const { onStart, onProgress, onLoad } = this.loadManager;
    const manager = new THREE.LoadingManager(
      onLoad,
      (_: string, loaded: number, total: number) => onProgress(loaded, total),
    );
    manager.onStart = onStart;
    return manager;
  }

  createPhysicsWorld() {
    this.physics = new CANNON.World({
      gravity: new CANNON.Vec3(0, EARTH_GRAVITY, 0),
    });
  }

  generateContactMaterial(): CANNON.ContactMaterial | undefined {
    const doorBody = this.door.bodies.find(
      (body) => body.name === BODY_NAMES.door,
    );
    const frameBody = this.door.bodies.find(
      (body) => body.name === BODY_NAMES.frame,
    );
    if (doorBody && frameBody && doorBody.material && frameBody.material) {
      return new CANNON.ContactMaterial(doorBody.material, frameBody.material, {
        friction: 0.8,
        restitution: 0,
      });
    }
  }

  setupEvent() {
    const raycaster = new THREE.Raycaster();
    let isPressed = false;

    const reset = () => {
      this.pressedPoint = null;
      this.pressedForce = null;
      this.point.hide();
    };
    const ray = (event: PointerEvent) => {
      if (!this.door.model) return;

      const x = (event.clientX / this.canvasEl.clientWidth) * 2 - 1;
      const y = -(event.clientY / this.canvasEl.clientHeight) * 2 + 1;
      const clickedPosition = new THREE.Vector2(x, y);

      raycaster.setFromCamera(clickedPosition, this.camera!);
      const intersects = raycaster.intersectObjects([this.door.model]);

      if (intersects.length > 0) {
        const hit = intersects[0];
        if (!this.isInDoorObject(hit.object)) {
          reset();
          return;
        }

        this.pressedPoint = hit.point;
        const normal = hit.face?.normal.clone();
        if (normal) {
          const normalMatrix = new THREE.Matrix3().getNormalMatrix(
            hit.object.matrixWorld,
          );
          normal.applyNormalMatrix(normalMatrix).normalize();
        }

        if (isPressed) {
          const rayDirection = raycaster.ray.direction;
          this.pressedForce = rayDirection.clone().multiplyScalar(PRESS_FORCE);
          if (normal) this.point.displayHigh(this.pressedPoint, normal);
        } else {
          if (normal) this.point.displayLow(this.pressedPoint, normal);
        }
      } else {
        reset();
      }
    };

    this.handlePointDown = (event: PointerEvent) => {
      isPressed = true;
      ray(event);
    };
    this.handlePointMove = (event: PointerEvent) => {
      ray(event);
    };
    this.handlePointUp = () => {
      isPressed = false;
      reset();
    };
    this.handlePointCancel = () => {
      isPressed = false;
      reset();
    };

    this.canvasEl.addEventListener("pointerdown", this.handlePointDown);
    this.canvasEl.addEventListener("pointermove", this.handlePointMove);
    this.canvasEl.addEventListener("pointerup", this.handlePointUp);
    this.canvasEl.addEventListener("pointercancel", this.handlePointCancel);
  }

  isInDoorObject(obj: THREE.Object3D): boolean {
    if (obj.name === DOOR_OBJET_NAMES.newDoor) return true;

    let isChild = false;
    obj.traverseAncestors((ancestor) => {
      if (ancestor.name === DOOR_OBJET_NAMES.newDoor) {
        isChild = true;
      }
    });
    return isChild;
  }

  update() {
    this.physics.step(PHYSICS_TIMESTEP);
    this.door.update();

    const doorBody = this.door.bodies.find(
      (body) => body.name === BODY_NAMES.door,
    );
    if (doorBody && this.pressedPoint && this.pressedForce) {
      const force = new CANNON.Vec3(
        this.pressedForce.x,
        this.pressedForce.y,
        this.pressedForce.z,
      );
      const relativePoint = new CANNON.Vec3(
        this.pressedPoint.x,
        this.pressedPoint.y,
        this.pressedPoint.z,
      );
      doorBody.applyForce(force, relativePoint);
    }
  }

  disposePhysics() {
    this.physics.bodies.forEach((body) => this.physics.removeBody(body));
    this.physics.contactmaterials = [];
    this.physics.constraints = [];
    this.physics.frictionEquations = [];
  }

  dispose() {
    super.dispose();
    this.disposePhysics();
    this.stopRender = true;
    this.canvasEl.removeEventListener("pointerdown", this.handlePointDown);
    this.canvasEl.removeEventListener("pointermove", this.handlePointMove);
    this.canvasEl.removeEventListener("pointerup", this.handlePointUp);
    this.canvasEl.removeEventListener("pointercancel", this.handlePointCancel);
  }
}

export default OpenDoorProject;
