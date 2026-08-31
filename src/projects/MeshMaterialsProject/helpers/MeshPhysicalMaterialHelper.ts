import * as THREE from "three";
import { HDRLoader } from "three/addons/loaders/HDRLoader.js";
import type { ControlUIType } from "@/types/project";
import type { MeshPhysicalMaterialHelperType } from "../MeshMaterialsProject.types";
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
  ior: 1.5,
  reflectivity: 0.5,
  specularColor: new THREE.Color(1, 1, 1),
  specularIntensity: 1,
  iridescence: 0,
  iridescenceIOR: 1.3,
  sheenColor: new THREE.Color(0, 0, 0),
  sheen: 0,
  sheenRoughness: 1,
  clearcoat: 0,
  clearcoatRoughness: 0,
} as const;

class MeshPhysicalMaterialHelper implements MeshPhysicalMaterialHelperType {
  private controlUIGroupName = "MeshPhysicalMaterial";
  private _args: MeshPhysicalMaterialHelperType["args"];
  private _material: THREE.MeshPhysicalMaterial;
  private _materialHelper: MaterialHelper;
  controlUI: ControlUIType;

  constructor(controlUI: ControlUIType) {
    this.controlUI = controlUI;
    this._args = { ...DEFAULT_ARGS };
    this._materialHelper = new MaterialHelper(controlUI);
    this._material = new THREE.MeshPhysicalMaterial({
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
      {
        type: "range",
        label: "ior",
        min: 1,
        max: 2.333,
        step: 0.1,
        initValue: this._args.ior,
        onChange: (value) => {
          this._args.ior = value;
          this.update({ ior: this._args.ior });
        },
      },
      {
        type: "range",
        label: "reflectivity",
        min: 0,
        max: 1,
        step: 0.1,
        initValue: this._args.reflectivity,
        onChange: (value) => {
          this._args.reflectivity = value;
          this.update({ reflectivity: this._args.reflectivity });
        },
      },
      {
        type: "color",
        label: "specularColor",
        initValue: `#${this._args.specularColor.getHexString()}` as HEX,
        onChange: (value) => {
          const valueRemovedAlpha =
            value.length === 9 ? value.slice(0, 7) : value;
          this._args.specularColor = new THREE.Color().setStyle(
            valueRemovedAlpha,
          );
          this.update({ specularColor: this._args.specularColor });
        },
      },
      {
        type: "range",
        label: "specularIntensity",
        min: 0,
        max: 1,
        step: 0.1,
        initValue: this._args.specularIntensity,
        onChange: (value) => {
          this._args.specularIntensity = value;
          this.update({ specularIntensity: this._args.specularIntensity });
        },
      },
      {
        type: "range",
        label: "iridescence",
        min: 0,
        max: 1,
        step: 0.1,
        initValue: this._args.iridescence,
        onChange: (value) => {
          this._args.iridescence = value;
          this.update({ iridescence: this._args.iridescence });
        },
      },
      {
        type: "range",
        label: "iridescenceIOR",
        min: 1,
        max: 2.333,
        step: 0.1,
        initValue: this._args.iridescenceIOR,
        onChange: (value) => {
          this._args.iridescenceIOR = value;
          this.update({ iridescenceIOR: this._args.iridescenceIOR });
        },
      },
      {
        type: "color",
        label: "sheenColor",
        initValue: `#${this._args.sheenColor.getHexString()}` as HEX,
        onChange: (value) => {
          const valueRemovedAlpha =
            value.length === 9 ? value.slice(0, 7) : value;
          this._args.sheenColor = new THREE.Color().setStyle(valueRemovedAlpha);
          this.update({ sheenColor: this._args.sheenColor });
        },
      },
      {
        type: "range",
        label: "sheen",
        min: 0,
        max: 1,
        step: 0.1,
        initValue: this._args.sheen,
        onChange: (value) => {
          this._args.sheen = value;
          this.update({ sheen: this._args.sheen });
        },
      },
      {
        type: "range",
        label: "sheenRoughness",
        min: 0,
        max: 1,
        step: 0.1,
        initValue: this._args.sheenRoughness,
        onChange: (value) => {
          this._args.sheenRoughness = value;
          this.update({ sheenRoughness: this._args.sheenRoughness });
        },
      },
      {
        type: "range",
        label: "clearcoat",
        min: 0,
        max: 1,
        step: 0.1,
        initValue: this._args.clearcoat,
        onChange: (value) => {
          this._args.clearcoat = value;
          this.update({ clearcoat: this._args.clearcoat });
        },
      },
      {
        type: "range",
        label: "clearcoatRoughness",
        min: 0,
        max: 1,
        step: 0.1,
        initValue: this._args.clearcoatRoughness,
        onChange: (value) => {
          this._args.clearcoatRoughness = value;
          this.update({ clearcoatRoughness: this._args.clearcoatRoughness });
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

export default MeshPhysicalMaterialHelper;
