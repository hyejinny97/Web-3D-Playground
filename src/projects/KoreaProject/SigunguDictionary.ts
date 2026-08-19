import * as THREE from "three";
import type { SigunguDictionaryValueType } from "./KoreaProject.types";
import { createShapes, fetchSigunguJsonFile } from "./KoreaProject.utils";
import ShapeGeometryHelper from "./helpers/ShapeGeometryHelper";

class SigunguDictionary {
  private _value: SigunguDictionaryValueType = {};

  constructor(sidoCodeNms: number[]) {
    sidoCodeNms.forEach(async (sidoCodeNm) => {
      const sigunguData = await fetchSigunguJsonFile(sidoCodeNm);

      this._value[sidoCodeNm] = {};
      sigunguData.forEach((data) => {
        const { codeNm: sigunguCodeNm, englishName, koreanName, shapes } = data;
        this._value[sidoCodeNm][sigunguCodeNm] = {
          englishName,
          koreanName,
          geometryHelper: new ShapeGeometryHelper(createShapes(shapes)),
        };
      });
    });
  }

  get value() {
    return this._value;
  }

  setModel({
    sidoCodeNm,
    sigunguCodeNm,
    model,
  }: {
    sidoCodeNm: number;
    sigunguCodeNm: number;
    model: THREE.Group;
  }) {
    this._value[sidoCodeNm][sigunguCodeNm].model = model;
  }
}

export default SigunguDictionary;
