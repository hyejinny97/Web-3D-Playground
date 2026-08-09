import { TAGS } from "./tags";
import { lazy } from "react";
import image_url_basic_geometries from "@/assets/images/project_basic_geometries.png";

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
];

export const ALL_PROJECTS = [BASIC_PROJECT, ...MODEL_PROJECTS];

export const PROJECTS_BY_DOMAIN = [
  { domain: "Model", projects: MODEL_PROJECTS },
];
