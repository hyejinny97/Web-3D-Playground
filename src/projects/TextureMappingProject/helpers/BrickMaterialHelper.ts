import * as THREE from "three";
import type { ControlUIType } from "@/types/project";
import type {
  BrickMaterialHelperType,
  BrickTextureType,
  TextureLoadingType,
} from "../TextureMappingProject.types";
import {
  BRICK_TEXTURES,
  PROPERTIES_NEED_UPDATE,
  TEXTURE_REPEAT_X,
  TEXTURE_REPEAT_Y,
  TEXTURE_WRAP_S,
  TEXTURE_WRAP_T,
} from "../TextureMappingProject.constants";

const DEFAULT_ARGS = {
  aoMap: true,
  aoMapIntensity: 1,
  displacementMap: true,
  displacementBias: 0,
  displacementScale: 0,
  map: true,
  normalMap: true,
  roughnessMap: true,
  roughness: 1,
} as const;

class BrickMaterialHelper implements BrickMaterialHelperType {
  private controlUIGroupName = "MeshStandardMaterial";
  private _args: BrickMaterialHelperType["args"];
  private _material = new THREE.MeshStandardMaterial();
  textures: Partial<Record<BrickTextureType, THREE.Texture>> = {};
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
      Object.keys(BRICK_TEXTURES).map(async (key) => {
        const name = key as BrickTextureType;
        const { url, colorSpace } = BRICK_TEXTURES[name];
        const texture = await loader.loadAsync(url);
        texture.colorSpace = colorSpace;
        texture.wrapS = TEXTURE_WRAP_S;
        texture.wrapT = TEXTURE_WRAP_T;
        texture.repeat.set(TEXTURE_REPEAT_X, TEXTURE_REPEAT_Y);
        this.textures[name] = texture;
      }),
    );
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
    const { aoMap, displacementMap, map, normalMap, roughnessMap, ...rest } =
      this._args;
    this.update({
      ...rest,
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
        label: "aoMap",
        imageUrl: BRICK_TEXTURES.aoMap.url,
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
        imageUrl: BRICK_TEXTURES.displacementMap.url,
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
        imageUrl: BRICK_TEXTURES.map.url,
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
        imageUrl: BRICK_TEXTURES.normalMap.url,
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
        imageUrl: BRICK_TEXTURES.roughnessMap.url,
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

export default BrickMaterialHelper;
