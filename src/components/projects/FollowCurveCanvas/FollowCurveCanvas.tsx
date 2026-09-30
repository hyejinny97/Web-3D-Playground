import { useLayoutEffect, useReducer, useRef, useState } from "react";
import FollowCurveProject from "@/projects/FollowCurveProject";
import type { Project } from "@/types/project";
import useLoad from "@/hooks/useLoading";
import Loading from "@/components/Loading";
import Stack from "@jinni-labs/ui/Stack";
import Divider from "@jinni-labs/ui/Divider";
import LinearProgress from "@jinni-labs/ui/LinearProgress";
import { INITIAL_STATE, TUTORIALS } from "./FollowCurveCanvas.constants";
import KeyboardTutorial from "@/components/KeyboardTutorial";
import { reducer } from "./FollowCurveCanvas.utils";

const FollowCurveCanvas = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isLoading, progress, loadStart, loading, loadComplete } = useLoad();
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const [speedProgress, setSpeedProgress] = useState(0); // 단위: %

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const canvasEl = document.createElement("canvas");
    canvasEl.className = "w-full h-full";
    canvasEl.id = String(Date.now());
    container.appendChild(canvasEl);

    const project: Project = new FollowCurveProject({
      canvasEl,
      loadingOptions: {
        onStart: loadStart,
        onProgress: loading,
        onLoad: loadComplete,
      },
      dispatch,
      setSpeedProgress,
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
        <Loading progress={progress} helpText="Loading GLTF file..." />
      ) : (
        <>
          <Stack
            className="absolute bottom-5 left-3"
            divider={<Divider />}
            spacing={10}
          >
            {TUTORIALS.map(({ type, controls }) => (
              <Stack key={type} spacing={10}>
                {controls.map(({ id, keyboardKey, description }) => (
                  <KeyboardTutorial
                    key={id}
                    id={id}
                    keyboardKey={keyboardKey}
                    description={description}
                    isPressed={
                      type === "cameraZoom" ? state[type] : state[type] === id
                    }
                  />
                ))}
              </Stack>
            ))}
          </Stack>
          <LinearProgress
            className="absolute! bottom-5 right-3 h-75!"
            value={speedProgress}
            aria-label="car speed"
            orientation="vertical"
            thickness={10}
            lineCap="round"
            trackColor="#fff5"
            progressColor="blue-300"
          />
        </>
      )}
    </div>
  );
};

export default FollowCurveCanvas;
