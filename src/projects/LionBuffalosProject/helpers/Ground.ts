import * as THREE from "three";
import { GRASS_TEXTURES, GROUND_SIZE } from "../LionBuffalosProject.constants";
import {
  type GrassTextureType,
  type GroundType,
} from "../LionBuffalosProject.types";

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
        texture.repeat.set(GROUND_SIZE.width, GROUND_SIZE.height);
        texture.needsUpdate = true;
        this.textures[textureType as GrassTextureType] = texture;
      }),
    );
  }

  private setupModel() {
    const geometry = new THREE.PlaneGeometry(
      GROUND_SIZE.width,
      GROUND_SIZE.height,
      Math.pow(2, GROUND_SIZE.width + 2),
      Math.pow(2, GROUND_SIZE.height + 2),
    );
    const material = new THREE.MeshStandardMaterial({
      ...this.textures,
      displacementScale: 1,
      displacementBias: -0.3,
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
