import type { ButtonProps } from "@jinni-labs/ui/Button";

interface TagType {
  label: string;
  color: ButtonProps["color"];
}

export const TAGS: { [value: string]: TagType } = {
  geometry: { label: "Geometry", color: "red-400" },
  raycaster: { label: "Raycaster", color: "amber-400" },
  material: { label: "Material", color: "blue-400" },
};
