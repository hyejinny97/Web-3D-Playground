import { useEffect, useRef } from "react";
import { DRAWER_WIDTH, TRANSITION } from "@/constants/drawer";
import BaseProject from "@/projects/base.project";

interface CanvasProps {
  open: boolean;
}

const Canvas = ({ open }: CanvasProps) => {
  const canvasElRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvasEl = canvasElRef.current;
    if (!canvasEl) return;

    const project = new BaseProject(canvasEl);
    return () => {
      project.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasElRef}
      className="h-full"
      style={{
        width: open ? `calc(100% - ${DRAWER_WIDTH}px)` : "100%",
        marginRight: open ? `${DRAWER_WIDTH}px` : 0,
        transition: `width ${TRANSITION}, margin-right ${TRANSITION}`,
      }}
    />
  );
};

export default Canvas;
