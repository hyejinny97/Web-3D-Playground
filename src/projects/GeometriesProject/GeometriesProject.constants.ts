import type { GeometryDictionaryType } from "./GeometriesProject.types";
import BoxGeometryHelper from "./helpers/BoxGeometryHelper";
import CircleGeometryHelper from "./helpers/CircleGeometryHelper";
import ConeGeometryHelper from "./helpers/ConeGeometryHelper";
import CylinderGeometryHelper from "./helpers/CylinderGeometry";
import SphereGeometryHelper from "./helpers/SphereGeometryHelper";
import TorusGeometryHelper from "./helpers/TorusGeometry";

export const geometryDictionary = {
  box: {
    helper: new BoxGeometryHelper(),
  },
  circle: {
    helper: new CircleGeometryHelper(),
  },
  cone: {
    helper: new ConeGeometryHelper(),
  },
  cylinder: {
    helper: new CylinderGeometryHelper(),
  },
  torus: {
    helper: new TorusGeometryHelper(),
  },
  sphere: {
    helper: new SphereGeometryHelper(),
  },
} satisfies GeometryDictionaryType;
