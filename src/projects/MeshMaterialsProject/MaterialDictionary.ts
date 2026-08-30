import type { ControlUIType } from "@/types/project";
import MeshBasicMaterialHelper from "./helpers/MeshBasicMaterialHelper";
import type { MaterialDictionaryType } from "./MeshMaterialsProject.types";
import MeshLambertMaterialHelper from "./helpers/MeshLambertMaterialHelper";
import MeshPhongMaterialHelper from "./helpers/MeshPhongMaterialHelper";

class MaterialDictionary implements MaterialDictionaryType {
  private _values: MaterialDictionaryType["values"];

  constructor(controlUI: ControlUIType) {
    this._values = {
      meshBasic: new MeshBasicMaterialHelper(controlUI),
      meshLambert: new MeshLambertMaterialHelper(controlUI),
      meshPhong: new MeshPhongMaterialHelper(controlUI),
    };
  }

  get values() {
    return this._values;
  }

  isMaterialName(name: string): name is keyof MaterialDictionaryType["values"] {
    return Object.keys(this._values).includes(name);
  }
}

export default MaterialDictionary;
