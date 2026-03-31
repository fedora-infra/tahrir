import { useEffect } from "react";
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
