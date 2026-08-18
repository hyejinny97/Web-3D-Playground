import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import data from "../assets/json/korea_geo_시군구_2026.json" with { type: "json" };

// 위도/경도 최솟값 찾기
let [min_latitude, min_longitude, max_latitude, max_longitude] = [
  Number.MAX_SAFE_INTEGER,
  Number.MAX_SAFE_INTEGER,
  Number.MIN_SAFE_INTEGER,
  Number.MIN_SAFE_INTEGER,
];

const coordinates = data.features
  .map((feature) => feature.geometry.coordinates)
  .flat(Infinity);
coordinates.forEach((val, idx) => {
  if (idx % 2 === 0) {
    min_longitude = Math.min(min_longitude, val);
    max_longitude = Math.max(max_longitude, val);
  } else {
    min_latitude = Math.min(min_latitude, val);
    max_latitude = Math.max(max_latitude, val);
  }
});

console.log(min_latitude, min_longitude, max_latitude, max_longitude);

// 데이터 평탄화/평준화
const isFourTimesArr = (arr) =>
  Array.isArray(arr) &&
  Array.isArray(arr[0]) &&
  Array.isArray(arr[0][0]) &&
  Array.isArray(arr[0][0][0]);

const normalizedData = data.features.map((feature) => {
  const { coordinates } = feature.geometry;
  const flattenedCoordinates = isFourTimesArr(coordinates)
    ? coordinates.flat()
    : coordinates;
  const shapes = flattenedCoordinates.map((shape) =>
    shape.map((coord) => [coord[0] - min_longitude, coord[1] - min_latitude]),
  );
  return {
    codeNm: Number(feature.properties.SIG_CD),
    englishName: feature.properties.SIG_ENG_NM,
    koreanName: feature.properties.SIG_KOR_NM,
    shapes,
  };
});

// 파일 생성
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.dirname(__dirname);
const filePath = path.join(
  srcDir,
  "assets",
  "json",
  "normalized_korea_geo_시군구_2026.json",
);

const jsonString = JSON.stringify(normalizedData, null, 2);
fs.writeFileSync(filePath, jsonString, "utf8");
