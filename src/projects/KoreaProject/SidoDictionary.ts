import * as THREE from "three";
import koreaGeoData from "@/assets/json/normalized_korea_geo_시도_2026.json" with { type: "json" };
import sidoInfoData from "@/assets/json/korea_시도_information.json" with { type: "json" };
import type {
  SidoDictionaryValueType,
  SidoInfoDataType,
} from "./KoreaProject.types";
import ExtrudeGeometryHelper from "./helpers/ExtrudeGeometryHelper";
import { createShapes } from "./KoreaProject.utils";

class SidoDictionary {
  private _value: SidoDictionaryValueType = {};

  constructor() {
    const infoData = this.generateSidoInfoData();
    koreaGeoData.forEach(({ codeNm, englishName, koreanName, shapes }) => {
      const geometryHelper = new ExtrudeGeometryHelper(createShapes(shapes));
      const { introduction, population, area } = infoData[codeNm];
      this._value[codeNm] = {
        englishName,
        koreanName,
        introduction,
        population,
        area,
        geometryHelper,
      };
    });
  }

  get value() {
    return this._value;
  }

  generateSidoInfoData(): SidoInfoDataType {
    const data: SidoInfoDataType = {};
    sidoInfoData.forEach(
      ({ codeNm, englishName, koreanName, population, area, introduction }) => {
        data[codeNm] = {
          englishName,
          koreanName,
          introduction,
          population: Number(population),
          area: Number(area),
        };
      },
    );
    return data;
  }

  getAllCodeNms(): number[] {
    return Object.keys(this._value).map(Number);
  }

  validateCodeNm(codeNm: number) {
    if (!this.getAllCodeNms().includes(codeNm)) {
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
