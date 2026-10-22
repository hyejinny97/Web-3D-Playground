import * as THREE from "three";
import * as CANNON from "cannon-es";
import type { BarkTextureType, BridgeType } from "../CrossBridgeProject.types";
import {
  BARK_TEXTURES,
  BOARD_GAP,
  BOARD_DEPTH,
  BOARD_WIDTH,
  BOARDS_CNT,
  BOARD_HEIGHT,
} from "../CrossBridgeProject.constants";

class Bridge implements BridgeType {
  private loadingManager: THREE.LoadingManager;
  private textures: Partial<Record<BarkTextureType, THREE.Texture>> = {};
  models: THREE.Object3D[] = [];
  bodies: CANNON.Body[] = [];
  constraints: CANNON.Constraint[] = [];

  constructor({ loadingManager }: { loadingManager: THREE.LoadingManager }) {
    this.loadingManager = loadingManager;
  }

  async init() {
    await this.loadTexture();
    this.setupModels();
    this.transform();
  }

  private async loadTexture() {
    const loader = new THREE.TextureLoader(this.loadingManager);
    await Promise.allSettled(
      Object.entries(BARK_TEXTURES).map(async ([name, { url, colorSpace }]) => {
        const textureName = name as BarkTextureType;
        const texture = await loader.loadAsync(url);
        texture.colorSpace = colorSpace;
        this.textures[textureName] = texture;
      }),
    );
  }

  private setupModels() {
    const geometry = new THREE.BoxGeometry(
      BOARD_WIDTH,
      BOARD_HEIGHT,
      BOARD_DEPTH,
    );
    const material = new THREE.MeshStandardMaterial({
      ...this.textures,
      displacementBias: -0.25,
      displacementScale: 0.5,
    });
    const mesh = new THREE.Mesh(geometry, material);

    for (let idx = 0; idx < BOARDS_CNT; idx++) {
      const board = mesh.clone();
      this.models.push(board);
    }
  }

  private transform() {
    this.models.forEach((model, idx) => {
      const x = (-(BOARDS_CNT - 1) / 2 + idx) * (BOARD_WIDTH + BOARD_GAP);
      model.position.set(x, 0, 0);
    });
  }
}

export default Bridge;
