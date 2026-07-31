import { useState } from "react";
import PlaygroundDrawer from "@/components/PlaygroundDrawer";
import OpenDrawerButton from "@/components/OpenDrawerButton";
import Canvas from "./components/Canvas";
import WebGL from "three/addons/capabilities/WebGL.js";

function App() {
  const [open, setOpen] = useState<boolean>(true);

  const openDrawer = () => setOpen(true);
  const closeDrawer = () => setOpen(false);

  if (!WebGL.isWebGL2Available()) {
    return (
      <div className="w-screen h-screen flex justify-center items-center text-lg font-bold">
        Your browser does not support WebGL2!
      </div>
    );
  }

  return (
    <main className="relative max-w-screen h-screen">
      <Canvas open={open} />
      <PlaygroundDrawer open={open} onClose={closeDrawer} />
      <OpenDrawerButton onClick={openDrawer} />
    </main>
  );
}

export default App;
