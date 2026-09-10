import type { ControlUIType } from "@/types/project";
import type { MaterialDictionaryType } from "./TextureMappingProject.types";
import BrickMaterialHelper from "./helpers/BrickMaterialHelper";
import IceMaterialHelper from "./helpers/IceMaterialHelper";
import LavaMaterialHelper from "./helpers/LavaMaterialHelper";
import FabricMaterialHelper from "./helpers/FabricMaterialHelper";
import GlassMaterialHelper from "./helpers/GlassMaterialHelper";

class MaterialDictionary implements MaterialDictionaryType {
  private _values: MaterialDictionaryType["values"];

  constructor(
    controlUI: ControlUIType,
    loadTextureImages: (urls: string[]) => Promise<HTMLImageElement[]>,
  ) {
    this._values = {
      Brick: {
        helper: new BrickMaterialHelper(controlUI, loadTextureImages),
        initiated: false,
      },
      Ice: {
        helper: new IceMaterialHelper(controlUI, loadTextureImages),
        initiated: false,
      },
      Lava: {
        helper: new LavaMaterialHelper(controlUI, loadTextureImages),
        initiated: false,
      },
      Fabric: {
        helper: new FabricMaterialHelper(controlUI, loadTextureImages),
        initiated: false,
      },
      Glass: {
        helper: new GlassMaterialHelper(controlUI, loadTextureImages),
        initiated: false,
      },
    };
  }

  get values() {
    return this._values;
  }
}

export default MaterialDictionary;
