import * as THREE from "three";
import HeartImg from "@/assets/images/icons/favorite.png";
import StarImg from "@/assets/images/icons/star.png";

export const SIDES = {
  FrontSide: THREE.FrontSide,
  BackSide: THREE.BackSide,
  DoubleSide: THREE.DoubleSide,
} as const;

export const POINT_TEXTURES = {
  Null: null,
  "Heart-shaped": HeartImg,
  "Star-shaped": StarImg,
} as const;

export const PROPERTIES_NEED_UPDATE = [
  "side",
  "flatShading",
  "transparent",
  "alphaTest",
  "fog",
  "sizeAttenuation",
  "map",
] as const;

export const GEOMETRY_SHAPES = ["Random Points", "Sphere"] as const;
