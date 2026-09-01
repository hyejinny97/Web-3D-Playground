import type { ControlUIType } from "@/types/project";
import type { MaterialDictionaryType } from "./LineMaterialsProject.types";
import LineBasicMaterialHelper from "./helpers/LineBasicMaterialHelper";
import LineDashedMaterialHelper from "./helpers/LineDashedMaterialHelper";

class MaterialDictionary implements MaterialDictionaryType {
  private _values: MaterialDictionaryType["values"];

  constructor(controlUI: ControlUIType) {
    this._values = {
      lineBasic: new LineBasicMaterialHelper(controlUI),
      lineDashed: new LineDashedMaterialHelper(controlUI),
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
