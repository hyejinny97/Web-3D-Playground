import { useLayoutEffect, useReducer, useRef, useState } from "react";
import GLTFModelProject from "@/projects/GLTFModelProject";
import type { Project } from "@/types/project";
import useControl from "@/hooks/useControl";
import useLoad from "@/hooks/useLoading";
import Stack from "@jinni-labs/ui/Stack";
import Divider from "@jinni-labs/ui/Divider";
import Loading from "@/components/Loading";
import { reducer } from "./GLTFModelCanvas.utils";
import { INITIAL_STATE, TUTORIALS } from "./GLTFModelCanvas.constants";
import KeyboardTutorial from "./KeyboardTutorial";
import CarSpeedProgress from "./CarSpeedProgress";

const GLTFModelCanvas = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { add, remove, removeGroup, clearAll } = useControl();
  const { isLoading, progress, loadStart, loading, loadComplete } = useLoad();
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const [speed, setSpeed] = useState(0); // 단위: m/s

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const canvasEl = document.createElement("canvas");
    canvasEl.className = "w-full h-full";
    canvasEl.id = String(Date.now());
    container.appendChild(canvasEl);

    const project: Project = new GLTFModelProject({
      canvasEl,
      controlUI: { add, remove, removeGroup, clearAll },
      loadManager: {
        onStart: loadStart,
        onProgress: loading,
        onLoad: loadComplete,
      },
      dispatch,
      setSpeed,
    });
    if (project.loop) project.renderLoop();
    else project.render();

    return () => {
      project.dispose();
      container.removeChild(canvasEl);
    };
  }, [add, remove, removeGroup, clearAll, loadStart, loading, loadComplete]);

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
                      type === "lightOn" ? state[type] : state[type] === id
                    }
                  />
                ))}
              </Stack>
            ))}
          </Stack>
          <CarSpeedProgress
            className="absolute bottom-5 right-3"
            speed={speed}
          />
        </>
      )}
    </div>
  );
};

export default GLTFModelCanvas;
