import * as THREE from "three";
import * as CANNON from "cannon-es";
import BaseProject from "../BaseProject";
import { RenderLoop } from "@/decorators/renderLoop";
import Floor from "./helpers/Floor";
import Doll from "./helpers/Doll";
import { EARTH_GRAVITY } from "@/constants/gravity";
import { PHYSICS_TIMESTEP } from "../FireCannonProject/FireCannonProject.constants";
import type { ConstructorProps } from "@/types/project";
import Marker from "./helpers/Marker";
import MovementPlane from "./helpers/MovementPlane";

@RenderLoop()
class GrabDollProject extends BaseProject {
  private physics!: CANNON.World;
  private floor!: Floor;
  private doll!: Doll;
  private marker!: Marker;
  private movementPlane!: MovementPlane;
  private raycaster = new THREE.Raycaster();
  declare private handlePointerDown: (event: PointerEvent) => void;
  declare private handlePointerMove: (event: PointerEvent) => void;
  declare private handlePointerUp: (event: PointerEvent) => void;
  declare private handlePointerCancel: (event: PointerEvent) => void;
  private joint: CANNON.PointToPointConstraint | null = null;

  constructor(props: ConstructorProps) {
    super(props);
    this.setupModel();
    this.setupEvent();
  }

  init() {
    this.setupRenderer();
    this.setupCamera();
    this.setupScene();
    this.setupLight();
    this.setupResizeObserver();
  }

  setupCamera() {
    super.setupCamera();
    if (this.camera) {
      this.camera.position.set(0, 1, 3);
    }
  }

  setupModel() {
    this.createPhysicsWorld();
    this.floor = new Floor();
    this.doll = new Doll();
    this.marker = new Marker();
    this.movementPlane = new MovementPlane({ camera: this.camera! });

    const models = [
      this.floor.model!,
      this.doll.model!,
      this.marker.model!,
      this.movementPlane.model,
    ];
    const bodies = [this.floor.body!, this.doll.body!, this.marker.body!];

    models.forEach((model) => this.scene?.add(model));
    bodies.forEach((body) => this.physics.addBody(body));
  }

  createPhysicsWorld() {
    this.physics = new CANNON.World({
      gravity: new CANNON.Vec3(0, EARTH_GRAVITY, 0),
    });
  }

  setupEvent() {
    let isDragged = false;

    this.handlePointerDown = (event: PointerEvent) => {
      if (!this.doll.model) return;

      const hitPoint = this.getHitPoint(event, this.doll.model);
      if (!hitPoint) return;

      this.movementPlane.locateAt(hitPoint);
      this.marker.locateAt(hitPoint);
      this.marker.show();
      this.addJoint(hitPoint);
      isDragged = true;
    };
    this.handlePointerMove = (event: PointerEvent) => {
      if (!isDragged) return;

      const hitPoint = this.getHitPoint(event, this.movementPlane.model);
      if (!hitPoint) return;

      this.movementPlane.locateAt(hitPoint);
      this.marker.locateAt(hitPoint);
      this.updateJoint();
    };
    this.handlePointerUp = () => {};
    this.handlePointerCancel = () => {};

    this.canvasEl.addEventListener("pointerdown", this.handlePointerDown);
    this.canvasEl.addEventListener("pointermove", this.handlePointerMove);
    this.canvasEl.addEventListener("pointerup", this.handlePointerUp);
    this.canvasEl.addEventListener("pointercancel", this.handlePointerCancel);
  }

  getHitPoint(
    event: PointerEvent,
    ...targets: [THREE.Object3D, ...THREE.Object3D[]]
  ): THREE.Vector3 | undefined {
    const x = (event.clientX / this.canvasEl.clientWidth) * 2 - 1;
    const y = -(event.clientY / this.canvasEl.clientHeight) * 2 + 1;
    const mouse = new THREE.Vector2(x, y);

    this.raycaster.setFromCamera(mouse, this.camera!);
    const intersects = this.raycaster.intersectObjects(targets);

    return intersects.length > 0 ? intersects[0].point : undefined;
  }

  addJoint(hitPoint: THREE.Vector3) {
    if (!this.doll.body || !this.marker.body) return;

    // world 좌표를 doll의 local 좌표로 변환
    const bodyToHitPoint = new CANNON.Vec3(
      hitPoint.x,
      hitPoint.y,
      hitPoint.z,
    ).vsub(this.doll.body.position);
    const antiRotation = this.doll.body.quaternion.inverse();
    const dollPivot = antiRotation.vmult(bodyToHitPoint);

    // marker와 doll 사이 joint 생성
    this.joint = new CANNON.PointToPointConstraint(
      this.doll.body,
      dollPivot,
      this.marker.body,
      new CANNON.Vec3(0, 0, 0),
    );
    this.physics.addConstraint(this.joint);
  }

  updateJoint() {
    this.joint?.update();
  }

  update() {
    this.physics.step(PHYSICS_TIMESTEP);
    this.floor.update();
    this.doll.update();
    this.marker.update();
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
    this.canvasEl.removeEventListener("pointerdown", this.handlePointerDown);
    this.canvasEl.removeEventListener("pointermove", this.handlePointerMove);
    this.canvasEl.removeEventListener("pointerup", this.handlePointerUp);
    this.canvasEl.removeEventListener(
      "pointercancel",
      this.handlePointerCancel,
    );
  }
}

export default GrabDollProject;
