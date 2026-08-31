import * as THREE from "three";
import type { ControlUIType } from "@/types/project";
import type {
  GradientMapTextureType,
  MeshToonMaterialHelperType,
} from "../MeshMaterialsProject.types";
import type { HEX } from "@jinni-labs/ui/types";
import MaterialHelper from "./MaterialHelper";
import {
  DEFAULT_COLOR,
  GRADIENT_MAP_TEXTURES,
  PROPERTIES_NEED_UPDATE,
} from "../MeshMaterialsProject.constants";

const DEFAULT_ARGS = {
  color: new THREE.Color(DEFAULT_COLOR),
  fog: true,
  wireframe: false,
  emissive: new THREE.Color(0, 0, 0),
  emissiveIntensity: 0.1,
  gradientMap: "Tone-3",
} as const;

class MeshToonMaterialHelper implements MeshToonMaterialHelperType {
  private controlUIGroupName = "MeshToonMaterial";
  private _args: MeshToonMaterialHelperType["args"];
  private _material: THREE.MeshToonMaterial;
  private _materialHelper: MaterialHelper;
  textures: Partial<Record<GradientMapTextureType, THREE.Texture>> = {};
  controlUI: ControlUIType;

  constructor(controlUI: ControlUIType) {
    this.controlUI = controlUI;
    this._args = { ...DEFAULT_ARGS };

    this.createTextures();
    const { gradientMap, ...rest } = this._args;
    this._materialHelper = new MaterialHelper(this.controlUI);
    this._material = new THREE.MeshToonMaterial({
      ...rest,
      ...this._materialHelper.args,
      gradientMap: this.textures[gradientMap],
    });
  }

  get args() {
    return this._args;
  }

  get material() {
    return this._material;
  }

  createTextures() {
    Object.entries(GRADIENT_MAP_TEXTURES).forEach(([name, colors]) => {
      const texture = this.createGradientTexture(colors);
      this.textures[name as GradientMapTextureType] = texture;
    });
  }

  createGradientTexture(colors: number[]): THREE.DataTexture {
    const width = colors.length;
    const height = 1;
    const size = width * height;
    const data = new Uint8Array(4 * size);

    colors.forEach((color, i) => {
      const c = new THREE.Color(color);
      const stride = i * 4;
      data[stride] = Math.floor(c.r * 255);
      data[stride + 1] = Math.floor(c.g * 255);
      data[stride + 2] = Math.floor(c.b * 255);
      data[stride + 3] = 255;
    });

    const texture = new THREE.DataTexture(data, width, height);
    texture.needsUpdate = true;

    texture.colorSpace = THREE.NoColorSpace;
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    texture.generateMipmaps = false;

    return texture;
  }

  update(properties: THREE.MeshToonMaterialParameters) {
    this._material.setValues(properties);
    if (
      Object.keys(properties).some((targetPro) =>
        PROPERTIES_NEED_UPDATE.some((pro) => pro === targetPro),
      )
    ) {
      this._material.needsUpdate = true;
    }
  }

  createControlUI() {
    this.controlUI.add(this.controlUIGroupName, [
      {
        type: "color",
        label: "color",
        initValue: `#${this._args.color.getHexString()}` as HEX,
        onChange: (value) => {
          const valueRemovedAlpha =
            value.length === 9 ? value.slice(0, 7) : value;
          this._args.color = new THREE.Color().setStyle(valueRemovedAlpha);
          this.update({ color: this._args.color });
        },
      },
      {
        type: "checkbox",
        label: "fog",
        initChecked: this._args.fog,
        onChange: (value) => {
          this._args.fog = value;
          this.update({ fog: this._args.fog });
        },
      },
      {
        type: "checkbox",
        label: "wireframe",
        initChecked: this._args.wireframe,
        onChange: (value) => {
          this._args.wireframe = value;
          this.update({ wireframe: this._args.wireframe });
        },
      },
      {
        type: "color",
        label: "emissive",
        initValue: `#${this._args.emissive.getHexString()}` as HEX,
        onChange: (value) => {
          const valueRemovedAlpha =
            value.length === 9 ? value.slice(0, 7) : value;
          this._args.emissive = new THREE.Color().setStyle(valueRemovedAlpha);
          this.update({ emissive: this._args.emissive });
        },
      },
      {
        type: "range",
        label: "emissiveIntensity",
        min: 0,
        max: 2,
        step: 0.1,
        initValue: this._args.emissiveIntensity,
        onChange: (value) => {
          this._args.emissiveIntensity = value;
          this.update({ emissiveIntensity: this._args.emissiveIntensity });
        },
      },
      {
        type: "select",
        label: "gradientMap",
        options: Object.keys(GRADIENT_MAP_TEXTURES).map((name) => ({
          label: name,
          value: name,
        })),
        initValue: this._args.gradientMap,
        onChange: (value) => {
          this._args.gradientMap = value as GradientMapTextureType;
          this.update({ gradientMap: this.textures[this._args.gradientMap] });
        },
      },
    ]);

    this._materialHelper.createControlUI((properties) => {
      this.update(properties);
    });
  }

  reset() {
    this._materialHelper.reset((properties) => {
      this.update(properties);
    });
    this._args = { ...DEFAULT_ARGS };
    const { gradientMap, ...rest } = this._args;
    this.update({ ...rest, gradientMap: this.textures[gradientMap] });
    this.controlUI.removeGroup(this.controlUIGroupName);
  }
}

export default MeshToonMaterialHelper;
