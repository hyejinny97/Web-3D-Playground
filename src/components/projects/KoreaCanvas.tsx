import { useEffect, useRef, useState } from "react";
import KoreaProject from "@/projects/KoreaProject";
import type { Project } from "@/types/project";
import Popper from "@jinni-labs/ui/Popper";

const INIT_POSITION = { left: 0, top: 0 };

const KoreaCanvas = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [anchorPosition, setAnchorPosition] = useState<{
    left: number;
    top: number;
  }>(INIT_POSITION);
  const [popperContent, setPopperContent] = useState("");
  const isPopperOpened = !!popperContent;

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

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const canvasEl = document.createElement("canvas");
    canvasEl.className = "w-full h-full";
    canvasEl.id = String(Date.now());
    container.appendChild(canvasEl);

    const project: Project = new KoreaProject({
      canvasEl,
      openPopper,
      closePopper,
    });
    if (project.loop) project.renderLoop();
    else project.render();

    return () => {
      project.dispose();
      container.removeChild(canvasEl);
    };
  }, []);

  return (
    <>
      <div ref={containerRef} className="w-full h-full" />
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
