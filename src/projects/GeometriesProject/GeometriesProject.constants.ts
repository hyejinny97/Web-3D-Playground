import type { GeometryDictionaryType } from "./GeometriesProject.types";
import BoxGeometryHelper from "./helpers/BoxGeometryHelper";
import CircleGeometryHelper from "./helpers/CircleGeometryHelper";
import ConeGeometryHelper from "./helpers/ConeGeometryHelper";
import CylinderGeometryHelper from "./helpers/CylinderGeometryHelper";
import PlaneGeometryHelper from "./helpers/PlaneGeometryHelper";
import RingGeometryHelper from "./helpers/RingGeometryHelper";
import SphereGeometryHelper from "./helpers/SphereGeometryHelper";
import TorusGeometryHelper from "./helpers/TorusGeometryHelper";
import TorusKnotGeometryHelper from "./helpers/TorusKnotGeometryHelper";

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
  ring: {
    helper: new RingGeometryHelper(),
  },
  plane: {
    helper: new PlaneGeometryHelper(),
  },
  torusKnot: {
    helper: new TorusKnotGeometryHelper(),
  },
} satisfies GeometryDictionaryType;
