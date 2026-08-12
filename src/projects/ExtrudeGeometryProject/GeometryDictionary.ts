import * as THREE from "three";
import type { ControlUIType } from "@/types/project";
import RectangleHelper from "./helpers/RectangleHelper";
import type {
  GeometryHelper,
  GeometryItemType,
} from "./ExtrudeGeometryProject.types";
import FilledHeartHelper from "./helpers/FilledHeartHelper";
import OutlinedHeartHelper from "./helpers/OutlinedHeartHelper";

const createGeometryItem = <H extends GeometryHelper>(
  item: GeometryItemType<H>,
): GeometryItemType<H> => {
  return item;
};

class GeometryDictionary {
  private _value;

  constructor(controlUI: ControlUIType) {
    this._value = {
      rectangle: createGeometryItem({
        helper: new RectangleHelper(controlUI),
      }),
      filledHeart: createGeometryItem({
        helper: new FilledHeartHelper(controlUI),
      }),
      outlinedHeart: createGeometryItem({
        helper: new OutlinedHeartHelper(controlUI),
      }),
    };
  }

  get value() {
    return this._value;
  }

  isGeometryName(name: string): name is keyof typeof this._value {
    return Object.keys(this._value).some((key) => key === name);
  }

  setModel(name: string, model: THREE.Group) {
    if (!this.isGeometryName(name))
      throw new Error(`'${name}' name은 GeometryDictionary에 없습니다.`);

    this._value[name].model = model;
  }

  setPosition(name: string, position: THREE.Vector3) {
    if (!this.isGeometryName(name))
      throw new Error(`'${name}' name은 GeometryDictionary에 없습니다.`);

    this._value[name].position = position;
  }
}

export default GeometryDictionary;
