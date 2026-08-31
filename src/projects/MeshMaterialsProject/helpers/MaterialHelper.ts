import * as THREE from "three";
import type { ControlUIType } from "@/types/project";
import type {
  MaterialHelperType,
  SideType,
} from "../MeshMaterialsProject.types";
import { SIDES } from "../MeshMaterialsProject.constants";

const DEFAULT_ARGS = {
  transparent: false,
  opacity: 1,
  alphaTest: 0,
  side: THREE.FrontSide,
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
        type: "range",
        label: "alphaTest",
        min: 0,
        max: 1,
        step: 0.1,
        initValue: this._args.alphaTest,
        onChange: (value) => {
          this._args.alphaTest = value;
          update({ alphaTest: this._args.alphaTest });
        },
      },
      {
        type: "select",
        label: "side",
        options: Object.entries(SIDES).map(([name, value]) => ({
          label: name,
          value: value,
        })),
        initValue: this._args.side,
        onChange: (value) => {
          this._args.side = value as SideType;
          update({ side: this._args.side });
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
