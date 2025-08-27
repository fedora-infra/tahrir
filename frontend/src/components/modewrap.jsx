import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function ModeWrap({ children }) {
  const mode = useSelector((data) => data.area.mode);

  useEffect(() => {
    const updateMode = () => {
      if (mode === "auto") {
        const mode = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        document.body.setAttribute("data-bs-theme", mode);
      }
    };
    updateMode();
    const styles = window.matchMedia("(prefers-color-scheme: dark)");
    styles.addEventListener("change", updateMode);
    return () => styles.removeEventListener("change", updateMode);
  }, [mode]);

  return children;
}
