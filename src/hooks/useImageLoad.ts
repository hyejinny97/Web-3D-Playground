import { useContext } from "react";
import AssetsCacheContext from "@/contexts/AssetsCacheContext";

const useImageLoad = () => {
  const value = useContext(AssetsCacheContext);
  if (!value) throw new Error("AssetsCacheContext value is null");
  const { loadImage, loadImages } = value;
  return { loadImage, loadImages };
};

export default useImageLoad;
