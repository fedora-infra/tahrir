import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";

import { hideLoad, showLoad } from "./part.js";

export function useLoadingState(isLoading, isUpdating) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (isLoading || isUpdating) {
      dispatch(showLoad());
    } else {
      dispatch(hideLoad());
    }
  }, [isLoading, isUpdating, dispatch]);
}

/**
 * Returns a boolean that stays true for at least `minMs` after
 * `isFetching` first becomes true, even if the fetch completes
 * almost instantly. This ensures fast API responses still produce
 * a visible spinner.
 */
export function useMinFetching(isFetching, minMs = 1000) {
  const [visible, setVisible] = useState(false);
  const startRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isFetching) {
      startRef.current = Date.now();
      setVisible(true);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    } else if (visible) {
      const elapsed = Date.now() - (startRef.current || 0);
      const remaining = Math.max(0, minMs - elapsed);
      timerRef.current = setTimeout(() => {
        setVisible(false);
        timerRef.current = null;
      }, remaining);
    }
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
    // visible excluded to prevent infinite loop — this effect controls it
    // minMs excluded as it's a stable constant that never changes at runtime
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetching]);

  return visible;
}
