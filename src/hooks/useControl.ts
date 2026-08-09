import ControlContext, {
  type ControlContextType,
} from "@/contexts/ControlContext";
import { useContext } from "react";

const useControl = (): ControlContextType => {
  const value = useContext(ControlContext);
  if (!value) throw new Error("ControlContext value is null");
  return value;
};

export default useControl;
