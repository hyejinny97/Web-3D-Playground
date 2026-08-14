import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import data from "../../assets/json/korea_geolocation.json" with { type: "json" };

const [min_latitude, min_longitude] = data.bbox;

const normalizedData = data.features.map((feature) => {
  return {
    codeNm: Number(feature.properties.CTPRVN_CD),
    englishName: feature.properties.CTP_ENG_NM,
    koreanName: feature.properties.CTP_KOR_NM,
    shapes: feature.geometry.coordinates.map((shape) =>
      shape.map((coord) => [coord[0] - min_latitude, coord[1] - min_longitude]),
    ),
  };
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, "normalized_korea_geolocation.json");

const jsonString = JSON.stringify(normalizedData, null, 2);
fs.writeFileSync(filePath, jsonString, "utf8");
