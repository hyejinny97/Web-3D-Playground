import * as THREE from "three";
import type {
  ConcreteTextureType,
  GroundType,
} from "../FireCannonProject.types";
import {
  CONCRETE_TEXTURES,
  GROUND_HEIGHT,
  GROUND_WIDTH,
} from "../FireCannonProject.constants";

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
    this.transform();
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
          texture.repeat.set(10, 5);
          this.textures[textureName] = texture;
        },
      ),
    );
  }

  private setupModel() {
    const geometry = new THREE.PlaneGeometry(
      GROUND_WIDTH,
      GROUND_HEIGHT,
      150,
      150,
    );
    const material = new THREE.MeshStandardMaterial({
      ...this.textures,
      displacementBias: -0.25,
      displacementScale: 0.5,
      side: THREE.DoubleSide,
    });
    this.root = new THREE.Mesh(geometry, material);
  }

  private transform() {
    this.root?.rotateX(-Math.PI / 2);
  }
}

export default Ground;
