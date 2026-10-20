import * as THREE from "three";
import * as CANNON from "cannon-es";
import type {
  MetalTextureType,
  PyramidBoxesType,
} from "../FireCannonProject.types";
import {
  BOX_REDUCTION,
  BOX_SIZE,
  GROUND_WIDTH,
  METAL_TEXTURES,
} from "../FireCannonProject.constants";

class PyramidBoxes implements PyramidBoxesType {
  private loadingManager: THREE.LoadingManager;
  private floors: number;
  private totalBoxCnt: number;
  private textures: Partial<Record<MetalTextureType, THREE.Texture>> = {};
  models: THREE.Object3D[] = [];
  bodies: CANNON.Body[] = [];

  constructor({
    loadingManager,
    floors = 5,
  }: {
    loadingManager: THREE.LoadingManager;
    floors?: number;
  }) {
    this.loadingManager = loadingManager;
    this.floors = floors;
    this.totalBoxCnt = Math.pow(this.floors, 2);
  }

  async init() {
    await this.loadTextures();
    this.setupModels();
    this.setupBodies();
    this.transform();
  }

  private async loadTextures() {
    const loader = new THREE.TextureLoader(this.loadingManager);
    await Promise.allSettled(
      Object.entries(METAL_TEXTURES).map(
        async ([name, { url, colorSpace }]) => {
          const textureName = name as MetalTextureType;
          const texture = await loader.loadAsync(url);
          texture.colorSpace = colorSpace;
          this.textures[textureName] = texture;
        },
      ),
    );
  }

  private setupModels() {
    const geometry = new THREE.BoxGeometry(BOX_SIZE, BOX_SIZE, BOX_SIZE);
    const material = new THREE.MeshStandardMaterial({ ...this.textures });
    const mesh = new THREE.Mesh(geometry, material);

    for (let idx = 0; idx < this.totalBoxCnt; idx++) {
      const box = mesh.clone();
      this.models.push(box);
    }
  }

  private setupBodies() {
    const shape = new CANNON.Box(
      new CANNON.Vec3(BOX_SIZE / 2, BOX_SIZE / 2, BOX_SIZE / 2),
    );
    const material = new CANNON.Material("box");

    for (let idx = 0; idx < this.totalBoxCnt; idx++) {
      const body = new CANNON.Body({
        mass: 3,
        shape,
        material,
      });
      this.bodies.push(body);
    }
  }

  private transform() {
    const ROTATION_Y = -Math.PI / 2;
    let boxes = 0;
    for (let row = this.floors; row > 0; row--) {
      const boxCnt = 1 + (row - 1) * BOX_REDUCTION;
      const pivot = new THREE.Vector3(
        GROUND_WIDTH / 2 - 3,
        BOX_SIZE + (this.floors - row) * BOX_SIZE,
        0,
      );
      for (let column = 0; column < boxCnt; column++) {
        const body = this.bodies[boxes + column];
        const radius = -(-boxCnt / 2 + column) * BOX_SIZE;
        body.position.set(
          pivot.x + Math.cos(ROTATION_Y) * radius,
          pivot.y,
          pivot.z + Math.sin(ROTATION_Y) * radius,
        );
      }
      boxes += boxCnt;
    }
  }

  update() {
    this.models.forEach((model, idx) => {
      const body = this.bodies[idx];
      if (!body) return;
      model.position.copy(body.position);
      model.quaternion.copy(body.quaternion);
    });
  }
}

export default PyramidBoxes;
