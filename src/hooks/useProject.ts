import ProjectContext, {
  type ProjectContextType,
} from "@/contexts/ProjectContext";
import { useContext } from "react";

const useProject = (): ProjectContextType => {
  const value = useContext(ProjectContext);
  if (!value) throw new Error("ProjectContext value is null");
  return value;
};

export default useProject;
