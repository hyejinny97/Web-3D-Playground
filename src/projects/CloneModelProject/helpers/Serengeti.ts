import * as THREE from "three";
import type {
  GrassTextureType,
  SerengetiType,
} from "../CloneModelProjec.types";
import { GRASS_TEXTURES, TREE_URL } from "../CloneModelProject.constants";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

class Serengeti implements SerengetiType {
  private loadingManager: THREE.LoadingManager;
  private grassTextures: Partial<Record<GrassTextureType, THREE.Texture>> = {};
  private tree!: THREE.Object3D;
  root: THREE.Object3D = new THREE.Object3D();

  constructor({ loadingManager }: { loadingManager: THREE.LoadingManager }) {
    this.loadingManager = loadingManager;
  }

  async init() {
    await Promise.allSettled([this.loadTextures(), this.loadModel()]);
    this.createGround();
    this.placeTree();
  }

  private async loadTextures() {
    const textures = Object.entries(GRASS_TEXTURES);
    const loader = new THREE.TextureLoader(this.loadingManager);
    Promise.allSettled(
      textures.map(async ([textureType, { url, colorSpace }]) => {
        const texture = await loader.loadAsync(url);
        texture.colorSpace = colorSpace;
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(5, 5);
        texture.needsUpdate = true;
        this.grassTextures[textureType as GrassTextureType] = texture;
      }),
    );
  }

  private async loadModel() {
    const loader = new GLTFLoader(this.loadingManager);
    const gltf = await loader.loadAsync(TREE_URL);
    this.tree = gltf.scene;
  }

  private createGround() {
    const geometry = new THREE.PlaneGeometry(5, 5, 100, 100);
    const material = new THREE.MeshStandardMaterial({
      aoMap: this.grassTextures.aoMap,
      displacementMap: this.grassTextures.displacementMap,
      map: this.grassTextures.map,
      normalMap: this.grassTextures.normalMap,
      roughnessMap: this.grassTextures.roughnessMap,
      displacementScale: 1,
      displacementBias: -0.3,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 2;
    this.root.add(mesh);
  }

  private placeTree() {
    this.tree.scale.set(0.2, 0.2, 0.2);
    this.tree.position.set(-1, 0, -1);
    this.root.add(this.tree);
  }
}

export default Serengeti;
