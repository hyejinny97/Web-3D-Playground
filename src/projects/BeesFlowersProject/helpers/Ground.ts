import * as THREE from "three";
import type { GrassTextureType, GroundType } from "../BeesFlowersProject.types";
import { GRASS_TEXTURES, GROUND_SIZE } from "../BeesFlowersProject.constants";

class Ground implements GroundType {
  private loadingManager: THREE.LoadingManager;
  private textures: Partial<Record<GrassTextureType, THREE.Texture>> = {};
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
    const textures = Object.entries(GRASS_TEXTURES);
    const loader = new THREE.TextureLoader(this.loadingManager);
    await Promise.allSettled(
      textures.map(async ([textureType, { url, colorSpace }]) => {
        const texture = await loader.loadAsync(url);
        texture.colorSpace = colorSpace;
        texture.wrapS = THREE.MirroredRepeatWrapping;
        texture.wrapT = THREE.MirroredRepeatWrapping;
        texture.repeat.set(GROUND_SIZE, GROUND_SIZE);
        texture.needsUpdate = true;
        this.textures[textureType as GrassTextureType] = texture;
      }),
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
      displacementBias: -0.05,
      displacementScale: 0.1,
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
