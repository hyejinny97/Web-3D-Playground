import * as THREE from "three";
import BaseProject from "../BaseProject";
import { RenderLoop } from "@/decorators/renderLoop";
import type {
  AnimationNameType,
  LoadingOptionsType,
} from "./AnimatedModelProject.types";
import type { ConstructorProps } from "@/types/project";
import Person from "./helpers/Person";

type AnimatedModelProjectProps = ConstructorProps & {
  loadingOptions: LoadingOptionsType;
};

@RenderLoop()
class AnimatedModelProject extends BaseProject {
  private loadingOptions: LoadingOptionsType;
  private stopRender: boolean = false;
  private person!: Person;

  constructor({ canvasEl, loadingOptions }: AnimatedModelProjectProps) {
    super({ canvasEl });
    this.loadingOptions = loadingOptions;
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

  setupLight() {
    const ambientLight = new THREE.AmbientLight("white", 1);
    const directionalLight = new THREE.DirectionalLight("white", 2);
    directionalLight.position.set(2, 2, 2);
    this.scene?.add(ambientLight);
    this.scene?.add(directionalLight);
  }

  async setupModel() {
    this.person = new Person({ loadingOptions: this.loadingOptions });
    await this.person.init();
    if (this.stopRender) return;

    this.scene?.add(this.person.root);
  }

  changeAnimation(name: AnimationNameType) {
    this.person.animation.play({ name });
  }

  update(time: number) {
    this.person?.update(time);
  }

  dispose() {
    super.dispose();
    this.stopRender = true;
  }
}

export default AnimatedModelProject;
