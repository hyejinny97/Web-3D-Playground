import { useCallback, useLayoutEffect, useRef, useState } from "react";
import KoreaProject from "@/projects/KoreaProject";
import type { Project } from "@/types/project";
import Popper from "@jinni-labs/ui/Popper";
import useControl from "@/hooks/useControl";
import Button from "@jinni-labs/ui/Button";
import Text from "@jinni-labs/ui/Text";
import ArrowLeftIcon from "@/components/icons/ArrowLeftIcon";

const INIT_POSITION = { left: 0, top: 0 };

const KoreaCanvas = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const projectRef = useRef<KoreaProject>(undefined);
  const { add, remove, removeGroup, clearAll } = useControl();
  const [isModelSelected, setIsModelSelected] = useState<boolean>(false);
  const [anchorPosition, setAnchorPosition] = useState<{
    left: number;
    top: number;
  }>(INIT_POSITION);
  const [popperContent, setPopperContent] = useState("");
  const isPopperOpened = !!popperContent;

  const onModelSelect = useCallback(() => {
    setIsModelSelected(true);
  }, []);
  const reset = () => {
    setIsModelSelected(false);
    if (projectRef.current) {
      projectRef.current.reset();
    }
  };

  const openPopper = (
    content: string,
    position: { left: number; top: number },
  ) => {
    setAnchorPosition(position);
    setPopperContent(content);
  };
  const closePopper = () => {
    setAnchorPosition(INIT_POSITION);
    setPopperContent("");
  };

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const canvasEl = document.createElement("canvas");
    canvasEl.className = "w-full h-full";
    canvasEl.id = String(Date.now());
    container.appendChild(canvasEl);

    const project = new KoreaProject({
      canvasEl,
      controlUI: { add, remove, removeGroup, clearAll },
      openPopper,
      closePopper,
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
    <>
      <div ref={containerRef} className="relative w-full h-full">
        {isModelSelected ? (
          <Button
            className="absolute bottom-5 left-5 bg-[rgba(255,255,255,0.2)]!"
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
            * Please click on a region
          </Text>
        )}
      </div>
      {isPopperOpened && (
        <Popper
          className="ml-2.5 mb-1.5 px-1 bg-[rgba(0,0,0,0.7)] text-white"
          anchorReference="anchorPosition"
          anchorPosition={anchorPosition}
          popperOrigin={{ horizontal: "left", vertical: "bottom" }}
        >
          {popperContent}
        </Popper>
      )}
    </>
  );
};

export default KoreaCanvas;
