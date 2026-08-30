import * as THREE from "three";
import type { ControlUIType } from "@/types/project";
import type { MeshLambertMaterialHelperType } from "../MeshMaterialsProject.types";
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
} as const;

class MeshLambertMaterialHelper implements MeshLambertMaterialHelperType {
  private controlUIGroupName = "MeshLambertMaterial";
  private _args: MeshLambertMaterialHelperType["args"];
  private _material: THREE.MeshLambertMaterial;
  private _materialHelper: MaterialHelper;
  controlUI: ControlUIType;

  constructor(controlUI: ControlUIType) {
    this.controlUI = controlUI;
    this._args = { ...DEFAULT_ARGS };
    this._materialHelper = new MaterialHelper(controlUI);
    this._material = new THREE.MeshLambertMaterial({
      ...this._args,
      ...this._materialHelper.args,
    });
  }

  get args() {
    return this._args;
  }

  get material() {
    return this._material;
  }

  update(properties: THREE.MeshLambertMaterialParameters) {
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

export default MeshLambertMaterialHelper;
