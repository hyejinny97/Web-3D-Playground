import { useCallback, useLayoutEffect, useRef, useState } from "react";
import TextureMappingProject from "@/projects/TextureMappingProject";
import type { Project } from "@/types/project";
import useControl from "@/hooks/useControl";
import RadioGroup from "@jinni-labs/ui/RadioGroup";
import Radio from "@jinni-labs/ui/Radio";
import Label from "@jinni-labs/ui/Label";
import Stack from "@jinni-labs/ui/Stack";
import Box from "@jinni-labs/ui/Box";
import useLoad from "@/hooks/useLoading";
import Loading from "../Loading";
import useImageLoad from "@/hooks/useImageLoad";

const TEXTURES = ["Brick", "Ice", "Lava", "Fabric", "Glass"] as const;

const INIT_TEXTURE = TEXTURES[0];

const TextureMappingCanvas = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const projectRef = useRef<TextureMappingProject>(undefined);
  const { add, remove, removeGroup, clearAll } = useControl();
  const [selectedTexture, setSelectedTexture] =
    useState<(typeof TEXTURES)[number]>(INIT_TEXTURE);
  const { isLoading, progress, loadStart, loading, loadComplete } = useLoad();
  const { loadImages } = useImageLoad();

  const loadTextureImages = useCallback(
    (urls: string[]): Promise<HTMLImageElement[]> =>
      loadImages(urls, {
        onStart: loadStart,
        onProgress: loading,
        onLoad: loadComplete,
      }),
    [loadImages, loadStart, loading, loadComplete],
  );

  const select = (event: React.ChangeEvent<HTMLInputElement>) => {
    const texture = event.target.value as (typeof TEXTURES)[number];
    setSelectedTexture(texture);
    projectRef.current?.onTextureChange(texture);
  };

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const canvasEl = document.createElement("canvas");
    canvasEl.className = "w-full h-full";
    canvasEl.id = String(Date.now());
    container.appendChild(canvasEl);

    const project = new TextureMappingProject({
      canvasEl,
      controlUI: { add, remove, removeGroup, clearAll },
      initTexture: INIT_TEXTURE,
      loadTextureImages,
    }) satisfies Project;
    if ((project as Project).loop) project.renderLoop();
    else project.render();
    projectRef.current = project;

    return () => {
      project.dispose();
      container.removeChild(canvasEl);
    };
  }, [add, remove, removeGroup, clearAll, loadTextureImages]);

  return (
    <div ref={containerRef} className="relative w-full h-full">
      <Box
        className="absolute bottom-2.5 left-1/2 -translate-1/2 p-2.5 bg-[#fffa]"
        round="sm"
      >
        <RadioGroup name="texture" value={selectedTexture} onChange={select}>
          <Stack direction="row" spacing={10}>
            {TEXTURES.map((texture) => (
              <Label key={texture} content={texture} disabled={isLoading}>
                <Radio value={texture} />
              </Label>
            ))}
          </Stack>
        </RadioGroup>
      </Box>
      {isLoading && (
        <Loading progress={progress} helpText="Loading Textures..." />
      )}
    </div>
  );
};

export default TextureMappingCanvas;
