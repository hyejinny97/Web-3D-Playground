import { useCallback, useEffect, useRef, useState } from "react";
import TextGeometryProject from "@/projects/TextGeometryProject";
import type { Project } from "@/types/project";
import CircularProgress from "@jinni-labs/ui/CircularProgress";
import Text from "@jinni-labs/ui/Text";

const TextGeometryCanvas = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFontLoading, setFontLoading] = useState(false);
  const [progress, setProgress] = useState<number>(0);

  const loadStart = useCallback(() => {
    setFontLoading(true);
  }, []);

  const loading = useCallback((percent: number) => {
    setProgress(percent);
  }, []);

  const loadComplete = useCallback(() => {
    setFontLoading(false);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const canvasEl = document.createElement("canvas");
    canvasEl.className = "w-full h-full";
    canvasEl.id = String(Date.now());
    container.appendChild(canvasEl);

    const project: Project = new TextGeometryProject({
      canvasEl,
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
  }, [loadStart, loading, loadComplete]);

  return (
    <div ref={containerRef} className="relative w-full h-full">
      {isFontLoading && (
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
          <div className="relative">
            <CircularProgress
              size={60}
              value={progress}
              aria-label="파일 업로드 진행률"
            />
            <Text
              className="absolute bottom-[120%] left-[50%] transform-translate -translate-x-1/2 min-w-max typo-title-medium text-white!"
              noMargin
            >
              Loading Fonts...
            </Text>
            <Text
              className="absolute top-[50%] left-[50%] transform-translate -translate-1/2 typo-label-medium text-white!"
              noMargin
            >{`${progress}%`}</Text>
          </div>
        </div>
      )}
    </div>
  );
};

export default TextGeometryCanvas;
