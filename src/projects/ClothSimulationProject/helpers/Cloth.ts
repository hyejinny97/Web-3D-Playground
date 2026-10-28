import * as THREE from "three";
import * as CANNON from "cannon-es";
import type {
  ClothTextureType,
  ClothType,
} from "../ClothSimulationProject.types";
import {
  CLOTH_TEXTURES,
  CLOTH_HEIGHT,
  CLOTH_HEIGHT_SEGMENTS,
  CLOTH_WIDTH,
  CLOTH_WIDTH_SEGMENTS,
  CLOTH_WIDTH_STEP,
  CLOTH_HEIGHT_STEP,
} from "../ClothSimulationProject.constants";
import { HDRLoader } from "three/examples/jsm/Addons.js";

class Cloth implements ClothType {
  private loadingManager: THREE.LoadingManager;
  private textures: Partial<Record<ClothTextureType, THREE.Texture>> = {};
  model: THREE.Mesh | null = null;
  bodies: CANNON.Body[] = [];
  constraints: CANNON.DistanceConstraint[] = [];

  constructor({ loadingManager }: { loadingManager: THREE.LoadingManager }) {
    this.loadingManager = loadingManager;
  }

  async init() {
    await this.loadTextures();
    this.setupModel();
    this.setupBodies();
    this.setupConstraints();
  }

  private async loadTextures() {
    const textureLoader = new THREE.TextureLoader(this.loadingManager);
    const hdrLoader = new HDRLoader(this.loadingManager);

    await Promise.allSettled(
      Object.entries(CLOTH_TEXTURES).map(async ([name, value]) => {
        const textureName = name as ClothTextureType;
        const loader = name === "envMap" ? hdrLoader : textureLoader;
        const texture = await loader.loadAsync(value.url);
        texture.colorSpace = value.colorSpace;
        if ("mapping" in value) texture.mapping = value.mapping;
        this.textures[textureName] = texture;
      }),
    );
  }

  private setupModel() {
    const geometry = new THREE.PlaneGeometry(
      CLOTH_WIDTH,
      CLOTH_HEIGHT,
      CLOTH_WIDTH_SEGMENTS,
      CLOTH_HEIGHT_SEGMENTS,
    );
    const material = new THREE.MeshPhysicalMaterial({
      ...this.textures,
      anisotropy: 1,
      metalness: 0.05,
      roughness: 0.5,
      displacementBias: -0.5,
      displacementScale: 1,
      side: THREE.DoubleSide,
    });
    this.model = new THREE.Mesh(geometry, material);
  }

  private setupBodies() {
    const shape = new CANNON.Particle();
    const material = new CANNON.Material("cloth");

    for (let row = 0; row < CLOTH_HEIGHT_SEGMENTS + 1; row++) {
      for (let column = 0; column < CLOTH_WIDTH_SEGMENTS + 1; column++) {
        const mass = row === 0 ? 0 : 1;
        const position = new CANNON.Vec3(
          -CLOTH_WIDTH / 2 + column * CLOTH_WIDTH_STEP,
          CLOTH_HEIGHT / 2 - row * CLOTH_HEIGHT_STEP,
          0,
        );
        const body = new CANNON.Body({ mass, shape, material, position });
        this.bodies.push(body);
      }
    }
  }

  private setupConstraints() {
    for (let row = 0; row < CLOTH_HEIGHT_SEGMENTS + 1; row++) {
      for (let column = 0; column < CLOTH_WIDTH_SEGMENTS + 1; column++) {
        const particle = this.bodies[this.getIndex(row, column)];
        if (!particle) return;

        if (column < CLOTH_WIDTH_SEGMENTS) {
          const rightParticle = this.bodies[this.getIndex(row, column + 1)];
          this.constraints.push(
            new CANNON.DistanceConstraint(
              particle,
              rightParticle,
              CLOTH_WIDTH_STEP,
            ),
          );
        }
        if (row < CLOTH_HEIGHT_SEGMENTS) {
          const downParticle = this.bodies[this.getIndex(row + 1, column)];
          this.constraints.push(
            new CANNON.DistanceConstraint(
              particle,
              downParticle,
              CLOTH_HEIGHT_STEP,
            ),
          );
        }
        if (column < CLOTH_WIDTH_SEGMENTS && row < CLOTH_HEIGHT_SEGMENTS) {
          const rightDownParticle =
            this.bodies[this.getIndex(row + 1, column + 1)];
          this.constraints.push(
            new CANNON.DistanceConstraint(
              particle,
              rightDownParticle,
              Math.sqrt(CLOTH_WIDTH_STEP ** 2 + CLOTH_HEIGHT_STEP ** 2),
            ),
          );
        }
      }
    }
  }

  private getIndex(row: number, column: number): number {
    return row * (CLOTH_WIDTH_SEGMENTS + 1) + column;
  }

  update() {
    if (this.model) {
      for (let row = 0; row < CLOTH_HEIGHT_SEGMENTS + 1; row++) {
        for (let column = 0; column < CLOTH_WIDTH_SEGMENTS + 1; column++) {
          const idx = this.getIndex(row, column);
          const particle = this.bodies[idx];
          if (!particle) return;

          const particlePosition = particle.position;
          const modelPositionAttributes =
            this.model.geometry.attributes.position;

          modelPositionAttributes.setXYZ(
            idx,
            particlePosition.x,
            particlePosition.y,
            particlePosition.z,
          );
          modelPositionAttributes.needsUpdate = true;

          this.model.geometry.computeVertexNormals();
        }
      }
    }
  }
}

export default Cloth;
