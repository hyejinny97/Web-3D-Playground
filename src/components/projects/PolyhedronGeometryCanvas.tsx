import { useEffect, useRef } from "react";
import type { Project } from "@/types/project";
import PolyhedronGeometryProject from "@/projects/PolyhedronGeometryProject";
import useControl from "@/hooks/useControl";

const PolyhedronGeometryCanvas = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { add, remove, removeGroup, clearAll } = useControl();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const canvasEl = document.createElement("canvas");
    canvasEl.className = "w-full h-full";
    canvasEl.id = String(Date.now());
    container.appendChild(canvasEl);

    const project: Project = new PolyhedronGeometryProject({
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

export default PolyhedronGeometryCanvas;
