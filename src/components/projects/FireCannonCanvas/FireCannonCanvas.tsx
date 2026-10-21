import { useLayoutEffect, useRef, useState } from "react";
import FireCannonProject from "@/projects/FireCannonProject";
import type { Project } from "@/types/project";
import useLoad from "@/hooks/useLoading";
import Loading from "../../Loading";
import { TUTORIALS } from "./FireCannonCanvas.constants";
import Box from "@jinni-labs/ui/Box";
import Stack from "@jinni-labs/ui/Stack";
import Text from "@jinni-labs/ui/Text";
import Button from "@jinni-labs/ui/Button";
import ArrowLeftIcon from "@/components/icons/ArrowLeftIcon";
import LinearProgress from "@jinni-labs/ui/LinearProgress";
import {
  DEFAULT_FIRE_SPEED,
  MAX_SPEED,
} from "@/projects/FireCannonProject/FireCannonProject.constants";

const FireCannonCanvas = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const projectRef = useRef<FireCannonProject>(undefined);
  const { isLoading, progress, loadStart, loading, loadComplete } = useLoad();
  const [speedProgress, setSpeedProgress] = useState(
    (DEFAULT_FIRE_SPEED / MAX_SPEED) * 100,
  ); // 단위: %
  const [isFired, setIsFired] = useState(false);

  const reset = () => {
    setIsFired(false);
    if (projectRef.current) {
      projectRef.current.reset();
    }
  };

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const canvasEl = document.createElement("canvas");
    canvasEl.className = "w-full h-full";
    canvasEl.id = String(Date.now());
    container.appendChild(canvasEl);

    const project = new FireCannonProject({
      canvasEl,
      loadManager: {
        onStart: loadStart,
        onProgress: loading,
        onLoad: loadComplete,
      },
      setSpeedProgress,
      setIsFired,
    }) satisfies Project;
    if ((project as Project).loop) project.renderLoop();
    else project.render();
    projectRef.current = project;

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
        <>
          <Box
            className="absolute left-6 top-6 p-2 bg-[rgba(0,0,0,0.5)]"
            round="sm"
          >
            {TUTORIALS.map(({ label, content }) => (
              <Stack direction="row" spacing={5}>
                <Text className="typo-body-medium w-20 text-white!">
                  {label}
                </Text>
                <Text className="typo-body-small text-white!">: {content}</Text>
              </Stack>
            ))}
          </Box>
          <LinearProgress
            className="absolute! bottom-5 left-3 h-75!"
            value={speedProgress}
            aria-label="car speed"
            orientation="vertical"
            thickness={10}
            lineCap="round"
            trackColor="#fff5"
            progressColor="blue-300"
          />
          {isFired && (
            <Button
              className="absolute top-5 right-5"
              variant="outlined"
              color="white"
              size="lg"
              shape="pill"
              startAdornment={<ArrowLeftIcon className="fill-white" />}
              onClick={reset}
            >
              Reset
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export default FireCannonCanvas;
