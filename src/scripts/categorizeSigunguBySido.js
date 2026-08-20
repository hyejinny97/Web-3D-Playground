import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import data from "../assets/json/normalized_korea_geo_시군구_2026.json" with { type: "json" };

// 시도에 따라 시군구 데이터 분류
const categorizedData = {};
data.forEach((value) => {
  const sidoCodeNm = Number(String(value.codeNm).slice(0, 2));
  if (categorizedData[sidoCodeNm]) {
    categorizedData[sidoCodeNm].push(value);
  } else {
    categorizedData[sidoCodeNm] = [value];
  }
});

// 각 시도에 따라 파일 생성
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.dirname(__dirname);

Object.entries(categorizedData).map(([sidoCodeNm, data]) => {
  const filePath = path.join(
    srcDir,
    "assets",
    "json",
    `normalized_시군구_in_region_${sidoCodeNm}.json`,
  );
  const jsonString = JSON.stringify(data, null, 2);
  fs.writeFileSync(filePath, jsonString, "utf8");
});
