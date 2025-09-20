import { useEffect, useState } from "react";

interface UseDelayedLoadingProps {
  isLoading: boolean;
  delay?: number; // in milliseconds, default 90
  hasData?: boolean; // to check if data exists
}

export const useDelayedLoading = ({
  isLoading,
  delay = 90,
  hasData = false
}: UseDelayedLoadingProps) => {
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isLoading && !hasData) {
      timer = setTimeout(() => {
        setShowLoading(true);
      }, delay);
    } else {
      setShowLoading(false);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isLoading, hasData, delay]);

  return showLoading;
};

export default useDelayedLoading;