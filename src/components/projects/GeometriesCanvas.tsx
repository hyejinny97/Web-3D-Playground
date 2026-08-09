import { useCallback, useEffect, useRef, useState } from "react";
import GeometriesProject from "@/projects/GeometriesProject";
import type { Project } from "@/types/project";
import useControl from "@/hooks/useControl";
import Button from "@jinni-labs/ui/Button";
import Text from "@jinni-labs/ui/Text";
import ArrowLeftIcon from "@/components/icons/ArrowLeftIcon";

const GeometriesCanvas = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const projectRef = useRef<GeometriesProject>(undefined);
  const { add, remove, removeGroup, clearAll } = useControl();
  const [isModelSelected, setIsModelSelected] = useState<boolean>(false);

  const onModelSelect = useCallback(() => {
    setIsModelSelected(true);
  }, []);

  const reset = () => {
    setIsModelSelected(false);
    if (projectRef.current) {
      projectRef.current.reset();
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const canvasEl = document.createElement("canvas");
    canvasEl.className = "w-full h-full";
    canvasEl.id = String(Date.now());
    container.appendChild(canvasEl);

    const project = new GeometriesProject({
      canvasEl,
      controlUI: { add, remove, removeGroup, clearAll },
      onModelSelect,
    }) satisfies Project;
    if ((project as Project).loop) project.renderLoop();
    else project.render();
    projectRef.current = project;

    return () => {
      project.dispose();
      container.removeChild(canvasEl);
    };
  }, [add, remove, removeGroup, clearAll, onModelSelect]);

  return (
    <div ref={containerRef} className="relative w-full h-full">
      {isModelSelected ? (
        <Button
          className="absolute bottom-5 left-5"
          variant="outlined"
          color="white"
          size="lg"
          shape="pill"
          startAdornment={<ArrowLeftIcon className="fill-white" />}
          onClick={reset}
        >
          Reset
        </Button>
      ) : (
        <Text className="absolute bottom-5 left-5 text-white! typo-headline-small">
          * Try clicking on Model
        </Text>
      )}
    </div>
  );
};

export default GeometriesCanvas;
