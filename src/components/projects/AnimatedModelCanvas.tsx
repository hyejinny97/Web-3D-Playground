import { useLayoutEffect, useRef, useState } from "react";
import AnimatedModelProject from "@/projects/AnimatedModelProject";
import type { Project } from "@/types/project";
import useLoad from "@/hooks/useLoading";
import Loading from "../Loading";
import Stack from "@jinni-labs/ui/Stack";
import Box from "@jinni-labs/ui/Box";
import RadioGroup from "@jinni-labs/ui/RadioGroup";
import Radio from "@jinni-labs/ui/Radio";
import Label from "@jinni-labs/ui/Label";
import type { AnimationNameType } from "@/projects/AnimatedModelProject/AnimatedModelProject.types";
import { ANIMATIONS } from "@/projects/AnimatedModelProject/AnimatedModelProject.constants";

const AnimatedModelCanvas = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const projectRef = useRef<AnimatedModelProject>(null);
  const { isLoading, progress, loadStart, loading, loadComplete } = useLoad();
  const [selectedAnimation, setSelectedAnimation] =
    useState<AnimationNameType>("T-pose");

  const handleAnimationChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const name = event.target.value as AnimationNameType;
    projectRef.current?.changeAnimation(name);
    setSelectedAnimation(name);
  };

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const canvasEl = document.createElement("canvas");
    canvasEl.className = "w-full h-full";
    canvasEl.id = String(Date.now());
    container.appendChild(canvasEl);

    const project = new AnimatedModelProject({
      canvasEl,
      loadingOptions: {
        onStart: loadStart,
        onProgress: loading,
        onLoad: loadComplete,
      },
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
        <Loading progress={progress} helpText="Loading GLTF file..." />
      ) : (
        <Box
          className="absolute bottom-2.5 left-1/2 -translate-1/2 p-2.5 bg-[#fffa]"
          round="sm"
        >
          <RadioGroup
            name="animation"
            value={selectedAnimation}
            onChange={handleAnimationChange}
          >
            <Stack direction="row" spacing={10}>
              {ANIMATIONS.map((animation) => (
                <Label
                  className="whitespace-nowrap"
                  key={animation}
                  content={animation}
                  size="sm"
                >
                  <Radio value={animation} />
                </Label>
              ))}
            </Stack>
          </RadioGroup>
        </Box>
      )}
    </div>
  );
};

export default AnimatedModelCanvas;
