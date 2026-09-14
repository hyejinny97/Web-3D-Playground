import * as THREE from "three";
import type { ControlUIType } from "@/types/project";
import type {
  TextureMaterialHelperType,
  TexturePropertiesType,
} from "../TexturePropertiesProject.types";
import type { ImageType } from "../TexturePropertiesProject.types";
import {
  IMAGES,
  MAG_FILTER,
  MIN_FILTER,
  WRAPPING,
} from "../TexturePropertiesProject.constants";
import { omit } from "../TexturePropertiesProject.utils";

const DEFAULT_ARGS = {
  image: "UV Grid",
  wrapS: THREE.ClampToEdgeWrapping,
  wrapT: THREE.ClampToEdgeWrapping,
  repeatX: 1,
  repeatY: 1,
  offsetX: 0,
  offsetY: 0,
  centerX: 0,
  centerY: 0,
  rotation: 0, // 단위: 라디안
  magFilter: THREE.LinearFilter,
  minFilter: THREE.LinearMipmapLinearFilter,
} as const;

class TextureMaterialHelper implements TextureMaterialHelperType {
  private controlUIGroupName = "Texture";
  private _args: TextureMaterialHelperType["args"];
  private _material: THREE.MeshPhongMaterial;
  private textures: Partial<Record<ImageType, THREE.Texture>> = {};
  private loadTextureImages: (urls: string[]) => Promise<HTMLImageElement[]>;
  controlUI: ControlUIType;

  constructor(
    controlUI: ControlUIType,
    loadTextureImages: (urls: string[]) => Promise<HTMLImageElement[]>,
  ) {
    this.controlUI = controlUI;
    this.loadTextureImages = loadTextureImages;
    this._args = { ...DEFAULT_ARGS };
    this._material = new THREE.MeshPhongMaterial();
    this.init();
  }

  get args() {
    return this._args;
  }

  get material() {
    return this._material;
  }

  async init() {
    await this.createTextures();
    Object.keys(this.textures).forEach((name) =>
      this.updateTexture(name as ImageType, omit(this._args, ["image"])),
    );
    this.mapTextureToMaterial(this._args.image);
  }

  async createTextures() {
    const imageNames = Object.keys(IMAGES) as ImageType[];
    const imgEls = await this.loadTextureImages(
      imageNames.map((name) => IMAGES[name]),
    );
    imgEls.forEach((imgEl, idx) => {
      const name = imageNames[idx];
      const texture = new THREE.Texture(imgEl);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.generateMipmaps = true;
      this.textures[name] = texture;
    });
  }

  updateTexture(name: ImageType, properties: TexturePropertiesType) {
    const texture = this.textures[name]!;
    const { repeatX, repeatY, offsetX, offsetY, centerX, centerY, ...rest } =
      properties;

    if (typeof repeatX === "number") texture.repeat.x = repeatX;
    if (typeof repeatY === "number") texture.repeat.y = repeatY;
    if (typeof offsetX === "number") texture.offset.x = offsetX;
    if (typeof offsetY === "number") texture.offset.y = offsetY;
    if (typeof centerX === "number") texture.center.x = centerX;
    if (typeof centerY === "number") texture.center.y = centerY;

    texture.setValues(rest);
    texture.needsUpdate = true;
  }

  mapTextureToMaterial(name: ImageType) {
    const texture = this.textures[name]!;
    this._material.map = texture;
    this._material.needsUpdate = true;
  }

  createControlUI() {
    this.controlUI.add(this.controlUIGroupName, [
      {
        type: "select",
        label: "image",
        options: Object.keys(IMAGES).map((name) => ({
          label: name,
          value: name,
        })),
        initValue: this._args.image,
        onChange: (value) => {
          this._args.image = value as ImageType;
          this.updateTexture(this._args.image, omit(this._args, ["image"]));
          this.mapTextureToMaterial(this._args.image);
        },
      },
      {
        type: "select",
        label: "wrapS",
        options: Object.entries(WRAPPING).map(([label, value]) => ({
          label,
          value,
        })),
        initValue: this._args.wrapS,
        onChange: (value) => {
          this._args.wrapS = value as THREE.Wrapping;
          this.updateTexture(this._args.image, { wrapS: this._args.wrapS });
        },
      },
      {
        type: "select",
        label: "wrapT",
        options: Object.entries(WRAPPING).map(([label, value]) => ({
          label,
          value,
        })),
        initValue: this._args.wrapT,
        onChange: (value) => {
          this._args.wrapT = value as THREE.Wrapping;
          this.updateTexture(this._args.image, { wrapT: this._args.wrapT });
        },
      },
      {
        type: "range",
        label: "repeatX",
        min: 0,
        max: 5,
        step: 1,
        marks: true,
        initValue: this._args.repeatX,
        onChange: (value) => {
          this._args.repeatX = value;
          this.updateTexture(this._args.image, { repeatX: this._args.repeatX });
        },
      },
      {
        type: "range",
        label: "repeatY",
        min: 0,
        max: 5,
        step: 1,
        marks: true,
        initValue: this._args.repeatY,
        onChange: (value) => {
          this._args.repeatY = value;
          this.updateTexture(this._args.image, { repeatY: this._args.repeatY });
        },
      },
      {
        type: "range",
        label: "offsetX",
        min: -1,
        max: 1,
        step: 0.1,
        initValue: this._args.offsetX,
        onChange: (value) => {
          this._args.offsetX = value;
          this.updateTexture(this._args.image, { offsetX: this._args.offsetX });
        },
      },
      {
        type: "range",
        label: "offsetY",
        min: -1,
        max: 1,
        step: 0.1,
        initValue: this._args.offsetY,
        onChange: (value) => {
          this._args.offsetY = value;
          this.updateTexture(this._args.image, { offsetY: this._args.offsetY });
        },
      },
      {
        type: "range",
        label: "centerX",
        min: 0,
        max: 1,
        step: 0.1,
        marks: true,
        initValue: this._args.centerX,
        onChange: (value) => {
          this._args.centerX = value;
          this.updateTexture(this._args.image, { centerX: this._args.centerX });
        },
      },
      {
        type: "range",
        label: "centerY",
        min: 0,
        max: 1,
        step: 0.1,
        marks: true,
        initValue: this._args.centerY,
        onChange: (value) => {
          this._args.centerY = value;
          this.updateTexture(this._args.image, { centerY: this._args.centerY });
        },
      },
      {
        type: "range",
        label: "rotation",
        min: 0,
        max: 360,
        step: 1,
        initValue: THREE.MathUtils.radToDeg(this._args.rotation),
        onChange: (value) => {
          this._args.rotation = THREE.MathUtils.degToRad(value);
          this.updateTexture(this._args.image, {
            rotation: this._args.rotation,
          });
        },
      },
      {
        type: "select",
        label: "minFilter",
        options: Object.entries(MIN_FILTER).map(([label, value]) => ({
          label,
          value,
        })),
        initValue: this._args.minFilter,
        onChange: (value) => {
          this._args.minFilter = value as THREE.MinificationTextureFilter;
          this.updateTexture(this._args.image, {
            minFilter: this._args.minFilter,
          });
        },
      },
      {
        type: "select",
        label: "magFilter",
        options: Object.entries(MAG_FILTER).map(([label, value]) => ({
          label,
          value,
        })),
        initValue: this._args.magFilter,
        onChange: (value) => {
          this._args.magFilter = value as THREE.MagnificationTextureFilter;
          this.updateTexture(this._args.image, {
            magFilter: this._args.magFilter,
          });
        },
      },
    ]);
  }

  reset() {
    this._args = { ...DEFAULT_ARGS };
    Object.keys(this.textures).forEach((name) =>
      this.updateTexture(name as ImageType, omit(this._args, ["image"])),
    );
    this.mapTextureToMaterial(this._args.image);
    this.controlUI.removeGroup(this.controlUIGroupName);
  }

  disposeTextures() {
    Object.values(this.textures).forEach((texture) => texture.dispose());
  }
}

export default TextureMaterialHelper;
