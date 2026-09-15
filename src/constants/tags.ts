import type { ColorType } from "@jinni-labs/ui/types";

interface TagType {
  label: string;
  color: ColorType;
}

export const TAGS: { [value: string]: TagType } = {
  geometry: { label: "Geometry", color: "red-400" },
  raycaster: { label: "Raycaster", color: "amber-400" },
  material: { label: "Material", color: "blue-400" },
  transform: { label: "Transform", color: "purple-400" },
};
