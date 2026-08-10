import * as THREE from "three";
import type { ControlUIType } from "@/types/project";
import type { GeometryDictionaryType } from "./PolyhedronGeometryProject.types";
import TetrahedronGeometryHelper from "./helpers/TetrahedronGeometryHelper";
import OctahedronGeometryHelper from "./helpers/OctahedronGeometryHelper";
import DodecahedronGeometryHelper from "./helpers/DodecahedronGeometryHelper";
import IcosahedronGeometryHelper from "./helpers/IcosahedronGeometryHelper";

class GeometryDictionary implements GeometryDictionaryType {
  private _value: GeometryDictionaryType["value"];

  constructor(controlUI: ControlUIType) {
    this._value = {
      tetra: {
        helper: new TetrahedronGeometryHelper(controlUI, "TetrahedronGeometry"),
      },
      octa: {
        helper: new OctahedronGeometryHelper(controlUI, "OctahedronGeometry"),
      },
      dodeca: {
        helper: new DodecahedronGeometryHelper(
          controlUI,
          "DodecahedronGeometry",
        ),
      },
      icosa: {
        helper: new IcosahedronGeometryHelper(controlUI, "IcosahedronGeometry"),
      },
    };
  }

  get value() {
    return this._value;
  }

  setModel(name: string, model: THREE.Group) {
    if (!Object.keys(this._value).some((key) => key === name))
      throw new Error(`'${name}' name은 GeometryDictionary에 없습니다.`);

    this._value[name].model = model;
  }
}

export default GeometryDictionary;
