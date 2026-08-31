import * as THREE from "three";
import type { ControlUIType } from "@/types/project";
import type {
  DepthPackingType,
  MeshDepthMaterialHelperType,
} from "../MeshMaterialsProject.types";
import MaterialHelper from "./MaterialHelper";
import {
  DEPTH_PACKING,
  PROPERTIES_NEED_UPDATE,
} from "../MeshMaterialsProject.constants";

const DEFAULT_ARGS = {
  wireframe: false,
  depthPacking: THREE.BasicDepthPacking,
} as const;

class MeshDepthMaterialHelper implements MeshDepthMaterialHelperType {
  private controlUIGroupName = "MeshDepthMaterial";
  private _args: MeshDepthMaterialHelperType["args"];
  private _material: THREE.MeshDepthMaterial;
  private _materialHelper: MaterialHelper;
  controlUI: ControlUIType;

  constructor(controlUI: ControlUIType) {
    this.controlUI = controlUI;
    this._args = { ...DEFAULT_ARGS };
    this._materialHelper = new MaterialHelper(controlUI);
    this._material = new THREE.MeshDepthMaterial({
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

  update(properties: THREE.MeshDepthMaterialParameters) {
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
        type: "checkbox",
        label: "wireframe",
        initChecked: this._args.wireframe,
        onChange: (value) => {
          this._args.wireframe = value;
          this.update({ wireframe: this._args.wireframe });
        },
      },
      {
        type: "select",
        label: "depthPacking",
        options: Object.entries(DEPTH_PACKING).map(([name, value]) => ({
          label: name,
          value: value,
        })),
        initValue: this._args.depthPacking,
        onChange: (value) => {
          this._args.depthPacking = value as DepthPackingType;
          this.update({ depthPacking: this._args.depthPacking });
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

export default MeshDepthMaterialHelper;
