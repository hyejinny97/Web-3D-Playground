import * as THREE from "three";
import Star from "./Star";
import Planet from "./Planet";
import type AstronicObject from "./AstronicObject";
import { IMAGES } from "../SolarSystemProject.constants";
import type { AstronicObjectNameType } from "../SolarSystemProject.types";

class SolarSystemHelper {
  root = new THREE.Object3D();
  private children: AstronicObject[] = [];
  private loadTextureImages: (urls: string[]) => Promise<HTMLImageElement[]>;

  constructor(
    loadTextureImages: (urls: string[]) => Promise<HTMLImageElement[]>,
  ) {
    this.loadTextureImages = loadTextureImages;
    this.root.name = "solar system";
  }

  async init() {
    const textures = await this.generateTextures();

    const sun = new Star({
      name: "sun",
      parent: this.root,
      distance: 0,
      radius: 16,
      texture: textures.sun,
      meshRotation: 0.004,
      lightDistance: 200,
      lightIntensity: 100000,
    });

    const mercury = new Planet({
      name: "mercury",
      parent: sun.root,
      distance: 28,
      radius: 3.2,
      texture: textures.mercury,
      rootRotation: 0.04,
      meshRotation: 0.004,
    });
    const venus = new Planet({
      name: "venus",
      parent: sun.root,
      distance: 44,
      radius: 5.8,
      texture: textures.venus,
      rootRotation: 0.015,
      meshRotation: 0.002,
    });
    const earth = new Planet({
      name: "earth",
      parent: sun.root,
      distance: 62,
      radius: 6,
      texture: textures.earth,
      rootRotation: 0.01,
      meshRotation: 0.02,
    });
    const mars = new Planet({
      name: "mars",
      parent: sun.root,
      distance: 78,
      radius: 4,
      texture: textures.mars,
      rootRotation: 0.008,
      meshRotation: 0.018,
    });
    const jupiter = new Planet({
      name: "jupiter",
      parent: sun.root,
      distance: 100,
      radius: 12,
      texture: textures.jupiter,
      rootRotation: 0.002,
      meshRotation: 0.04,
    });
    const saturn = new Planet({
      name: "saturn",
      parent: sun.root,
      distance: 138,
      radius: 10,
      texture: textures.saturn,
      rootRotation: 0.0009,
      meshRotation: 0.038,
    });
    const uranus = new Planet({
      name: "uranus",
      parent: sun.root,
      distance: 176,
      radius: 7,
      texture: textures.uranus,
      rootRotation: 0.0004,
      meshRotation: 0.03,
    });
    const neptune = new Planet({
      name: "neptune",
      parent: sun.root,
      distance: 200,
      radius: 7,
      texture: textures.neptune,
      rootRotation: 0.0001,
      meshRotation: 0.032,
    });

    this.children.push(
      sun,
      mercury,
      venus,
      earth,
      mars,
      jupiter,
      saturn,
      uranus,
      neptune,
    );
    this.children.forEach((child) => this.root.add(child.root));
  }

  async generateTextures(): Promise<
    Record<AstronicObjectNameType, THREE.Texture>
  > {
    const names = Object.keys(IMAGES) as AstronicObjectNameType[];
    const urls = names.map((name) => IMAGES[name]);
    const images = await this.loadTextureImages(urls);

    const textures: Partial<Record<AstronicObjectNameType, THREE.Texture>> = {};
    images.forEach((img, idx) => {
      const name = names[idx];
      const texture = new THREE.Texture(img);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.needsUpdate = true;
      textures[name] = texture;
    });
    return textures as Record<AstronicObjectNameType, THREE.Texture>;
  }

  update(time: number) {
    this.children.forEach((child) => child.update(time));
  }
}

export default SolarSystemHelper;
