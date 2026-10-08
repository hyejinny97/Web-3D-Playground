import * as THREE from "three";
import BaseProject from "../BaseProject";
import { RenderLoop } from "@/decorators/renderLoop";
import type {
  DirectionKeyType,
  DirectionType,
  LoadingOptionsType,
} from "./MoveCharacterProject.types";
import type { ConstructorProps } from "@/types/project";
import Ground from "./helpers/Ground";
import Character from "./helpers/Character";
import { isDirectionKey } from "./MoveCharacterProject.utils";

type MoveCharacterProjectProps = ConstructorProps & {
  loadingOptions: LoadingOptionsType;
};

@RenderLoop()
class MoveCharacterProject extends BaseProject {
  private loadingOptions: LoadingOptionsType;
  private stopRender: boolean = false;
  private character!: Character;
  private handleKeyDown!: (event: KeyboardEvent) => void;
  private handleKeyUp!: (event: KeyboardEvent) => void;
  private handleBlur!: (event: FocusEvent) => void;

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

  setupLight() {
    const ambientLight = new THREE.AmbientLight("white", 2);
    const directionalLight = new THREE.DirectionalLight("white", 1);
    directionalLight.position.set(10, 10, 10);
    this.scene?.add(ambientLight);
    this.scene?.add(directionalLight);
  }

  async setupModel() {
    const loadingManager = this.createLoadingManager();
    const ground = new Ground();
    this.character = new Character({ loadingManager, camera: this.camera! });

    await this.character.init();
    if (this.stopRender) return;

    this.scene?.add(ground.root);
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
        if (isShiftKeyPressed) this.character.speed.changeTo("RUN");
        else this.character.speed.changeTo("WALK");
      } else {
        this.character.speed.changeTo("IDLE");
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
      if (!this.character.direction || !this.character.speed) return;
      const keyInLowerCase = event.key.toLowerCase();

      if (isDirectionKey(keyInLowerCase)) {
        pressedKeys.add(keyInLowerCase);
        rotateCharacter();
      } else if (keyInLowerCase === "shift") {
        isShiftKeyPressed = true;
      }
      moveCharacter();
    };

    this.handleKeyUp = (event: KeyboardEvent) => {
      if (!this.character.direction || !this.character.speed) return;
      const keyInLowerCase = event.key.toLowerCase();

      if (isDirectionKey(keyInLowerCase)) {
        pressedKeys.delete(keyInLowerCase);
        rotateCharacter();
      } else if (keyInLowerCase === "shift") {
        isShiftKeyPressed = false;
      }
      moveCharacter();
    };

    this.handleBlur = () => {
      pressedKeys.clear();
    };

    document.addEventListener("keydown", this.handleKeyDown);
    document.addEventListener("keyup", this.handleKeyUp);
    window.addEventListener("blur", this.handleBlur);
  }

  update(time: number) {
    this.character.update(time);
  }

  dispose() {
    super.dispose();
    document.removeEventListener("keydown", this.handleKeyDown);
    document.removeEventListener("keyup", this.handleKeyUp);
    window.removeEventListener("blur", this.handleBlur);
    this.stopRender = true;
  }
}

export default MoveCharacterProject;
