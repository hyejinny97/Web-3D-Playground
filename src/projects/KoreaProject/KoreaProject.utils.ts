import * as THREE from "three";
import type { JSONDataType } from "./KoreaProject.types";

export const createShapes = (shapes: number[][][]): THREE.Shape[] => {
  const totalShapes: THREE.Shape[] = [];
  shapes.forEach((shape) => {
    const subShape = new THREE.Shape();
    shape.forEach((coord, idx) => {
      if (idx === 0) {
        subShape.moveTo(coord[0], coord[1]);
      } else {
        subShape.lineTo(coord[0], coord[1]);
      }
    });
    totalShapes.push(subShape);
  });
  return totalShapes;
};

export const fetchSigunguJsonFile = async (
  sidoCodeNm: number,
): Promise<JSONDataType[]> => {
  const modules = import.meta.glob<{ default: JSONDataType[] }>(
    "../../assets/json/normalized_시군구_in_region_*.json",
  );

  const key = `../../assets/json/normalized_시군구_in_region_${sidoCodeNm}.json`;
  const loader = modules[key];
  if (!loader) {
    throw new Error(`파일을 찾을 수 없습니다: ${key}`);
  }

  const module = await loader();
  return module.default;
};
