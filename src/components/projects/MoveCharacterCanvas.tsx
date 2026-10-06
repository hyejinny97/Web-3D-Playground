import { useLayoutEffect, useRef } from "react";
import MoveCharacterProject from "@/projects/MoveCharacterProject";
import type { Project } from "@/types/project";

const MoveCharacterCanvas = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const canvasEl = document.createElement("canvas");
    canvasEl.className = "w-full h-full";
    canvasEl.id = String(Date.now());
    container.appendChild(canvasEl);

    const project: Project = new MoveCharacterProject({
      canvasEl,
    });
    if (project.loop) project.renderLoop();
    else project.render();

    return () => {
      project.dispose();
      container.removeChild(canvasEl);
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full" />;
};

export default MoveCharacterCanvas;
