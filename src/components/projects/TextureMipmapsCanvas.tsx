import { useCallback, useLayoutEffect, useRef } from "react";
import TextureMipmapsProject from "@/projects/TextureMipmapsProject";
import type { Project } from "@/types/project";
import useControl from "@/hooks/useControl";
import useLoad from "@/hooks/useLoading";
import useImageLoad from "@/hooks/useImageLoad";
import Loading from "../Loading";
import Grid from "@jinni-labs/ui/Grid";
import Text from "@jinni-labs/ui/Text";
import { MIN_FILTER } from "@/projects/TextureMipmapsProject/TextureMipmapsProject.constants";

const TextureMipmapsCanvas = () => {
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

    const project: Project = new TextureMipmapsProject({
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
      {isLoading ? (
        <Loading progress={progress} helpText="Loading Images..." />
      ) : (
        <Grid
          className="absolute top-1/2 left-1/2 -translate-1/2"
          rows={2}
          columns={3}
          columnSpacing={10}
        >
          {Object.keys(MIN_FILTER).map((content) => (
            <Text key={content} className="text-white! text-center">
              {content}
            </Text>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default TextureMipmapsCanvas;
