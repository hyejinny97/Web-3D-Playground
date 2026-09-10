import { useLayoutEffect, useRef } from "react";
import TextGeometryProject from "@/projects/TextGeometryProject";
import type { Project } from "@/types/project";
import useControl from "@/hooks/useControl";
import Loading from "../Loading";
import useLoad from "@/hooks/useLoading";

const TextGeometryCanvas = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { add, remove, removeGroup, clearAll } = useControl();
  const { isLoading, progress, loadStart, loading, loadComplete } = useLoad();

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const canvasEl = document.createElement("canvas");
    canvasEl.className = "w-full h-full";
    canvasEl.id = String(Date.now());
    container.appendChild(canvasEl);

    const project: Project = new TextGeometryProject({
      canvasEl,
      controlUI: { add, remove, removeGroup, clearAll },
      loadStart,
      loading,
      loadComplete,
    });
    if (project.loop) project.renderLoop();
    else project.render();

    return () => {
      project.dispose();
      container.removeChild(canvasEl);
    };
  }, [add, remove, removeGroup, clearAll, loadStart, loading, loadComplete]);

  return (
    <div ref={containerRef} className="relative w-full h-full">
      {isLoading && (
        <Loading
          className="bg-black"
          progress={progress}
          helpText="Loading Fonts..."
        />
      )}
    </div>
  );
};

export default TextGeometryCanvas;
