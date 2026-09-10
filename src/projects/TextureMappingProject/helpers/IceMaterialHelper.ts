import * as THREE from "three";
import type { ControlUIType } from "@/types/project";
import type {
  IceMaterialHelperType,
  IceTextureType,
} from "../TextureMappingProject.types";
import {
  ICE_TEXTURES,
  PROPERTIES_NEED_UPDATE,
  TEXTURE_MIN_FILTER,
  TEXTURE_REPEAT_X,
  TEXTURE_REPEAT_Y,
  TEXTURE_WRAP_S,
  TEXTURE_WRAP_T,
} from "../TextureMappingProject.constants";
import type { HEX } from "@jinni-labs/ui/types";

const DEFAULT_ARGS = {
  aoMap: true,
  aoMapIntensity: 1,
  displacementMap: true,
  displacementBias: 0,
  displacementScale: 0.1,
  map: true,
  normalMap: true,
  specularMap: true,
  specular: new THREE.Color(0x999999),
  shininess: 30,
} as const;

class IceMaterialHelper implements IceMaterialHelperType {
  private controlUIGroupName = "MeshPhongMaterial";
  private _args: IceMaterialHelperType["args"];
  private _material = new THREE.MeshPhongMaterial();
  private loadTextureImages: (urls: string[]) => Promise<HTMLImageElement[]>;
  textures: Partial<Record<IceTextureType, THREE.Texture>> = {};
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
    const textures = Object.entries(ICE_TEXTURES);
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
      this.textures[name as IceTextureType] = texture;
    });
  }

  update(properties: THREE.MeshPhongMaterialParameters) {
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
    const { aoMap, displacementMap, map, normalMap, specularMap, ...rest } =
      this._args;
    this.update({
      ...rest,
      aoMap: aoMap ? this.textures.aoMap : null,
      displacementMap: displacementMap ? this.textures.displacementMap : null,
      map: map ? this.textures.map : null,
      normalMap: normalMap ? this.textures.normalMap : null,
      specularMap: specularMap ? this.textures.specularMap : null,
    });
  }

  createControlUI() {
    this.controlUI.add(this.controlUIGroupName, [
      {
        type: "texture",
        label: "aoMap",
        imageUrl: ICE_TEXTURES.aoMap.url,
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
        imageUrl: ICE_TEXTURES.displacementMap.url,
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
        imageUrl: ICE_TEXTURES.map.url,
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
        imageUrl: ICE_TEXTURES.normalMap.url,
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
        label: "specularMap",
        imageUrl: ICE_TEXTURES.specularMap.url,
        initChecked: this._args.specularMap,
        onChange: (value) => {
          this._args.specularMap = value;
          this.update({
            specularMap: this._args.specularMap
              ? this.textures.specularMap
              : null,
          });
        },
      },
      {
        type: "color",
        label: "specular",
        initValue: `#${this._args.specular.getHexString()}` as HEX,
        onChange: (value) => {
          const valueRemovedAlpha =
            value.length === 9 ? value.slice(0, 7) : value;
          this._args.specular = new THREE.Color().setStyle(valueRemovedAlpha);
          this.update({ specular: this._args.specular });
        },
      },
      {
        type: "range",
        label: "shininess",
        min: 0,
        max: 100,
        step: 1,
        initValue: this._args.shininess,
        onChange: (value) => {
          this._args.shininess = value;
          this.update({ shininess: this._args.shininess });
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

export default IceMaterialHelper;
