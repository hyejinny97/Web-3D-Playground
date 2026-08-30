import { TAGS } from "./tags";
import { lazy } from "react";
import image_url_basic_geometries from "@/assets/images/projects/basic_geometries.png";
import image_url_polyhedron_geometry from "@/assets/images/projects/polyhedron_geometry.png";
import image_url_extrude_geometry from "@/assets/images/projects/extrude_geometry.png";
import image_url_text_geometry from "@/assets/images/projects/text_geometry.png";
import image_url_shape_geometry from "@/assets/images/projects/shape_geometry.png";
import image_url_korea from "@/assets/images/projects/korea.png";
import image_url_lathe_geometry from "@/assets/images/projects/lathe_geometry.png";
import image_url_parametric_geometry from "@/assets/images/projects/parametric_geometry.png";
import image_url_wireframe_edges_geometry from "@/assets/images/projects/wireframe_edges_geometry.png";
import image_url_tube_geometry from "@/assets/images/projects/tube_geometry.png";

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
  {
    id: "shape-geometry",
    title: "ShapeGeometry",
    imageUrl: image_url_shape_geometry,
    tags: [TAGS.geometry],
    component: lazy(() => import("@/components/projects/ShapeGeometryCanvas")),
  },
  {
    id: "extrude-geometry",
    title: "ExtrudeGeometry",
    imageUrl: image_url_extrude_geometry,
    tags: [TAGS.geometry, TAGS.raycaster],
    component: lazy(
      () => import("@/components/projects/ExtrudeGeometryCanvas"),
    ),
  },
  {
    id: "text-geometry",
    title: "TextGeometry",
    imageUrl: image_url_text_geometry,
    tags: [TAGS.geometry],
    component: lazy(() => import("@/components/projects/TextGeometryCanvas")),
  },
  {
    id: "lathe-geometry",
    title: "LatheGeometry",
    imageUrl: image_url_lathe_geometry,
    tags: [TAGS.geometry],
    component: lazy(() => import("@/components/projects/LatheGeometryCanvas")),
  },
  {
    id: "parametric-geometry",
    title: "ParametricGeometry",
    imageUrl: image_url_parametric_geometry,
    tags: [TAGS.geometry],
    component: lazy(
      () => import("@/components/projects/ParametricGeometryCanvas"),
    ),
  },
  {
    id: "edges-geometry",
    title: "Wireframe/EdgesGeometry",
    imageUrl: image_url_wireframe_edges_geometry,
    tags: [TAGS.geometry, TAGS.raycaster],
    component: lazy(() => import("@/components/projects/EdgesGeometryCanvas")),
  },
  {
    id: "tube-geometry",
    title: "TubeGeometry",
    imageUrl: image_url_tube_geometry,
    tags: [TAGS.geometry],
    component: lazy(() => import("@/components/projects/TubeGeometryCanvas")),
  },
  {
    id: "korea",
    title: "Korea",
    imageUrl: image_url_korea,
    tags: [TAGS.geometry, TAGS.raycaster],
    component: lazy(() => import("@/components/projects/KoreaCanvas")),
  },
  {
    id: "mesh-materials",
    title: "MeshMaterials",
    imageUrl: "",
    tags: [TAGS.material, TAGS.raycaster],
    component: lazy(() => import("@/components/projects/MeshMaterialsCanvas")),
  },
];

export const ALL_PROJECTS = [BASIC_PROJECT, ...MODEL_PROJECTS];

export const PROJECTS_BY_DOMAIN = [
  { domain: "Model", projects: MODEL_PROJECTS },
];
