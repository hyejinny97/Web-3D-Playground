import { useLayoutEffect, useRef } from "react";
import GLTFModelProject from "@/projects/GLTFModelProject";
import type { Project } from "@/types/project";
import useControl from "@/hooks/useControl";
import useLoad from "@/hooks/useLoading";
import Loading from "../Loading";

const GLTFModelCanvas = () => {
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

    const project: Project = new GLTFModelProject({
      canvasEl,
      controlUI: { add, remove, removeGroup, clearAll },
      loadManager: {
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
  }, [add, remove, removeGroup, clearAll, loadStart, loading, loadComplete]);

  return (
    <div ref={containerRef} className="relative w-full h-full">
      {isLoading && (
        <Loading progress={progress} helpText="Loading GLTF file..." />
      )}
    </div>
  );
};

export default GLTFModelCanvas;
