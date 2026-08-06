import type { GeometryDictionaryType } from "./GeometriesProject.types";
import BoxGeometryHelper from "./helpers/BoxGeometryHelper";

export const geometryDictionary = {
  box: {
    helper: new BoxGeometryHelper(),
  },
} satisfies GeometryDictionaryType;
