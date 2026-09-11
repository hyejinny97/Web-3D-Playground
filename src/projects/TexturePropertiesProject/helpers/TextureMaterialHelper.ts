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
  private _texture: THREE.Texture;
  private _material: THREE.MeshPhongMaterial;
  private images: Partial<Record<ImageType, HTMLImageElement>> = {};
  private loadTextureImages: (urls: string[]) => Promise<HTMLImageElement[]>;
  controlUI: ControlUIType;

  constructor(
    controlUI: ControlUIType,
    loadTextureImages: (urls: string[]) => Promise<HTMLImageElement[]>,
  ) {
    this.controlUI = controlUI;
    this.loadTextureImages = loadTextureImages;

    this._args = { ...DEFAULT_ARGS };
    this._texture = new THREE.Texture();
    this._texture.colorSpace = THREE.SRGBColorSpace;
    this._material = new THREE.MeshPhongMaterial({ map: this._texture });

    this.init();
  }

  get args() {
    return this._args;
  }

  get texture() {
    return this._texture;
  }

  get material() {
    return this._material;
  }

  async init() {
    await this.loadImages();
    this.updateTexture(this._args);
  }

  async loadImages() {
    const imageNames = Object.keys(IMAGES) as ImageType[];
    const imgEls = await this.loadTextureImages(
      imageNames.map((name) => IMAGES[name]),
    );
    imgEls.forEach((imgEl, idx) => {
      const name = imageNames[idx];
      this.images[name] = imgEl;
    });
  }

  updateTexture(properties: TexturePropertiesType) {
    const {
      image,
      repeatX,
      repeatY,
      offsetX,
      offsetY,
      centerX,
      centerY,
      ...rest
    } = properties;

    if (image) this._texture.image = this.images[image];
    if (typeof repeatX === "number") this._texture.repeat.x = repeatX;
    if (typeof repeatY === "number") this._texture.repeat.y = repeatY;
    if (typeof offsetX === "number") this._texture.offset.x = offsetX;
    if (typeof offsetY === "number") this._texture.offset.y = offsetY;
    if (typeof centerX === "number") this._texture.center.x = centerX;
    if (typeof centerY === "number") this._texture.center.y = centerY;

    this._texture.setValues(rest);
    this._texture.needsUpdate = true;
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
          this.updateTexture({ image: this._args.image });
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
          this.updateTexture({ wrapS: this._args.wrapS });
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
          this.updateTexture({ wrapT: this._args.wrapT });
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
          this.updateTexture({ repeatX: this._args.repeatX });
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
          this.updateTexture({ repeatY: this._args.repeatY });
        },
      },
      {
        type: "range",
        label: "offsetX",
        min: 0,
        max: 2,
        step: 0.1,
        initValue: this._args.offsetX,
        onChange: (value) => {
          this._args.offsetX = value;
          this.updateTexture({ offsetX: this._args.offsetX });
        },
      },
      {
        type: "range",
        label: "offsetY",
        min: 0,
        max: 2,
        step: 0.1,
        initValue: this._args.offsetY,
        onChange: (value) => {
          this._args.offsetY = value;
          this.updateTexture({ offsetY: this._args.offsetY });
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
          this.updateTexture({ centerX: this._args.centerX });
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
          this.updateTexture({ centerY: this._args.centerY });
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
          this.updateTexture({ rotation: this._args.rotation });
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
          this.updateTexture({ minFilter: this._args.minFilter });
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
          this.updateTexture({ magFilter: this._args.magFilter });
        },
      },
    ]);
  }

  reset() {
    this._args = { ...DEFAULT_ARGS };
    this.updateTexture(this._args);
    this.controlUI.removeGroup(this.controlUIGroupName);
  }
}

export default TextureMaterialHelper;
