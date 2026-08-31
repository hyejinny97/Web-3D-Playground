import * as THREE from "three";
import { HDRLoader } from "three/addons/loaders/HDRLoader.js";
import type { ControlUIType } from "@/types/project";
import type { MeshStandardMaterialHelperType } from "../MeshMaterialsProject.types";
import type { HEX } from "@jinni-labs/ui/types";
import MaterialHelper from "./MaterialHelper";
import {
  DEFAULT_COLOR,
  PROPERTIES_NEED_UPDATE,
} from "../MeshMaterialsProject.constants";

const DEFAULT_ARGS = {
  color: new THREE.Color(DEFAULT_COLOR),
  fog: true,
  wireframe: false,
  emissive: new THREE.Color(0, 0, 0),
  emissiveIntensity: 0.1,
  metalness: 0,
  roughness: 1,
} as const;

class MeshStandardMaterialHelper implements MeshStandardMaterialHelperType {
  private controlUIGroupName = "MeshStandardMaterial";
  private _args: MeshStandardMaterialHelperType["args"];
  private _material: THREE.MeshStandardMaterial;
  private _materialHelper: MaterialHelper;
  controlUI: ControlUIType;

  constructor(controlUI: ControlUIType) {
    this.controlUI = controlUI;
    this._args = { ...DEFAULT_ARGS };
    this._materialHelper = new MaterialHelper(controlUI);
    this._material = new THREE.MeshStandardMaterial({
      ...this._args,
      ...this._materialHelper.args,
    });
    this.setEnvMap();
  }

  get args() {
    return this._args;
  }

  get material() {
    return this._material;
  }

  async setEnvMap() {
    const loader = new HDRLoader();
    const texture = await loader.loadAsync("/textures/pure_sky.hdr");
    texture.mapping = THREE.EquirectangularReflectionMapping;
    this._material.envMap = texture;
    this._material.needsUpdate = true;
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
        type: "range",
        label: "metalness",
        min: 0,
        max: 1,
        step: 0.1,
        initValue: this._args.metalness,
        onChange: (value) => {
          this._args.metalness = value;
          this.update({ metalness: this._args.metalness });
        },
      },
      {
        type: "range",
        label: "roughness",
        min: 0,
        max: 1,
        step: 0.1,
        initValue: this._args.roughness,
        onChange: (value) => {
          this._args.roughness = value;
          this.update({ roughness: this._args.roughness });
        },
      },
      { type: "plain-text", label: "envMap", content: `'pure_sky.hdr'` },
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
    this.update(this._args);
    this.controlUI.removeGroup(this.controlUIGroupName);
  }
}

export default MeshStandardMaterialHelper;
