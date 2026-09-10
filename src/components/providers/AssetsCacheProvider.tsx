import AssetsCacheContext, {
  type LoadManager,
} from "@/contexts/AssetsCacheContext";

const AssetsCacheProvider = ({ children }: { children: React.ReactNode }) => {
  const cache = new Map<string, Promise<HTMLImageElement>>();

  const loadImage = (url: string): Promise<HTMLImageElement> => {
    if (!cache.has(url)) {
      const promise = new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
      });
      cache.set(url, promise);
    }
    return cache.get(url)!;
  };

  const loadImages = (
    urls: string[],
    { onStart, onProgress, onLoad }: LoadManager = {},
  ): Promise<HTMLImageElement[]> => {
    const total = urls.length;

    if (total === 0) {
      onStart?.();
      onLoad?.();
      return Promise.resolve([]);
    }

    onStart?.();

    let loadedCount = 0;
    const promises = urls.map((url) =>
      loadImage(url).then((img) => {
        loadedCount += 1;
        onProgress?.(loadedCount, total);
        return img;
      }),
    );

    return Promise.all(promises).then((images) => {
      onLoad?.();
      return images;
    });
  };

  return (
    <AssetsCacheContext value={{ loadImage, loadImages }}>
      {children}
    </AssetsCacheContext>
  );
};

export default AssetsCacheProvider;
