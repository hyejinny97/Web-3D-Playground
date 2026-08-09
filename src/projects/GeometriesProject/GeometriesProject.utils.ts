import { geometryDictionary } from "./GeometriesProject.constants";

export const isGeometryName = (
  name: string,
): name is keyof typeof geometryDictionary =>
  Object.keys(geometryDictionary).includes(name);
