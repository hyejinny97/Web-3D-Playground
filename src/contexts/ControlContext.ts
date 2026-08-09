import type { ControlType } from "@/types/controls";
import { createContext } from "react";

export interface ControlContextType {
  controls: Map<string, ControlType[]>;
  add: (groupName: string, controlsToAdd: ControlType[]) => void;
  remove: (groupName: string, controlLabelsToRemove: string[]) => void;
  removeGroup: (groupName: string) => void;
  clearAll: () => void;
}

const ControlContext = createContext<ControlContextType | null>(null);

export default ControlContext;
