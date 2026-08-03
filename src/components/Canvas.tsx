import { useEffect, useRef } from "react";
import { DRAWER_WIDTH, TRANSITION } from "@/constants/drawer";
import useProject from "@/hooks/useProject";
import { ALL_PROJECTS } from "@/constants/projects";
import type { Project } from "@/types/project";

interface CanvasProps {
  open: boolean;
}

const Canvas = ({ open }: CanvasProps) => {
  const canvasElRef = useRef<HTMLCanvasElement>(null);
  const { selectedProjectId } = useProject();

  useEffect(() => {
    const canvasEl = canvasElRef.current;
    if (!canvasEl) return;

    let cancelled = false;
    let project: Project | null = null;

    const renderProject = async () => {
      const data = ALL_PROJECTS.find(
        (project) => project.id === selectedProjectId,
      );
      if (!data)
        throw new Error(
          `해당 projectId(${selectedProjectId})는 존재하지 않습니다.`,
        );

      const module = await data.module();

      // cleanup이 이미 실행됐다면 project를 아예 생성하지 않고 종료
      if (cancelled) return;

      const projectClass = module.default;
      project = new projectClass(canvasEl);
      if (data.loop) project.renderLoop();
      else project.render();
    };
    renderProject();

    return () => {
      cancelled = true;
      if (project) {
        project.dispose();
      }
    };
  }, [selectedProjectId]);

  return (
    <canvas
      key={selectedProjectId}
      ref={canvasElRef}
      className="h-full"
      style={{
        width: open ? `calc(100% - ${DRAWER_WIDTH}px)` : "100%",
        marginRight: open ? `${DRAWER_WIDTH}px` : 0,
        transition: `width ${TRANSITION}, margin-right ${TRANSITION}`,
      }}
    />
  );
};

export default Canvas;
