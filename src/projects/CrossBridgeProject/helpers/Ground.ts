import * as THREE from "three";
import * as CANNON from "cannon-es";
import type {
  GroundTextureType,
  GroundType,
} from "../CrossBridgeProject.types";
import {
  BOARD_GAP,
  BOARD_DEPTH,
  BOARD_WIDTH,
  BOARDS_CNT,
  GROUND_TEXTURES,
  GROUND_HEIGHT,
  BOARD_HEIGHT,
  GROUND_WIDTH,
} from "../CrossBridgeProject.constants";

class Ground implements GroundType {
  private loadingManager: THREE.LoadingManager;
  private textures: Partial<Record<GroundTextureType, THREE.Texture>> = {};
  models: THREE.Object3D[] = [];
  bodies: CANNON.Body[] = [];

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
      Object.entries(GROUND_TEXTURES).map(
        async ([name, { url, colorSpace }]) => {
          const textureName = name as GroundTextureType;
          const texture = await loader.loadAsync(url);
          texture.colorSpace = colorSpace;
          this.textures[textureName] = texture;
        },
      ),
    );
  }

  private setupModels() {
    const geometry = new THREE.BoxGeometry(
      GROUND_WIDTH,
      GROUND_HEIGHT,
      BOARD_DEPTH,
      64,
      64,
      64,
    );
    const material = new THREE.MeshStandardMaterial({
      ...this.textures,
      color: new THREE.Color("#ccc"),
      displacementBias: -0.25,
      displacementScale: 0.5,
    });
    const mesh = new THREE.Mesh(geometry, material);

    for (let idx = 0; idx < 2; idx++) {
      const ground = mesh.clone();
      this.models.push(ground);
    }
  }

  private transform() {
    const leftGround = this.models[0];
    const rightGround = this.models[1];

    const x =
      (BOARDS_CNT * (BOARD_WIDTH + BOARD_GAP)) / 2 -
      BOARD_GAP +
      GROUND_WIDTH / 2;
    const y = -GROUND_HEIGHT / 2 + BOARD_HEIGHT / 2;

    leftGround.position.x = -x;
    rightGround.position.x = x;
    leftGround.position.y = rightGround.position.y = y;
    rightGround.rotateY(Math.PI);
  }
}

export default Ground;
