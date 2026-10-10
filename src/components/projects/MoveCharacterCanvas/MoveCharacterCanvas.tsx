import { useLayoutEffect, useRef, useState } from "react";
import MoveCharacterProject from "@/projects/MoveCharacterProject";
import type { Project } from "@/types/project";
import useLoad from "@/hooks/useLoading";
import Loading from "../../Loading";
import KeyboardKey from "../../KeyboardKey";
import {
  CONTROL_KEYBOARD_KEYS,
  TUTORIALS,
} from "./MoveCharacterCanvas.constants";
import type { KeyboardKeyType } from "./MoveCharacterCanvas.types";
import Box from "@jinni-labs/ui/Box";
import Stack from "@jinni-labs/ui/Stack";
import Text from "@jinni-labs/ui/Text";

const MoveCharacterCanvas = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isLoading, progress, loadStart, loading, loadComplete } = useLoad();
  const [pressedKeys, setPressedKeys] = useState<Set<KeyboardKeyType>>(
    new Set(),
  );

  const selectKey = (key: KeyboardKeyType) => {
    setPressedKeys((prev) => {
      const newValue = new Set(prev);
      newValue.add(key);
      return newValue;
    });
  };
  const unselectKey = (key: KeyboardKeyType) => {
    setPressedKeys((prev) => {
      const newValue = new Set(prev);
      newValue.delete(key);
      return newValue;
    });
  };

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const canvasEl = document.createElement("canvas");
    canvasEl.className = "w-full h-full";
    canvasEl.id = String(Date.now());
    container.appendChild(canvasEl);

    const project: Project = new MoveCharacterProject({
      canvasEl,
      loadingOptions: {
        onStart: loadStart,
        onProgress: loading,
        onLoad: loadComplete,
      },
      selectKey,
      unselectKey,
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
        <>
          <div className="absolute left-6 bottom-6">
            {CONTROL_KEYBOARD_KEYS.map(({ id, name, className }) => (
              <KeyboardKey
                className={className}
                name={name}
                isPressed={pressedKeys.has(id)}
              />
            ))}
          </div>
          <Box
            className="absolute right-6 bottom-6 p-2 bg-[rgba(0,0,0,0.5)]"
            round="sm"
          >
            {TUTORIALS.map(({ label, content }) => (
              <Stack direction="row" spacing={5}>
                <Text className="typo-body-medium w-[160px] text-white!">
                  {label}
                </Text>
                <Text className="typo-body-small text-white!">: {content}</Text>
              </Stack>
            ))}
          </Box>
        </>
      )}
    </div>
  );
};

export default MoveCharacterCanvas;
