import { DRAWER_WIDTH, TRANSITION } from "@/constants/drawer";

interface CanvasProps {
  open: boolean;
}

const Canvas = ({ open }: CanvasProps) => {
  return (
    <canvas
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
