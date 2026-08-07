import { TAGS } from "./tags";
import { lazy } from "react";

export const BASIC_PROJECT = {
  id: "base",
  title: "",
  tags: [],
  component: lazy(() => import("@/components/projects/BasicCanvas")),
};

const MODEL_PROJECTS = [
  {
    id: "geometries",
    title: "Geometries",
    imageUrl: "",
    tags: [TAGS.geometry, TAGS.raycaster],
    component: lazy(() => import("@/components/projects/GeometriesCanvas")),
  },
];

export const ALL_PROJECTS = [BASIC_PROJECT, ...MODEL_PROJECTS];

export const PROJECTS_BY_DOMAIN = [
  { domain: "Model", projects: MODEL_PROJECTS },
];
