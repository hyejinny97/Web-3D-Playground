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
  scene: THREE.Scene;

  constructor(controlUI: ControlUIType, scene: THREE.Scene) {
    this.controlUI = controlUI;
    this.scene = scene;
    this._args = { ...DEFAULT_ARGS };
    this.update();
  }

  get args() {
    return this._args;
  }

  update() {
    const { fog, fogColor, fogDensity } = this._args;
    if (fog) {
      this.scene.fog = new THREE.FogExp2(fogColor, fogDensity);
    } else {
      this.scene.fog = null;
    }
  }

  createControlUI() {
    this.controlUI.add(this.controlUIGroupName, [
      {
        type: "checkbox",
        label: "fog",
        initChecked: this._args.fog,
        onChange: (value) => {
          this._args.fog = value;
          this.update();
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
          this.update();
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
          this.update();
        },
      },
    ]);
  }

  reset() {
    this._args = { ...DEFAULT_ARGS };
    this.update();
    this.controlUI.removeGroup(this.controlUIGroupName);
  }
}

export default FogHelper;
