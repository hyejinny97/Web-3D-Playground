import { useLayoutEffect, useRef } from "react";
import HitPunchingBagProject from "@/projects/HitPunchingBagProject";
import type { Project } from "@/types/project";
import useLoad from "@/hooks/useLoading";
import Loading from "../Loading";
import Text from "@jinni-labs/ui/Text";

const HitPunchingBagCanvas = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isLoading, progress, loadStart, loading, loadComplete } = useLoad();

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const canvasEl = document.createElement("canvas");
    canvasEl.className = "w-full h-full";
    canvasEl.id = String(Date.now());
    container.appendChild(canvasEl);

    const project: Project = new HitPunchingBagProject({
      canvasEl,
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
  }, [loadStart, loading, loadComplete]);

  return (
    <div ref={containerRef} className="relative w-full h-full">
      {isLoading ? (
        <Loading progress={progress} helpText="Loading files..." />
      ) : (
        <Text className="absolute bottom-5 left-5 text-white! typo-headline-small">
          * Try hitting the punching bag.
        </Text>
      )}
    </div>
  );
};

export default HitPunchingBagCanvas;
