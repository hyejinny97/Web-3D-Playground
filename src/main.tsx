import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./main.css";
import JinniProvider, {
  createDesignSystem,
} from "@jinni-labs/ui/JinniProvider";
import ProjectProvider from "@/components/ProjectProvider";

const designSystem = createDesignSystem({
  zIndex: {
    popper: 3000,
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <JinniProvider designSystem={designSystem}>
      <ProjectProvider>
        <App />
      </ProjectProvider>
    </JinniProvider>
  </StrictMode>,
);
