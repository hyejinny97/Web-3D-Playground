import * as THREE from "three";
import type { ControlUIType } from "@/types/project";
import type { FogHelperType } from "../MeshMaterialsProject.types";
import type { HEX } from "@jinni-labs/ui/types";

const DEFAULT_ARGS = {
  fog: false,
  fogColor: new THREE.Color(0xffff00),
  fogDensity: 0.1,
} as const;

class FogHelper implements FogHelperType {
  private controlUIGroupName = "Scene";
  private _args: FogHelperType["args"];
  controlUI: ControlUIType;

  constructor(controlUI: ControlUIType) {
    this.controlUI = controlUI;
    this._args = { ...DEFAULT_ARGS };
  }

  get args() {
    return this._args;
  }

  createControlUI(update: () => void) {
    this.controlUI.add(this.controlUIGroupName, [
      {
        type: "checkbox",
        label: "fog",
        initChecked: this._args.fog,
        onChange: (value) => {
          this._args.fog = value;
          update();
        },
      },
      {
        type: "color",
        label: "fogColor",
        initValue: `#${this._args.fogColor.getHexString()}` as HEX,
        onChange: (value) => {
          const valueRemovedAlpha =
            value.length === 9 ? value.slice(0, 7) : value;
          this._args.fogColor = new THREE.Color().setStyle(valueRemovedAlpha);
          update();
        },
      },
      {
        type: "range",
        label: "fogDensity",
        min: 0,
        max: 0.2,
        step: 0.01,
        initValue: this._args.fogDensity,
        onChange: (value) => {
          this._args.fogDensity = value;
          update();
        },
      },
    ]);
  }

  reset(update: () => void) {
    this._args = { ...DEFAULT_ARGS };
    update();
    this.controlUI.removeGroup(this.controlUIGroupName);
  }
}

export default FogHelper;
