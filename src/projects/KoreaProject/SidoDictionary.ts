import * as THREE from "three";
import koreaGeoData from "@/assets/json/normalized_korea_geo_시도_2026.json" with { type: "json" };
import type { SidoDictionaryValueType } from "./KoreaProject.types";
import ExtrudeGeometryHelper from "./helpers/ExtrudeGeometryHelper";
import { createShapes } from "./KoreaProject.utils";

class SidoDictionary {
  private _value: SidoDictionaryValueType = {};

  constructor() {
    koreaGeoData.forEach(({ codeNm, englishName, koreanName, shapes }) => {
      const geometryHelper = new ExtrudeGeometryHelper(createShapes(shapes));
      this._value[codeNm] = {
        englishName,
        koreanName,
        geometryHelper,
      };
    });
  }

  get value() {
    return this._value;
  }

  validateCodeNm(codeNm: number) {
    if (!Object.keys(this._value).includes(String(codeNm))) {
      throw new Error(`'${codeNm}' codeNm은 존재하지 않습니다.`);
    }
  }

  setModel({ codeNm, model }: { codeNm: number; model: THREE.Group }) {
    this.validateCodeNm(codeNm);
    this._value[codeNm] = {
      ...this._value[codeNm],
      model,
    };
  }
}

export default SidoDictionary;
