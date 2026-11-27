import * as THREE from "three";
import type {
  GroundTextureType,
  GroundType,
} from "../WalkingStonePathProject.types";
import {
  GROUND_SIZE,
  GROUND_TEXTURES,
} from "../WalkingStonePathProject.constants";

class Ground implements GroundType {
  private loadingManager: THREE.LoadingManager;
  private textures: Partial<Record<GroundTextureType, THREE.Texture>> = {};
  model: THREE.Mesh | null = null;

  constructor({ loadingManager }: { loadingManager: THREE.LoadingManager }) {
    this.loadingManager = loadingManager;
  }

  async init() {
    await this.loadTextures();
    this.setupModel();
    this.transform();
  }

  private async loadTextures() {
    const textures = Object.entries(GROUND_TEXTURES);
    const loader = new THREE.TextureLoader(this.loadingManager);
    await Promise.allSettled(
      textures.map(async ([textureType, { url, colorSpace }]) => {
        const texture = await loader.loadAsync(url);
        texture.colorSpace = colorSpace;
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(GROUND_SIZE.width / 2, GROUND_SIZE.height / 2);
        texture.needsUpdate = true;
        this.textures[textureType as GroundTextureType] = texture;
      }),
    );
  }

  private setupModel() {
    const geometry = new THREE.PlaneGeometry(
      GROUND_SIZE.width,
      GROUND_SIZE.height,
      Math.pow(2, GROUND_SIZE.width),
      Math.pow(2, GROUND_SIZE.height),
    );
    const material = new THREE.MeshStandardMaterial({
      ...this.textures,
      displacementScale: 0.1,
      displacementBias: -0.1,
    });
    this.model = new THREE.Mesh(geometry, material);
  }

  private transform() {
    if (this.model) {
      this.model.rotateX(-Math.PI / 2);
    }
  }
}

export default Ground;
