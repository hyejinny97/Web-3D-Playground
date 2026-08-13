import * as THREE from "three";
import { RenderLoop } from "@/decorators/renderLoop.ts";
import BaseProject from "@/projects/BaseProject";
import { FontLoader } from "three/examples/jsm/Addons.js";
import { FONT_URLS } from "./TextGeometryProject.constants";
import type { ConstructorProps } from "@/types/project";

type TextGeometryProjectProps = ConstructorProps & {
  loadStart: () => void;
  loading: (percent: number) => void;
  loadComplete: () => void;
};

@RenderLoop()
class TextGeometryProject extends BaseProject {
  private loadStart: TextGeometryProjectProps["loadStart"];
  private loading: TextGeometryProjectProps["loading"];
  private loadComplete: TextGeometryProjectProps["loadComplete"];

  constructor({
    canvasEl,
    controlUI,
    loadStart,
    loading,
    loadComplete,
  }: TextGeometryProjectProps) {
    super({ canvasEl, controlUI });
    this.loadStart = loadStart;
    this.loading = loading;
    this.loadComplete = loadComplete;
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

  async setupModel() {
    await this.loadFonts({
      onStart: () => {
        this.loadStart();
      },
      onProgress: (_, loaded, total) => {
        this.loading((loaded / total) * 100);
      },
      onLoad: () => {
        this.loadComplete();
      },
    });
  }

  loadFonts({
    onStart,
    onLoad,
    onProgress,
    onError,
  }: {
    onStart?: THREE.LoadingManager["onStart"];
    onLoad?: THREE.LoadingManager["onLoad"];
    onProgress?: THREE.LoadingManager["onProgress"];
    onError?: THREE.LoadingManager["onError"];
  }) {
    const manager = new THREE.LoadingManager(onLoad, onProgress, onError);
    manager.onStart = onStart;
    const loader = new FontLoader(manager);
    return Promise.allSettled(
      Object.entries(FONT_URLS).map(async ([name, url]) => {
        const font = await loader.loadAsync(url);
        return { name, font };
      }),
    ).then((results) =>
      results
        .filter((result) => result.status === "fulfilled")
        .map((result) => ({
          name: result.value.name,
          font: result.value.font,
        })),
    );
  }
}

export default TextGeometryProject;
