import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function ModeWrap({ children }) {
  const mode = useSelector((data) => data.area.mode);

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

  return children;
}
