import type { ControlUIType } from "@/types/project";
import type {
  DirectionType,
  FontsType,
  GeometryHelper,
} from "../TextGeometryProject.types";
import { TextGeometry } from "three/examples/jsm/Addons.js";
import { DIRECTION } from "../TextGeometryProject.constants";

const DEFAULT_ARGS = {
  text: "",
  font: "",
  size: 100,
  direction: "ltr",
  curveSegments: 12,
  steps: 1,
  depth: 50,
  bevelEnabled: false,
  bevelThickness: 10,
  bevelSize: 8,
  bevelOffset: 0,
  bevelSegments: 3,
} as const;

class TextGeometryHelper implements GeometryHelper {
  private controlUIGroupName = "TextGeometry";
  private _args: GeometryHelper["args"];
  private fonts: FontsType;
  controlUI: ControlUIType;

  constructor(
    controlUI: ControlUIType,
    fonts: FontsType,
    initFont: string,
    initText: string,
  ) {
    this.controlUI = controlUI;
    this.fonts = fonts;
    this.validateFont(initFont);
    this._args = { ...DEFAULT_ARGS, text: initText, font: initFont };
  }

  get args() {
    return this._args;
  }

  validateFont(font: string) {
    if (!Object.keys(this.fonts).includes(font)) {
      throw new Error(`'${font}' font는 존재하지 않습니다.`);
    }
  }

  createGeometry() {
    const geometry = new TextGeometry(this._args.text, {
      font: this.fonts[this._args.font],
      size: this._args.size,
      direction: this._args.direction,
      curveSegments: this._args.curveSegments,
      steps: this._args.steps,
      depth: this._args.depth,
      bevelEnabled: this._args.bevelEnabled,
      bevelThickness: this._args.bevelThickness,
      bevelSize: this._args.bevelSize,
      bevelOffset: this._args.bevelOffset,
      bevelSegments: this._args.bevelSegments,
    });
    geometry.center();
    return geometry;
  }

  createControlUI(update: (updateZoom?: boolean) => void) {
    this.controlUI.add(this.controlUIGroupName, [
      {
        type: "text-input",
        label: "text",
        initValue: this._args.text,
        onChange: (value) => {
          this._args.text = value;
          update(value.length !== 0);
        },
      },
      {
        type: "select",
        label: "font",
        options: Object.keys(this.fonts).map((name) => ({
          label: name,
          value: name,
        })),
        initValue: this._args.font,
        onChange: (value) => {
          this._args.font = value as string;
          update();
        },
      },
      {
        type: "select",
        label: "direction",
        options: DIRECTION.map((dir) => ({ label: dir, value: dir })),
        initValue: this._args.direction,
        onChange: (value) => {
          this._args.direction = value as DirectionType;
          update(true);
        },
      },
      {
        type: "range",
        label: "size",
        min: 50,
        max: 150,
        step: 1,
        initValue: this._args.size,
        onChange: (value) => {
          this._args.size = value;
          update();
        },
      },
    ]);
    this.controlUI.add("ExtrudeGeometry", [
      {
        type: "range",
        label: "curveSegments",
        min: 1,
        max: 20,
        step: 1,
        initValue: this._args.curveSegments,
        onChange: (value) => {
          this._args.curveSegments = value;
          update();
        },
      },
      {
        type: "range",
        label: "steps",
        min: 1,
        max: 20,
        step: 1,
        initValue: this._args.steps,
        onChange: (value) => {
          this._args.steps = value;
          update();
        },
      },
      {
        type: "range",
        label: "depth",
        min: 30,
        max: 70,
        step: 1,
        initValue: this._args.depth,
        onChange: (value) => {
          this._args.depth = value;
          update();
        },
      },
      {
        type: "checkbox",
        label: "bevelEnabled",
        initChecked: this._args.bevelEnabled,
        onChange: (value) => {
          this._args.bevelEnabled = value;
          update();
        },
      },
      {
        type: "range",
        label: "bevelThickness",
        min: 0,
        max: 20,
        step: 1,
        initValue: this._args.bevelThickness,
        onChange: (value) => {
          this._args.bevelThickness = value;
          update();
        },
      },
      {
        type: "range",
        label: "bevelSize",
        min: 0,
        max: 20,
        step: 1,
        initValue: this._args.bevelSize,
        onChange: (value) => {
          this._args.bevelSize = value;
          update();
        },
      },
      {
        type: "range",
        label: "bevelOffset",
        min: 0,
        max: 10,
        step: 1,
        marks: true,
        initValue: this._args.bevelOffset,
        onChange: (value) => {
          this._args.bevelOffset = value;
          update();
        },
      },
      {
        type: "range",
        label: "bevelSegments",
        min: 1,
        max: 10,
        step: 1,
        marks: true,
        initValue: this._args.bevelSegments,
        onChange: (value) => {
          this._args.bevelSegments = value;
          update();
        },
      },
    ]);
  }
}

export default TextGeometryHelper;
