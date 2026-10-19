import * as THREE from "three";
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
  private textures: Partial<Record<MetalTextureType, THREE.Texture>> = {};
  root: THREE.Object3D | null = null;

  constructor({
    loadingManager,
    floors = 5,
  }: {
    loadingManager: THREE.LoadingManager;
    floors?: number;
  }) {
    this.loadingManager = loadingManager;
    this.floors = floors;
  }

  async init() {
    await this.loadTextures();
    this.setupModel();
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

  private setupModel() {
    const geometry = new THREE.BoxGeometry(BOX_SIZE, BOX_SIZE, BOX_SIZE);
    const material = new THREE.MeshStandardMaterial({ ...this.textures });
    const mesh = new THREE.Mesh(geometry, material);

    this.root = new THREE.Object3D();
    for (let floor = this.floors; floor > 0; floor--) {
      const boxCnt = 1 + (floor - 1) * BOX_REDUCTION;
      for (let idx = 0; idx < boxCnt; idx++) {
        const box = mesh.clone();
        box.position.x = (-boxCnt / 2 + idx) * BOX_SIZE;
        box.position.y = (this.floors - floor) * BOX_SIZE;
        this.root?.add(box);
      }
    }
  }

  private transform() {
    this.root?.position.set(GROUND_WIDTH / 2 - 3, BOX_SIZE, 0);
    this.root?.rotateY(-Math.PI / 2);
  }
}

export default PyramidBoxes;
