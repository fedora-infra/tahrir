import { flawText } from "../config/base.js";
import { Alert, AlertTitle } from "@mui/material";

export default function Mistaken() {
  const time = Math.floor(Date.now() / 1000);
  const text = flawText[time % flawText.length];

  return (
    <Alert severity="warning" variant="outlined">
      <AlertTitle>Resource unavailable</AlertTitle>
      {text}
    </Alert>
  );
}
