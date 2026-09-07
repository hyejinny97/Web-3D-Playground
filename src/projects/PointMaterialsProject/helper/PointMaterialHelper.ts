import * as THREE from "three";
import type { ControlUIType } from "@/types/project";
import type {
  PointMaterialHelperType,
  PointTextureType,
} from "../PointMaterialsProject.types";
import type { HEX } from "@jinni-labs/ui/types";
import MaterialHelper from "./MaterialHelper";
import {
  POINT_TEXTURES,
  PROPERTIES_NEED_UPDATE,
} from "../PointMaterialsProject.constants";

const DEFAULT_ARGS = {
  color: new THREE.Color("#049ef4"),
  fog: true,
  size: 1,
  sizeAttenuation: true,
  map: "Null",
} as const;

class PointMaterialHelper implements PointMaterialHelperType {
  private controlUIGroupName = "PointMaterial";
  private _args: PointMaterialHelperType["args"];
  private _material!: THREE.PointsMaterial;
  private _materialHelper!: MaterialHelper;
  textures: Partial<Record<PointTextureType, THREE.Texture | null>> = {
    Null: null,
  };
  controlUI: ControlUIType;
  initiated: boolean = false;

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

  async init() {
    await this.loadTextures();
    const { map, ...rest } = this._args;
    this._materialHelper = new MaterialHelper(this.controlUI);
    this._material = new THREE.PointsMaterial({
      ...rest,
      ...this._materialHelper.args,
      map: this.textures[map],
    });
    this.initiated = true;
  }

  async loadTextures() {
    const loader = new THREE.TextureLoader();
    await Promise.allSettled(
      Object.keys(POINT_TEXTURES).map(async (key) => {
        const name = key as PointTextureType;
        const url = POINT_TEXTURES[name];
        if (!url) return;
        const texture = await loader.loadAsync(url);
        texture.colorSpace = THREE.SRGBColorSpace;
        this.textures[name] = texture;
      }),
    );
  }

  update(properties: THREE.PointsMaterialParameters) {
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
    if (!this.initiated) return;
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
        type: "range",
        label: "size",
        min: 0,
        max: 2,
        step: 0.1,
        initValue: this._args.size,
        onChange: (value) => {
          this._args.size = value;
          this.update({ size: this._args.size });
        },
      },
      {
        type: "checkbox",
        label: "sizeAttenuation",
        initChecked: this._args.sizeAttenuation,
        onChange: (value) => {
          this._args.sizeAttenuation = value;
          this.update({ sizeAttenuation: this._args.sizeAttenuation });
        },
      },
      {
        type: "select",
        label: "map",
        options: Object.keys(POINT_TEXTURES).map((name) => ({
          label: name,
          value: name,
        })),
        initValue: this._args.map,
        onChange: (value) => {
          this._args.map = value as PointTextureType;
          this.update({ map: this.textures[this._args.map] });
        },
      },
    ]);

    this._materialHelper.createControlUI((properties) => {
      this.update(properties);
    });
  }

  reset() {
    if (!this.initiated) return;
    this._materialHelper.reset((properties) => {
      this.update(properties);
    });
    this._args = { ...DEFAULT_ARGS };
    const { map, ...rest } = this._args;
    this.update({ ...rest, map: this.textures[map] });
    this.controlUI.removeGroup(this.controlUIGroupName);
  }
}

export default PointMaterialHelper;
