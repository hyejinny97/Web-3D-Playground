import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import data from "../assets/json/korea_geolocation.json" with { type: "json" };

const [min_latitude, min_longitude] = data.bbox;

const normalizedData = data.features.map((feature) => {
  const shapes = feature.geometry.coordinates.map((shape) =>
    shape.map((coord) => [coord[0] - min_latitude, coord[1] - min_longitude]),
  );
  return {
    codeNm: Number(feature.properties.CTPRVN_CD),
    englishName: feature.properties.CTP_ENG_NM,
    koreanName: feature.properties.CTP_KOR_NM,
    shapes,
    max_latitude: shapes
      .flat()
      .reduce((acc, shape) => Math.max(acc, shape[1]), Number.MIN_SAFE_INTEGER),
  };
});

// 위도가 높은 지역부터 낮은 지역 순으로 정렬
const descendingData = [...normalizedData].sort(
  (a, b) => b.max_latitude - a.max_latitude,
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.dirname(__dirname);
const filePath = path.join(
  srcDir,
  "assets",
  "json",
  "normalized_korea_geolocation.json",
);

const jsonString = JSON.stringify(descendingData, null, 2);
fs.writeFileSync(filePath, jsonString, "utf8");
