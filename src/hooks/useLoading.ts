import { useCallback, useState } from "react";

const useLoad = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState<number>(0);

  const loadStart = useCallback(() => {
    setIsLoading(true);
    setProgress(0);
  }, []);

  const loading = useCallback((percent: number) => {
    setProgress(Math.trunc(percent));
  }, []);

  const loadComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  return {
    isLoading,
    progress,
    loadStart,
    loading,
    loadComplete,
  };
};

export default useLoad;
