import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

class BaseProject {
  canvasEl: HTMLCanvasElement;
  scene: THREE.Scene | undefined;
  camera: THREE.Camera | undefined;
  renderer: THREE.WebGLRenderer | undefined;
  mesh: THREE.Mesh | undefined;

  constructor(canvasEl: HTMLCanvasElement) {
    this.canvasEl = canvasEl;
    this.setupScene();
    this.setupModel();
    this.setupLight();
    this.setupCamera();
    this.setupControls();
    this.setupRenderer();
    this.renderer?.setAnimationLoop(this.render.bind(this));
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
    new OrbitControls(this.camera!, this.canvasEl);
  }

  render(time: number) {
    this.update(time);
    this.renderer?.render(this.scene!, this.camera!);
  }

  update(time: number) {
    time *= 0.001;

    if (this.mesh) {
      this.mesh.rotation.x = time;
      this.mesh.rotation.y = time;
    }
  }

  dispose() {
    // 애니메이션 루프 중단
    this.renderer?.setAnimationLoop(null);

    // scene 내 geometry / material / texture 정리
    this.disposeScene();

    // renderer 자체의 GPU 리소스(프로그램, 렌더 타겟 등) 정리
    this.renderer?.dispose();

    // 참조 해제
    this.scene = undefined;
    this.camera = undefined;
    this.renderer = undefined;
  }

  /**
   * material에 연결된 모든 Texture(map, normalMap 등)를 dispose
   */
  private disposeMaterial(material: THREE.Material) {
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
  private disposeScene() {
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
