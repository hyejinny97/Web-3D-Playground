import * as THREE from "three";
import type { ControlUIType } from "@/types/project";
import type {
  LavaMaterialHelperType,
  LavaTextureType,
} from "../TextureMappingProject.types";
import {
  LAVA_TEXTURES,
  PROPERTIES_NEED_UPDATE,
  TEXTURE_MIN_FILTER,
  TEXTURE_REPEAT_X,
  TEXTURE_REPEAT_Y,
  TEXTURE_WRAP_S,
  TEXTURE_WRAP_T,
} from "../TextureMappingProject.constants";

const DEFAULT_ARGS = {
  alphaMap: true,
  aoMap: true,
  aoMapIntensity: 1,
  displacementMap: true,
  displacementBias: 0,
  displacementScale: 0.1,
  map: true,
  normalMap: true,
  roughnessMap: true,
  roughness: 1,
} as const;

class LavaMaterialHelper implements LavaMaterialHelperType {
  private controlUIGroupName = "MeshStandardMaterial";
  private _args: LavaMaterialHelperType["args"];
  private _material = new THREE.MeshStandardMaterial();
  private loadTextureImages: (urls: string[]) => Promise<HTMLImageElement[]>;
  textures: Partial<Record<LavaTextureType, THREE.Texture>> = {};
  controlUI: ControlUIType;

  constructor(
    controlUI: ControlUIType,
    loadTextureImages: (urls: string[]) => Promise<HTMLImageElement[]>,
  ) {
    this.controlUI = controlUI;
    this._args = { ...DEFAULT_ARGS };
    this.loadTextureImages = loadTextureImages;
  }

  get args() {
    return this._args;
  }

  get material() {
    return this._material;
  }

  async init() {
    await this.loadTextures();
    this.setMaterialArgs();
  }

  async loadTextures() {
    const textures = Object.entries(LAVA_TEXTURES);
    const imgEls = await this.loadTextureImages(
      textures.map((texture) => texture[1].url),
    );
    imgEls.forEach((imgEl, idx) => {
      const texture = new THREE.Texture(imgEl);
      const [name, { colorSpace }] = textures[idx];
      texture.colorSpace = colorSpace;
      texture.wrapS = TEXTURE_WRAP_S;
      texture.wrapT = TEXTURE_WRAP_T;
      texture.repeat.set(TEXTURE_REPEAT_X, TEXTURE_REPEAT_Y);
      texture.minFilter = TEXTURE_MIN_FILTER;
      texture.needsUpdate = true;
      this.textures[name as LavaTextureType] = texture;
    });
  }

  update(properties: THREE.MeshStandardMaterialParameters) {
    this._material.setValues(properties);
    if (
      Object.keys(properties).some((targetPro) =>
        PROPERTIES_NEED_UPDATE.some((pro) => pro === targetPro),
      )
    ) {
      this._material.needsUpdate = true;
    }
  }

  setMaterialArgs() {
    const {
      alphaMap,
      aoMap,
      displacementMap,
      map,
      normalMap,
      roughnessMap,
      ...rest
    } = this._args;
    this.update({
      ...rest,
      transparent: true,
      alphaMap: alphaMap ? this.textures.alphaMap : null,
      aoMap: aoMap ? this.textures.aoMap : null,
      displacementMap: displacementMap ? this.textures.displacementMap : null,
      map: map ? this.textures.map : null,
      normalMap: normalMap ? this.textures.normalMap : null,
      roughnessMap: roughnessMap ? this.textures.roughnessMap : null,
    });
  }

  createControlUI() {
    this.controlUI.add(this.controlUIGroupName, [
      {
        type: "texture",
        label: "alphaMap",
        imageUrl: LAVA_TEXTURES.alphaMap.url,
        initChecked: this._args.alphaMap,
        onChange: (value) => {
          this._args.alphaMap = value;
          this.update({
            alphaMap: this._args.alphaMap ? this.textures.alphaMap : null,
          });
        },
      },
      {
        type: "texture",
        label: "aoMap",
        imageUrl: LAVA_TEXTURES.aoMap.url,
        initChecked: this._args.aoMap,
        onChange: (value) => {
          this._args.aoMap = value;
          this.update({ aoMap: this._args.aoMap ? this.textures.aoMap : null });
        },
      },
      {
        type: "range",
        label: "aoMapIntensity",
        min: 0,
        max: 10,
        step: 1,
        marks: true,
        initValue: this._args.aoMapIntensity,
        onChange: (value) => {
          this._args.aoMapIntensity = value;
          this.update({ aoMapIntensity: this._args.aoMapIntensity });
        },
      },
      {
        type: "texture",
        label: "displacementMap",
        imageUrl: LAVA_TEXTURES.displacementMap.url,
        initChecked: this._args.displacementMap,
        onChange: (value) => {
          this._args.displacementMap = value;
          this.update({
            displacementMap: this._args.displacementMap
              ? this.textures.displacementMap
              : null,
          });
        },
      },
      {
        type: "range",
        label: "displacementBias",
        min: 0,
        max: 2,
        step: 0.1,
        initValue: this._args.displacementBias,
        onChange: (value) => {
          this._args.displacementBias = value;
          this.update({ displacementBias: this._args.displacementBias });
        },
      },
      {
        type: "range",
        label: "displacementScale",
        min: 0,
        max: 2,
        step: 0.1,
        initValue: this._args.displacementScale,
        onChange: (value) => {
          this._args.displacementScale = value;
          this.update({ displacementScale: this._args.displacementScale });
        },
      },
      {
        type: "texture",
        label: "map",
        imageUrl: LAVA_TEXTURES.map.url,
        initChecked: this._args.map,
        onChange: (value) => {
          this._args.map = value;
          this.update({
            map: this._args.map ? this.textures.map : null,
          });
        },
      },
      {
        type: "texture",
        label: "normalMap",
        imageUrl: LAVA_TEXTURES.normalMap.url,
        initChecked: this._args.normalMap,
        onChange: (value) => {
          this._args.normalMap = value;
          this.update({
            normalMap: this._args.normalMap ? this.textures.normalMap : null,
          });
        },
      },
      {
        type: "texture",
        label: "roughnessMap",
        imageUrl: LAVA_TEXTURES.roughnessMap.url,
        initChecked: this._args.roughnessMap,
        onChange: (value) => {
          this._args.roughnessMap = value;
          this.update({
            roughnessMap: this._args.roughnessMap
              ? this.textures.roughnessMap
              : null,
          });
        },
      },
      {
        type: "range",
        label: "roughness",
        min: 0,
        max: 1,
        step: 0.1,
        marks: true,
        initValue: this._args.roughness,
        onChange: (value) => {
          this._args.roughness = value;
          this.update({ roughness: this._args.roughness });
        },
      },
    ]);
  }

  reset() {
    this._args = { ...DEFAULT_ARGS };
    this.setMaterialArgs();
    this.controlUI.removeGroup(this.controlUIGroupName);
  }
}

export default LavaMaterialHelper;
