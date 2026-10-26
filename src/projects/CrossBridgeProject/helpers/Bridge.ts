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
  BODY_MATERIALS,
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
    this.setupBodies();
    this.transform();
    this.setupConstraints();
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

  private setupBodies() {
    const shape = new CANNON.Box(
      new CANNON.Vec3(
        (BOARD_WIDTH + BOARD_GAP) / 2 + 0.01,
        BOARD_HEIGHT / 2,
        BOARD_DEPTH / 2,
      ),
    );
    const material = new CANNON.Material(BODY_MATERIALS.bridge);

    for (let idx = 0; idx < BOARDS_CNT; idx++) {
      const body = new CANNON.Body({
        mass: 30,
        shape,
        material,
      });
      this.bodies.push(body);
    }
  }

  private setupConstraints() {
    for (let idx = 0; idx < BOARDS_CNT; idx++) {
      const body = this.bodies[idx];
      const previousBody = idx === 0 ? null : this.bodies[idx - 1];
      if (previousBody) {
        const constraint = new CANNON.LockConstraint(body, previousBody);
        this.constraints.push(constraint);
      }
    }
  }

  private transform() {
    this.bodies.forEach((body, idx) => {
      const x = (-(BOARDS_CNT - 1) / 2 + idx) * (BOARD_WIDTH + BOARD_GAP);
      body.position.set(x, 0, 0);
    });
  }

  update() {
    for (let idx = 0; idx < BOARDS_CNT; idx++) {
      const model = this.models[idx];
      const body = this.bodies[idx];
      if (!model || !body) return;
      model.position.copy(body.position);
      model.quaternion.copy(body.quaternion);
    }
  }
}

export default Bridge;
