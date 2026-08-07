import type { GeometryDictionaryType } from "./GeometriesProject.types";
import BoxGeometryHelper from "./helpers/BoxGeometryHelper";
import CircleGeometryHelper from "./helpers/CircleGeometryHelper";

export const geometryDictionary = {
  box: {
    helper: new BoxGeometryHelper(),
  },
  circle: {
    helper: new CircleGeometryHelper(),
  },
} satisfies GeometryDictionaryType;
