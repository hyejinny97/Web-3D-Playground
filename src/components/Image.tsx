import useImageLoad from "@/hooks/useImageLoad";
import { useEffect, useState } from "react";

interface ImageProps {
  className?: string;
  url: string;
  alt: string;
}

const Image = ({ className, url, alt }: ImageProps) => {
  const { loadImage } = useImageLoad();
  const [src, setSrc] = useState<string>();

  useEffect(() => {
    loadImage(url).then((img) => setSrc(img.src));
  }, [loadImage, url]);

  return src ? (
    <img className={className} src={src} alt={alt} crossOrigin="anonymous" />
  ) : null;
};

export default Image;
