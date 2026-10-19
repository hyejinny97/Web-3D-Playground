import * as THREE from "three";
import type {
  ConcreteTextureType,
  GroundType,
} from "../FireCannonProject.types";
import { CONCRETE_TEXTURES, GROUND_SIZE } from "../FireCannonProject.constants";

class Ground implements GroundType {
  private loadingManager: THREE.LoadingManager;
  private textures: Partial<Record<ConcreteTextureType, THREE.Texture>> = {};
  root: THREE.Object3D | null = null;

  constructor({ loadingManager }: { loadingManager: THREE.LoadingManager }) {
    this.loadingManager = loadingManager;
  }

  async init() {
    await this.loadTextures();
    this.setupModel();
  }

  private async loadTextures() {
    const loader = new THREE.TextureLoader(this.loadingManager);
    await Promise.allSettled(
      Object.entries(CONCRETE_TEXTURES).map(
        async ([name, { url, colorSpace }]) => {
          const textureName = name as ConcreteTextureType;
          const texture = await loader.loadAsync(url);
          texture.colorSpace = colorSpace;
          texture.wrapS = THREE.MirroredRepeatWrapping;
          texture.wrapT = THREE.MirroredRepeatWrapping;
          texture.repeat.set(2, 2);
          this.textures[textureName] = texture;
        },
      ),
    );
  }

  private setupModel() {
    const geometry = new THREE.PlaneGeometry(
      GROUND_SIZE,
      GROUND_SIZE,
      128,
      128,
    );
    const material = new THREE.MeshStandardMaterial({
      ...this.textures,
      displacementBias: -0.25,
      displacementScale: 0.5,
      side: THREE.DoubleSide,
    });
    this.root = new THREE.Mesh(geometry, material);
    this.root.rotateX(-Math.PI / 2);
  }
}

export default Ground;
