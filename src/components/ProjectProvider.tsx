import React, { useMemo, useState } from "react";
import ProjectContext from "@/contexts/ProjectContext";
import { BASE_PROJECT, PROJECTS_BY_DOMAIN } from "@/constants/projects";
import type { TagType } from "@/types/tags";
import { TAGS } from "@/constants/tags";

const ProjectProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    BASE_PROJECT.id,
  );
  const [searchValue, setSearchValue] = useState<string | null>(null);
  const [searchInputValueCleared, setSearchInputValueCleared] =
    useState<boolean>(false);
  const [selectedTags, setSelectedTags] = useState<TagType[]>([]);

  const projectsDisplayed = useMemo<typeof PROJECTS_BY_DOMAIN>(() => {
    if (searchValue) {
      return PROJECTS_BY_DOMAIN.map((ele) => ({
        ...ele,
        projects: ele.projects.filter((project) =>
          project.title.toLowerCase().includes(searchValue.toLowerCase()),
        ),
      }));
    }
    if (selectedTags.length > 0) {
      return PROJECTS_BY_DOMAIN.map((ele) => ({
        ...ele,
        projects: ele.projects.filter((project) =>
          selectedTags.every((selectedTag) =>
            project.tags.some((tag) => TAGS[selectedTag].label === tag.label),
          ),
        ),
      }));
    }
    return PROJECTS_BY_DOMAIN;
  }, [searchValue, selectedTags]);

  const onProjectSelect = (projectId: string) => {
    setSelectedProjectId(projectId);
  };
  const onTagSelect = (tags: TagType[]) => {
    setSelectedTags(tags);
    setSearchValue(null);
    setSearchInputValueCleared(true);
  };
  const onSearchValueChange = (value: string | null) => {
    setSearchValue(value);
    setSelectedTags([]);
  };
  const onSearchInputValueChange = () => {
    setSearchInputValueCleared(false);
  };

  return (
    <ProjectContext
      value={{
        selectedProjectId,
        onProjectSelect,
        selectedTags,
        onTagSelect,
        searchValue,
        onSearchValueChange,
        searchInputValueCleared,
        onSearchInputValueChange,
        projectsDisplayed,
      }}
    >
      {children}
    </ProjectContext>
  );
};

export default ProjectProvider;
