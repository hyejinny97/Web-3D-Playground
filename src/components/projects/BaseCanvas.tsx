import { useEffect, useRef } from "react";
import BaseProject from "@/projects/BaseProject";
import type { Project } from "@/types/project";

const BaseCanvas = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const canvasEl = document.createElement("canvas");
    canvasEl.className = "w-full h-full";
    canvasEl.id = String(Date.now());
    container.appendChild(canvasEl);

    const project: Project = new BaseProject({
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

export default BaseCanvas;
