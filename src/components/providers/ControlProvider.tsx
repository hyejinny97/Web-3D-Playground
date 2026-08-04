import ControlContext from "@/contexts/ControlContext";
import { useCallback, useState } from "react";
import type { ControlType } from "@/types/controls";

type GroupNameType = string;

const ControlProvider = ({ children }: { children: React.ReactNode }) => {
  const [controls, setControls] = useState<Map<GroupNameType, ControlType[]>>(
    new Map(),
  );

  const addControls = useCallback(
    (groupName: string, controlsToAdd: ControlType[]) => {
      setControls((prev) => {
        const newMap = new Map(prev);
        if (prev.has(groupName)) {
          const prevControls = prev.get(groupName)!;
          const newControls = [...prevControls, ...controlsToAdd];
          newMap.set(groupName, newControls);
        } else {
          newMap.set(groupName, controlsToAdd);
        }
        return newMap;
      });
    },
    [],
  );

  const removeControls = useCallback(
    (groupName: string, controlLabelsToRemove: string[]) => {
      setControls((prev) => {
        if (prev.has(groupName)) {
          const prevControls = prev.get(groupName)!;
          const newControls = prevControls.filter(
            (con) => !controlLabelsToRemove.includes(con.label),
          );
          const newMap = new Map(prev);
          newMap.set(groupName, newControls);
          return newMap;
        }
        return prev;
      });
    },
    [],
  );

  const removeGroup = useCallback((groupName: string) => {
    setControls((prev) => {
      const newMap = new Map(prev);
      newMap.delete(groupName);
      return newMap;
    });
  }, []);

  const clearAll = useCallback(() => {
    setControls(new Map());
  }, []);

  return (
    <ControlContext
      value={{
        controls,
        addControls,
        removeControls,
        removeGroup,
        clearAll,
      }}
    >
      {children}
    </ControlContext>
  );
};

export default ControlProvider;
