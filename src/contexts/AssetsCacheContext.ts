import { createContext } from "react";

export interface LoadManager {
  onStart?: () => void;
  onProgress?: (count: number, total: number) => void;
  onLoad?: () => void;
}

export interface AssetsCacheContextType {
  loadImage: (url: string) => Promise<HTMLImageElement>;
  loadImages: (
    urls: string[],
    { onStart, onProgress, onLoad }: LoadManager,
  ) => Promise<HTMLImageElement[]>;
}

const AssetsCacheContext = createContext<AssetsCacheContextType | null>(null);

export default AssetsCacheContext;
