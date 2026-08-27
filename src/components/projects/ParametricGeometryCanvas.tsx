import { useLayoutEffect, useRef } from "react";
import ParametricGeometryProject from "@/projects/ParametricGeometryProject";
import type { Project } from "@/types/project";
import useControl from "@/hooks/useControl";

const ParametricGeometryCanvas = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { add, remove, removeGroup, clearAll } = useControl();

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const canvasEl = document.createElement("canvas");
    canvasEl.className = "w-full h-full";
    canvasEl.id = String(Date.now());
    container.appendChild(canvasEl);

    const project: Project = new ParametricGeometryProject({
      canvasEl,
      controlUI: { add, remove, removeGroup, clearAll },
    });
    if (project.loop) project.renderLoop();
    else project.render();

    return () => {
      project.dispose();
      container.removeChild(canvasEl);
    };
  }, [add, remove, removeGroup, clearAll]);

  return <div ref={containerRef} className="w-full h-full" />;
};

export default ParametricGeometryCanvas;
