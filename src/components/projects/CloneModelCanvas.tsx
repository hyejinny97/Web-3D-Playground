import { useLayoutEffect, useRef } from "react";
import CloneModelProject from "@/projects/CloneModelProject";
import type { Project } from "@/types/project";
import useLoad from "@/hooks/useLoading";
import Loading from "../Loading";

const CloneModelCanvas = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isLoading, progress, loadStart, loading, loadComplete } = useLoad();

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const canvasEl = document.createElement("canvas");
    canvasEl.className = "w-full h-full";
    canvasEl.id = String(Date.now());
    container.appendChild(canvasEl);

    const project: Project = new CloneModelProject({
      canvasEl,
      loadingOptions: {
        onStart: loadStart,
        onProgress: loading,
        onLoad: loadComplete,
      },
    });
    if (project.loop) project.renderLoop();
    else project.render();

    return () => {
      project.dispose();
      container.removeChild(canvasEl);
    };
  }, [loadStart, loading, loadComplete]);

  return (
    <div ref={containerRef} className="relative w-full h-full">
      {isLoading && <Loading progress={progress} helpText="Loading files..." />}
    </div>
  );
};

export default CloneModelCanvas;
