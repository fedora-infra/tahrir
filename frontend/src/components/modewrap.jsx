import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { loadUserData } from "../features/auth.js";

export default function ModeWrap({ children }) {
  const dispatch = useDispatch();
  const mode = useSelector((data) => data.area.mode);
  const stat = useSelector((data) => data.auth.status);

  useEffect(() => {
    const updateMode = () => {
      if (mode === "auto") {
        document.documentElement.setAttribute(
          "data-bs-theme",
          window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
        );
      } else {
        document.documentElement.setAttribute("data-bs-theme", mode);
      }
    };
    updateMode();

    const styles = window.matchMedia("(prefers-color-scheme: dark)");
    styles.addEventListener("change", updateMode);
    return () => styles.removeEventListener("change", updateMode);
  }, [mode]);

  useEffect(() => {
    if (stat === "idle") {
      dispatch(loadUserData());
    }
  }, [dispatch, stat]);

  return children;
}
