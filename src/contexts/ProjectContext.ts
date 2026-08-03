import { createContext } from "react";
import type { TagType } from "@/types/tags";
import type { PROJECTS_BY_DOMAIN } from "@/constants/projects";

export interface ProjectContextType {
  selectedProjectId: string;
  onProjectSelect: (projectId: string) => void;
  selectedTags: TagType[];
  onTagSelect: (tags: TagType[]) => void;
  searchValue: string | null;
  onSearchValueChange: (value: string | null) => void;
  searchInputValueCleared: boolean;
  onSearchInputValueChange: () => void;
  projectsDisplayed: typeof PROJECTS_BY_DOMAIN;
}

const ProjectContext = createContext<ProjectContextType | null>(null);

export default ProjectContext;
