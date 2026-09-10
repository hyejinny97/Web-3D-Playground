import type { ControlUIType } from "@/types/project";
import type { MaterialDictionaryType } from "./TextureMappingProject.types";
import BrickMaterialHelper from "./helpers/BrickMaterialHelper";
import IceMaterialHelper from "./helpers/IceMaterialHelper";
import LavaMaterialHelper from "./helpers/LavaMaterialHelper";

class MaterialDictionary implements MaterialDictionaryType {
  private _values: MaterialDictionaryType["values"];

  constructor(controlUI: ControlUIType) {
    this._values = {
      Brick: {
        helper: new BrickMaterialHelper(controlUI),
        initiated: false,
      },
      Ice: {
        helper: new IceMaterialHelper(controlUI),
        initiated: false,
      },
      Lava: {
        helper: new LavaMaterialHelper(controlUI),
        initiated: false,
      },
      Fabric: {
        helper: new BrickMaterialHelper(controlUI),
        initiated: false,
      },
      Glass: {
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
