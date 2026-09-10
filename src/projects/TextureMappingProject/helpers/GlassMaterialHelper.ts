import * as THREE from "three";
import type { ControlUIType } from "@/types/project";
import type {
  GlassMaterialHelperType,
  GlassTextureType,
  TextureLoadingType,
} from "../TextureMappingProject.types";
import {
  GLASS_TEXTURES,
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
  metalnessMap: true,
  metalness: 0.1,
  roughnessMap: true,
  roughness: 1,
  transmissionMap: true,
  transmission: 0.1,
} as const;

class GlassMaterialHelper implements GlassMaterialHelperType {
  private controlUIGroupName = "MeshPhysicalMaterial";
  private _args: GlassMaterialHelperType["args"];
  private _material = new THREE.MeshPhysicalMaterial();
  textures: Partial<Record<GlassTextureType, THREE.Texture>> = {};
  controlUI: ControlUIType;

  constructor(controlUI: ControlUIType) {
    this.controlUI = controlUI;
    this._args = { ...DEFAULT_ARGS };
  }

  get args() {
    return this._args;
  }

  get material() {
    return this._material;
  }

  async init(textureLoad?: TextureLoadingType) {
    await this.loadTextures(textureLoad);
    this.setMaterialArgs();
  }

  async loadTextures(textureLoad?: TextureLoadingType) {
    const { onStart, onLoad, onProgress, onError } = textureLoad ?? {};
    const manager = new THREE.LoadingManager(onLoad, onProgress, onError);
    manager.onStart = onStart;
    const loader = new THREE.TextureLoader(manager);
    await Promise.allSettled(
      Object.keys(GLASS_TEXTURES).map(async (key) => {
        const name = key as GlassTextureType;
        const { url, colorSpace } = GLASS_TEXTURES[name];
        const texture = await loader.loadAsync(url);
        texture.colorSpace = colorSpace;
        texture.wrapS = TEXTURE_WRAP_S;
        texture.wrapT = TEXTURE_WRAP_T;
        texture.repeat.set(TEXTURE_REPEAT_X, TEXTURE_REPEAT_Y);
        texture.minFilter = TEXTURE_MIN_FILTER;
        this.textures[name] = texture;
      }),
    );
  }

  update(properties: THREE.MeshPhysicalMaterialParameters) {
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
      metalnessMap,
      roughnessMap,
      transmissionMap,
      ...rest
    } = this._args;
    this.update({
      ...rest,
      transparent: true,
      side: THREE.DoubleSide,
      alphaMap: alphaMap ? this.textures.alphaMap : null,
      aoMap: aoMap ? this.textures.aoMap : null,
      displacementMap: displacementMap ? this.textures.displacementMap : null,
      map: map ? this.textures.map : null,
      normalMap: normalMap ? this.textures.normalMap : null,
      metalnessMap: metalnessMap ? this.textures.metalnessMap : null,
      roughnessMap: roughnessMap ? this.textures.roughnessMap : null,
      transmissionMap: transmissionMap ? this.textures.transmissionMap : null,
    });
  }

  createControlUI() {
    this.controlUI.add(this.controlUIGroupName, [
      {
        type: "texture",
        label: "alphaMap",
        imageUrl: GLASS_TEXTURES.alphaMap.url,
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
        imageUrl: GLASS_TEXTURES.aoMap.url,
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
        imageUrl: GLASS_TEXTURES.displacementMap.url,
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
        imageUrl: GLASS_TEXTURES.map.url,
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
        imageUrl: GLASS_TEXTURES.normalMap.url,
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
        label: "metalnessMap",
        imageUrl: GLASS_TEXTURES.metalnessMap.url,
        initChecked: this._args.metalnessMap,
        onChange: (value) => {
          this._args.metalnessMap = value;
          this.update({
            metalnessMap: this._args.metalnessMap
              ? this.textures.metalnessMap
              : null,
          });
        },
      },
      {
        type: "range",
        label: "metalness",
        min: 0,
        max: 1,
        step: 0.1,
        marks: true,
        initValue: this._args.metalness,
        onChange: (value) => {
          this._args.metalness = value;
          this.update({ metalness: this._args.metalness });
        },
      },
      {
        type: "texture",
        label: "roughnessMap",
        imageUrl: GLASS_TEXTURES.roughnessMap.url,
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
      {
        type: "texture",
        label: "transmissionMap",
        imageUrl: GLASS_TEXTURES.transmissionMap.url,
        initChecked: this._args.transmissionMap,
        onChange: (value) => {
          this._args.transmissionMap = value;
          this.update({
            transmissionMap: this._args.transmissionMap
              ? this.textures.transmissionMap
              : null,
          });
        },
      },
      {
        type: "range",
        label: "transmission",
        min: 0,
        max: 1,
        step: 0.1,
        marks: true,
        initValue: this._args.transmission,
        onChange: (value) => {
          this._args.transmission = value;
          this.update({ transmission: this._args.transmission });
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

export default GlassMaterialHelper;
