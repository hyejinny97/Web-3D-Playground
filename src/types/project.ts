import type { ControlType } from "./controls";

export interface Project {
  loop?: boolean;
  render: () => void;
  renderLoop: () => void;
  dispose: () => void;
}

export interface ConstructorProps {
  canvasEl: HTMLCanvasElement;
  controlUI?: {
    add: (groupName: string, controlsToAdd: ControlType[]) => void;
    remove: (groupName: string, controlLabelsToRemove: string[]) => void;
    removeGroup: (groupName: string) => void;
    clearAll: () => void;
  };
}
