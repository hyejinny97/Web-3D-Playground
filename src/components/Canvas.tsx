import { Suspense } from "react";
import { DRAWER_WIDTH, TRANSITION } from "@/constants/drawer";
import useProject from "@/hooks/useProject";
import { ALL_PROJECTS } from "@/constants/projects";
import CircularProgress from "@jinni-labs/ui/CircularProgress";

interface CanvasProps {
  open: boolean;
}

const Canvas = ({ open }: CanvasProps) => {
  const { selectedProjectId } = useProject();

  const selectedProject = ALL_PROJECTS.find(
    (project) => selectedProjectId === project.id,
  );
  if (!selectedProject) return;

  const ProjectCanvas = selectedProject.component;

  return (
    <div
      className="h-full flex justify-center items-center"
      style={{
        width: open ? `calc(100% - ${DRAWER_WIDTH}px)` : "100%",
        marginRight: open ? `${DRAWER_WIDTH}px` : 0,
        transition: `width ${TRANSITION}, margin-right ${TRANSITION}`,
      }}
    >
      <Suspense fallback={<CircularProgress size="lg" />}>
        <ProjectCanvas />
      </Suspense>
    </div>
  );
};

export default Canvas;
