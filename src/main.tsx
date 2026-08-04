import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./main.css";
import JinniProvider, {
  createDesignSystem,
} from "@jinni-labs/ui/JinniProvider";
import ProjectProvider from "@/components/ProjectProvider";
import ControlProvider from "@/components/ControlProvider";

const designSystem = createDesignSystem({
  zIndex: {
    popper: 3000,
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <JinniProvider designSystem={designSystem}>
      <ProjectProvider>
        <ControlProvider>
          <App />
        </ControlProvider>
      </ProjectProvider>
    </JinniProvider>
  </StrictMode>,
);
