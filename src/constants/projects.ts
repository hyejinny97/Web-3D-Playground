import { TAGS } from "./tags";
import { lazy } from "react";
import image_url_basic_geometries from "@/assets/images/projects/basic_geometries.png";
import image_url_polyhedron_geometry from "@/assets/images/projects/polyhedron_geometry.png";

export const BASIC_PROJECT = {
  id: "base",
  title: "",
  tags: [],
  component: lazy(() => import("@/components/projects/BasicCanvas")),
};

const MODEL_PROJECTS = [
  {
    id: "geometries",
    title: "Basic geometries",
    imageUrl: image_url_basic_geometries,
    tags: [TAGS.geometry, TAGS.raycaster],
    component: lazy(() => import("@/components/projects/GeometriesCanvas")),
  },
  {
    id: "polyhedron-geometry",
    title: "PolyhedronGeometry",
    imageUrl: image_url_polyhedron_geometry,
    tags: [TAGS.geometry, TAGS.raycaster],
    component: lazy(
      () => import("@/components/projects/PolyhedronGeometryCanvas"),
    ),
  },
];

export const ALL_PROJECTS = [BASIC_PROJECT, ...MODEL_PROJECTS];

export const PROJECTS_BY_DOMAIN = [
  { domain: "Model", projects: MODEL_PROJECTS },
];
