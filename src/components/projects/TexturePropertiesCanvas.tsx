import { useCallback, useLayoutEffect, useRef } from "react";
import TexturePropertiesProject from "@/projects/TexturePropertiesProject";
import type { Project } from "@/types/project";
import useControl from "@/hooks/useControl";
import Loading from "../Loading";
import useLoad from "@/hooks/useLoading";
import useImageLoad from "@/hooks/useImageLoad";

const TexturePropertiesCanvas = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { add, remove, removeGroup, clearAll } = useControl();
  const { isLoading, progress, loadStart, loading, loadComplete } = useLoad();
  const { loadImages } = useImageLoad();

  const loadTextureImages = useCallback(
    (urls: string[]): Promise<HTMLImageElement[]> =>
      loadImages(urls, {
        onStart: loadStart,
        onProgress: loading,
        onLoad: loadComplete,
      }),
    [loadImages, loadStart, loading, loadComplete],
  );

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const canvasEl = document.createElement("canvas");
    canvasEl.className = "w-full h-full";
    canvasEl.id = String(Date.now());
    container.appendChild(canvasEl);

    const project: Project = new TexturePropertiesProject({
      canvasEl,
      controlUI: { add, remove, removeGroup, clearAll },
      loadTextureImages,
    });
    if (project.loop) project.renderLoop();
    else project.render();

    return () => {
      project.dispose();
      container.removeChild(canvasEl);
    };
  }, [add, remove, removeGroup, clearAll, loadTextureImages]);

  return (
    <div ref={containerRef} className="relative w-full h-full">
      {isLoading && (
        <Loading progress={progress} helpText="Loading Images..." />
      )}
    </div>
  );
};

export default TexturePropertiesCanvas;
