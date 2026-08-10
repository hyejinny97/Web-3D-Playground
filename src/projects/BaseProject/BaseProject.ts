import * as THREE from "three";
import type { ConstructorProps, Project } from "@/types/project";
import { OrbitControls } from "three/examples/jsm/Addons.js";

class BaseProject implements Project {
  canvasEl: HTMLCanvasElement;
  scene: THREE.Scene | undefined;
  camera: THREE.PerspectiveCamera | undefined;
  renderer: THREE.WebGLRenderer | undefined;
  mesh: THREE.Mesh | undefined;
  controls: OrbitControls | undefined;
  resizeObserver: ResizeObserver | undefined;
  controlUI: ConstructorProps["controlUI"];

  constructor({ canvasEl, controlUI }: ConstructorProps) {
    this.canvasEl = canvasEl;
    this.controlUI = controlUI;
    this.init();
  }

  init() {
    this.setupRenderer();
    this.setupCamera();
    this.setupScene();
    this.setupLight();
    this.setupModel();
    this.setupControls();
    this.setupResizeObserver();
  }

  setupScene() {
    this.scene = new THREE.Scene();
  }

  setupCamera() {
    const width = this.canvasEl.clientWidth;
    const height = this.canvasEl.clientHeight;
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
    this.camera.position.z = 3;
  }

  setupRenderer() {
    const width = this.canvasEl.clientWidth;
    const height = this.canvasEl.clientHeight;
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvasEl });
    this.renderer.setSize(width, height, false);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  setupLight() {
    const ambientLight = new THREE.AmbientLight("white", 0.3);
    const directionalLight = new THREE.DirectionalLight("white", 1);
    directionalLight.position.set(2, 2, 2);
    this.scene?.add(ambientLight);
    this.scene?.add(directionalLight);
  }

  setupModel() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshPhongMaterial({ color: "blue" });
    this.mesh = new THREE.Mesh(geometry, material);
    this.scene?.add(this.mesh);
  }

  setupControls() {
    this.controls = new OrbitControls(this.camera!, this.canvasEl);
  }

  setupResizeObserver() {
    // handleResizeEvent 함수를 한 프레임 당 한 번만 실행
    let rafId: number | null = null;
    this.resizeObserver = new ResizeObserver(() => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        this.handleResizeEvent();
        rafId = null;
      });
    });
    this.resizeObserver.observe(this.canvasEl);
  }

  handleResizeEvent() {
    const width = this.canvasEl.clientWidth;
    const height = this.canvasEl.clientHeight;
    if (width === 0 || height === 0) return;

    if (this.camera) {
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    }
    this.renderer?.setSize(width, height, false);
    this.render();
  }

  render(time?: number) {
    this.update(time ?? performance.now());
    this.renderer?.render(this.scene!, this.camera!);
  }

  renderLoop() {
    this.renderer?.setAnimationLoop(this.render.bind(this));
  }

  update(time: number) {
    void time;
  }

  stopLoop() {
    this.renderer?.setAnimationLoop(null);
  }

  dispose() {
    // 애니메이션 루프 중단
    this.renderer?.setAnimationLoop(null);

    // scene 내 geometry / material / texture 정리
    this.disposeScene();

    // renderer 자체의 GPU 리소스(프로그램, 렌더 타겟 등) 정리
    this.renderer?.dispose();

    // control 정리
    this.controls?.dispose();

    // Observer 연결 해제
    this.resizeObserver?.disconnect();

    // 참조 해제
    this.scene = undefined;
    this.camera = undefined;
    this.renderer = undefined;
    this.controls = undefined;

    // Control UI 제거
    this.controlUI?.clearAll();
  }

  /**
   * material에 연결된 모든 Texture(map, normalMap 등)를 dispose
   */
  disposeMaterial(material: THREE.Material) {
    Object.values(material).forEach((value) => {
      if (value instanceof THREE.Texture) {
        value.dispose();
      }
    });
    material.dispose();
  }

  /**
   * scene 전체를 순회하며 geometry, material, texture를 dispose
   */
  disposeScene() {
    if (!this.scene) return;

    this.scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.geometry?.dispose();

        if (Array.isArray(object.material)) {
          object.material.forEach((mat) => this.disposeMaterial(mat));
        } else if (object.material) {
          this.disposeMaterial(object.material);
        }
      }
    });

    this.scene.clear(); // scene의 자식 참조 정리
  }
}

export default BaseProject;
