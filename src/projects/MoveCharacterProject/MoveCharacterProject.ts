import * as THREE from "three";
import BaseProject from "../BaseProject";
import { RenderLoop } from "@/decorators/renderLoop";
import type {
  DirectionKeyType,
  DirectionType,
  LoadingOptionsType,
} from "./MoveCharacterProject.types";
import type { ConstructorProps } from "@/types/project";
import InfiniteGround from "./helpers/InfiniteGround";
import Character from "./helpers/Character";
import { isDirectionKey } from "./MoveCharacterProject.utils";
import { DISTANCE_FROM_CHARACTER } from "./MoveCharacterProject.constants";

type MoveCharacterProjectProps = ConstructorProps & {
  loadingOptions: LoadingOptionsType;
};

@RenderLoop()
class MoveCharacterProject extends BaseProject {
  private loadingOptions: LoadingOptionsType;
  private stopRender: boolean = false;
  private ground!: InfiniteGround;
  private character!: Character;
  private handleKeyDown!: (event: KeyboardEvent) => void;
  private handleKeyUp!: (event: KeyboardEvent) => void;
  private handleBlur!: (event: FocusEvent) => void;
  private distance = new THREE.Vector3();
  private positionFromCharacter = new THREE.Vector3();

  constructor({ canvasEl, loadingOptions }: MoveCharacterProjectProps) {
    super({ canvasEl });
    this.loadingOptions = loadingOptions;
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

  setupCamera() {
    super.setupCamera();
    if (this.camera) {
      this.camera.position.set(0, 3, 5);
    }
  }

  setupControls() {
    super.setupControls();
    if (this.controls) {
      this.controls.enablePan = false;
      this.controls.minDistance = 5;
      this.controls.maxDistance = 15;
      this.controls.maxPolarAngle = Math.PI / 2 - 0.05;
      this.controls.update();
    }
  }

  setupLight() {
    const ambientLight = new THREE.AmbientLight("white", 2);
    const directionalLight = new THREE.DirectionalLight("white", 1);
    directionalLight.position.set(10, 10, 10);
    this.scene?.add(ambientLight);
    this.scene?.add(directionalLight);
  }

  setupScene() {
    super.setupScene();
    if (this.scene) {
      this.scene.fog = new THREE.Fog(0x000000, 10, 20);
    }
  }

  async setupModel() {
    const loadingManager = this.createLoadingManager();
    this.ground = new InfiniteGround({ camera: this.camera! });
    this.character = new Character({ loadingManager, camera: this.camera! });

    await this.character.init();
    if (this.stopRender) return;

    this.scene?.add(this.ground.root);
    this.scene?.add(this.character.root);
  }

  createLoadingManager(): THREE.LoadingManager {
    const { onStart, onProgress, onLoad } = this.loadingOptions;
    const manager = new THREE.LoadingManager(
      onLoad,
      (_: string, loaded: number, total: number) => onProgress(loaded, total),
    );
    manager.onStart = onStart;
    return manager;
  }

  setupEvent() {
    const pressedKeys = new Set<DirectionKeyType>();
    let isShiftKeyPressed: boolean = false;

    const moveCharacter = () => {
      if (pressedKeys.size > 0) {
        if (isShiftKeyPressed) this.character.run();
        else this.character.walk();
      } else {
        this.character.idle();
      }
    };

    const rotateCharacter = () => {
      let newDirection: DirectionType = this.character.direction.value;
      if (pressedKeys.has("w")) {
        if (pressedKeys.has("a")) newDirection = "WA";
        else if (pressedKeys.has("d")) newDirection = "WD";
        else newDirection = "W";
      } else if (pressedKeys.has("s")) {
        if (pressedKeys.has("a")) newDirection = "SA";
        else if (pressedKeys.has("d")) newDirection = "SD";
        else newDirection = "S";
      } else if (pressedKeys.has("a")) {
        newDirection = "A";
      } else if (pressedKeys.has("d")) {
        newDirection = "D";
      }
      this.character.direction.changeTo(newDirection);
    };

    this.handleKeyDown = (event: KeyboardEvent) => {
      if (!this.character.direction) return;
      const keyInLowerCase = event.key.toLowerCase();

      if (isDirectionKey(keyInLowerCase)) {
        pressedKeys.add(keyInLowerCase);
        rotateCharacter();
        moveCharacter();
      } else if (keyInLowerCase === "shift") {
        isShiftKeyPressed = true;
        moveCharacter();
      } else if (keyInLowerCase === " ") {
        this.character.jump();
      }
    };

    this.handleKeyUp = (event: KeyboardEvent) => {
      if (!this.character.direction) return;
      const keyInLowerCase = event.key.toLowerCase();

      if (isDirectionKey(keyInLowerCase)) {
        pressedKeys.delete(keyInLowerCase);
        rotateCharacter();
        moveCharacter();
      } else if (keyInLowerCase === "shift") {
        isShiftKeyPressed = false;
        moveCharacter();
      }
    };

    this.handleBlur = () => {
      pressedKeys.clear();
    };

    document.addEventListener("keydown", this.handleKeyDown);
    document.addEventListener("keyup", this.handleKeyUp);
    window.addEventListener("blur", this.handleBlur);
  }

  followCharacter() {
    if (this.camera && this.controls && this.character.root) {
      this.camera.getWorldDirection(this.distance);
      this.distance.y = 0;
      this.distance.normalize();
      this.distance.negate();

      this.distance.multiplyScalar(DISTANCE_FROM_CHARACTER);
      this.distance.y = 0.5;

      this.positionFromCharacter
        .copy(this.character.root.position)
        .add(this.distance);
      this.camera.position.copy(this.positionFromCharacter);
      this.controls.target.set(
        this.character.root.position.x,
        this.character.root.position.y,
        this.character.root.position.z,
      );
      this.controls.update();
    }
  }

  update(time: number) {
    this.ground.update();
    this.character.update(time);
    this.followCharacter();
  }

  dispose() {
    super.dispose();
    this.character?.dispose();
    document.removeEventListener("keydown", this.handleKeyDown);
    document.removeEventListener("keyup", this.handleKeyUp);
    window.removeEventListener("blur", this.handleBlur);
    this.stopRender = true;
  }
}

export default MoveCharacterProject;
