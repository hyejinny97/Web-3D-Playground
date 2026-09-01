import * as THREE from "three";
import type { ControlUIType } from "@/types/project";
import type { LineDashedMaterialHelperType } from "../LineMaterialsProject.types";
import type { HEX } from "@jinni-labs/ui/types";
import MaterialHelper from "./MaterialHelper";
import {
  DEFAULT_COLOR,
  PROPERTIES_NEED_UPDATE,
} from "../LineMaterialsProject.constants";

const DEFAULT_ARGS = {
  color: new THREE.Color(DEFAULT_COLOR),
  fog: true,
  scale: 1,
  dashSize: 3,
  gapSize: 1,
} as const;

class LineDashedMaterialHelper implements LineDashedMaterialHelperType {
  private controlUIGroupName = "LineDashedMaterial";
  private _args: LineDashedMaterialHelperType["args"];
  private _material: THREE.LineDashedMaterial;
  private _materialHelper: MaterialHelper;
  controlUI: ControlUIType;

  constructor(controlUI: ControlUIType) {
    this.controlUI = controlUI;
    this._args = { ...DEFAULT_ARGS };
    this._materialHelper = new MaterialHelper(controlUI);
    this._material = new THREE.LineDashedMaterial({
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

  update(properties: THREE.LineDashedMaterialParameters) {
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
        type: "range",
        label: "scale",
        min: 0.1,
        max: 2,
        step: 0.1,
        initValue: this._args.scale,
        onChange: (value) => {
          this._args.scale = value;
          this.update({ scale: this._args.scale });
        },
      },
      {
        type: "range",
        label: "dashSize",
        min: 1,
        max: 10,
        step: 1,
        initValue: this._args.dashSize,
        onChange: (value) => {
          this._args.dashSize = value;
          this.update({ dashSize: this._args.dashSize });
        },
      },
      {
        type: "range",
        label: "gapSize",
        min: 1,
        max: 10,
        step: 1,
        initValue: this._args.gapSize,
        onChange: (value) => {
          this._args.gapSize = value;
          this.update({ gapSize: this._args.gapSize });
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

export default LineDashedMaterialHelper;
