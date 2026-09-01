import * as THREE from "three";
import type { ControlUIType } from "@/types/project";
import type { MaterialHelperType } from "../LineMaterialsProject.types";

const DEFAULT_ARGS = {
  transparent: false,
  opacity: 1,
  visible: true,
} as const;

class MaterialHelper implements MaterialHelperType {
  private controlUIGroupName = "Material";
  private _args: MaterialHelperType["args"];
  controlUI: ControlUIType;

  constructor(controlUI: ControlUIType) {
    this.controlUI = controlUI;
    this._args = { ...DEFAULT_ARGS };
  }

  get args() {
    return this._args;
  }

  createControlUI(update: (properties: THREE.MaterialParameters) => void) {
    this.controlUI.add(this.controlUIGroupName, [
      {
        type: "checkbox",
        label: "transparent",
        initChecked: this._args.transparent,
        onChange: (value) => {
          this._args.transparent = value;
          update({ transparent: this._args.transparent });
        },
      },
      {
        type: "range",
        label: "opacity",
        min: 0,
        max: 1,
        step: 0.1,
        initValue: this._args.opacity,
        onChange: (value) => {
          this._args.opacity = value;
          update({ opacity: this._args.opacity });
        },
      },
      {
        type: "checkbox",
        label: "visible",
        initChecked: this._args.visible,
        onChange: (value) => {
          this._args.visible = value;
          update({ visible: this._args.visible });
        },
      },
    ]);
  }

  reset(update: (properties: THREE.MaterialParameters) => void) {
    this._args = { ...DEFAULT_ARGS };
    update(this._args);
    this.controlUI.removeGroup(this.controlUIGroupName);
  }
}

export default MaterialHelper;
