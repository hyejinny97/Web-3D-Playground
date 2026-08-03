import { TAGS } from "./tags";

export const BASE_PROJECT = {
  id: "base",
  title: "",
  tags: [],
  module: () => import("@/projects/base.project"),
  loop: true,
};

const MODEL_PROJECTS = [
  {
    id: "geometries",
    title: "Geometries",
    imageUrl: "",
    tags: [TAGS.geometry, TAGS.raycaster],
    module: () => import("@/projects/geometries.project"),
    loop: true,
  },
];

export const ALL_PROJECTS = [BASE_PROJECT, ...MODEL_PROJECTS];

export const PROJECTS_BY_DOMAIN = [
  { domain: "Model", projects: MODEL_PROJECTS },
];
