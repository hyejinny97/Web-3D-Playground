import type { ControlUIType } from "@/types/project";
import type { MaterialDictionaryType } from "./TextureMappingProject.types";
import BrickMaterialHelper from "./helpers/BrickMaterialHelper";

class MaterialDictionary implements MaterialDictionaryType {
  private _values: MaterialDictionaryType["values"];

  constructor(controlUI: ControlUIType) {
    this._values = {
      brick: {
        helper: new BrickMaterialHelper(controlUI),
        initiated: false,
      },
    };
  }

  get values() {
    return this._values;
  }
}

export default MaterialDictionary;
