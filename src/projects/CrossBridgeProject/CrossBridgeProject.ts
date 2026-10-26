import * as THREE from "three";
import * as CANNON from "cannon-es";
import type { ConstructorProps } from "@/types/project";
import BaseProject from "../BaseProject";
import { RenderLoop } from "@/decorators/renderLoop";
import type { LoadManagerType } from "./CrossBridgeProject.types";
import Bridge from "./helpers/Bridge";
import {
  BOARD_DEPTH,
  BOARD_WIDTH,
  BOARDS_CNT,
  GROUND_WIDTH,
  PHYSICS_TIMESTEP,
} from "./CrossBridgeProject.constants";
import Ground from "./helpers/Ground";
import { EARTH_GRAVITY } from "@/constants/gravity";
import Kiwi from "./helpers/Kiwi";
import Flamingo from "./helpers/Flamingo";

type CrossBridgeProjectProps = ConstructorProps & {
  loadManager: LoadManagerType;
};

@RenderLoop()
class CrossBridgeProject extends BaseProject {
  private loadManager: LoadManagerType;
  private stopRender = false;
  private physics!: CANNON.World;
  private bridge!: Bridge;
  private ground!: Ground;
  private kiwi!: Kiwi;
  private flamingo!: Flamingo;

  constructor({ canvasEl, loadManager }: CrossBridgeProjectProps) {
    super({ canvasEl });
    this.loadManager = loadManager;
    this.setupModel();
  }

  init() {
    this.setupRenderer();
    this.setupCamera();
    this.setupScene();
    this.setupLight();
    this.setupControls();
    this.setupResizeObserver();
  }

  setupCamera() {
    super.setupCamera();
    if (this.camera) {
      this.camera.position.set(
        0,
        5,
        BOARD_DEPTH / 2 +
          (BOARD_DEPTH / 2) *
            Math.sqrt((BOARDS_CNT / 2) * BOARD_WIDTH + GROUND_WIDTH),
      );
    }
  }

  async setupModel() {
    this.createPhysicsWorld();
    const loadingManager = this.generateLoadingManager();
    this.bridge = new Bridge({ loadingManager });
    this.ground = new Ground({ loadingManager });
    this.kiwi = new Kiwi({ loadingManager });
    this.flamingo = new Flamingo({ loadingManager, initialVisibility: false });

    await Promise.allSettled([
      this.bridge.init(),
      this.ground.init(),
      this.kiwi.init(),
      this.flamingo.init(),
    ]);
    if (this.stopRender) return;

    const models = [
      ...this.bridge.models,
      ...this.ground.models,
      this.kiwi.model!,
      this.flamingo.model!,
    ];
    const bodies = [
      ...this.bridge.bodies,
      ...this.ground.bodies,
      this.kiwi.body!,
      this.flamingo.body!,
    ];
    const constraints = [
      ...this.bridge.constraints,
      ...this.generateBridgeGroundConstraint(),
    ];
    const contactMaterials = this.generateContactMaterials();

    this.scene?.add(...models);
    bodies.forEach((body) => this.physics.addBody(body));
    constraints.forEach((constraint) => this.physics.addConstraint(constraint));
    contactMaterials.forEach((mat) => this.physics.addContactMaterial(mat));
    this.registerCollisionMasks();

    this.kiwi.crossing?.start();
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

  generateBridgeGroundConstraint(): CANNON.LockConstraint[] {
    const leftGround = this.ground.bodies[0];
    const rightGround = this.ground.bodies[1];
    const firstBoard = this.bridge.bodies[0];
    const lastBoard = this.bridge.bodies[BOARDS_CNT - 1];

    const leftConstraint = new CANNON.LockConstraint(leftGround, firstBoard, {
      maxForce: 1e8,
    });
    const rightConstraint = new CANNON.LockConstraint(rightGround, lastBoard, {
      maxForce: 1e8,
    });

    return [leftConstraint, rightConstraint];
  }

  generateContactMaterials(): CANNON.ContactMaterial[] {
    const contactMaterials: CANNON.ContactMaterial[] = [];
    const groundMaterial = this.ground?.bodies[0].material;
    const bridgeMaterial = this.bridge?.bodies[0].material;
    const characterMaterial = this.kiwi.body?.material;
    if (groundMaterial && characterMaterial) {
      const groundCharacterContact = new CANNON.ContactMaterial(
        groundMaterial,
        characterMaterial,
        {
          friction: 0.9,
          restitution: 0,
        },
      );
      contactMaterials.push(groundCharacterContact);
    }
    if (bridgeMaterial && characterMaterial) {
      const bridgeCharacterContact = new CANNON.ContactMaterial(
        bridgeMaterial,
        characterMaterial,
        {
          friction: 0.8,
          restitution: 0,
        },
      );
      contactMaterials.push(bridgeCharacterContact);
    }
    return contactMaterials;
  }

  registerCollisionMasks() {
    const GROUP_BOARD = 1;
    const GROUP_CHARACTER = 2;
    const GROUP_GROUND = 4;

    this.ground.bodies.forEach((body) => {
      body.collisionFilterGroup = GROUP_GROUND;
      body.collisionFilterMask = GROUP_CHARACTER;
    });

    this.bridge.bodies.forEach((body) => {
      body.collisionFilterGroup = GROUP_BOARD;
      body.collisionFilterMask = GROUP_CHARACTER;
    });

    const characters = [this.kiwi.body, this.flamingo.body].filter(
      (el) => el !== null,
    );
    characters.forEach((character) => {
      character.collisionFilterGroup = GROUP_CHARACTER;
      character.collisionFilterMask = GROUP_BOARD | GROUP_GROUND;
    });
  }

  update(time: number) {
    this.physics.step(PHYSICS_TIMESTEP);
    this.bridge.update();
    this.ground.update();
    this.kiwi.update(time, () => {
      this.kiwi.invisible();
      this.flamingo.visible();
      this.flamingo.crossing?.start();
      this.kiwi.crossing?.init();
    });
    this.flamingo.update(time, () => {
      this.flamingo.invisible();
      this.kiwi.visible();
      this.kiwi.crossing?.start();
      this.flamingo.crossing?.init();
    });
  }

  dispose() {
    super.dispose();
    this.stopRender = true;
  }
}

export default CrossBridgeProject;
