import { useState } from "react";
import PlaygroundDrawer from "@/components/PlaygroundDrawer";
import OpenDrawerButton from "@/components/OpenDrawerButton";
import Canvas from "./components/Canvas";

function App() {
  const [open, setOpen] = useState<boolean>(true);

  const openDrawer = () => setOpen(true);
  const closeDrawer = () => setOpen(false);

  return (
    <main className="relative max-w-screen h-screen">
      <Canvas open={open} />
      <PlaygroundDrawer open={open} onClose={closeDrawer} />
      <OpenDrawerButton onClick={openDrawer} />
    </main>
  );
}

export default App;
