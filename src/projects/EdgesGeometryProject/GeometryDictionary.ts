import * as THREE from "three";
import type { ControlUIType } from "@/types/project";
import type { GeometryDictionaryType } from "./EdgesGeometryProject.types";
import WireframeGeometryHelper from "./helpers/WireframeGeometryHelper";
import EdgesGeometryHelper from "./helpers/EdgesGeometryHelper";

class GeometryDictionary implements GeometryDictionaryType {
  private _values: GeometryDictionaryType["values"];

  constructor(controlUI: ControlUIType) {
    this._values = {
      wireframe: {
        helper: new WireframeGeometryHelper(controlUI),
      },
      edges: {
        helper: new EdgesGeometryHelper(controlUI),
      },
    };
  }

  get values() {
    return this._values;
  }

  isGeometryName(name: string): name is keyof GeometryDictionaryType["values"] {
    return Object.keys(this._values).some((key) => key === name);
  }

  setPosition(
    name: keyof GeometryDictionaryType["values"],
    position: THREE.Vector3,
  ) {
    this._values[name].position = position;
  }
}

export default GeometryDictionary;
