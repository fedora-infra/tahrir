import { keepVibe, keepVibeAnch, keepModeAnch } from "../features/part.jsx";
import { useColorScheme } from "@mui/material";
import { vibeList } from "../config/base.js";
import { BrightnessAuto, BrightnessHigh, BrightnessLow, Palette } from "@mui/icons-material";
import { Menu } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import React from "react";
import { IconButton, Box } from "@mui/material";
import PickButton from "./pick.jsx";

export default function IconTool() {
  const dispatch = useDispatch();
  const vibeAnch = useSelector((area) => area.area.vibeAnch);
  const modeAnch = useSelector((area) => area.area.modeAnch);
  const vibeButn = React.useRef(null);
  const modeButn = React.useRef(null);

  const { mode, setMode } = useColorScheme();
  if (!mode) {
    return null;
  }

  const vibeOpen = (evnt) => {
    dispatch(keepVibeAnch(true));
  };

  const vibeShut = () => {
    dispatch(keepVibeAnch(false));
  };

  const modeOpen = (evnt) => {
    dispatch(keepModeAnch(true));
  };

  const modeShut = () => {
    dispatch(keepModeAnch(false));
  };

  const modeMake = (name) => {
    dispatch(keepModeAnch(false));
    setMode(name);
  };

  const vibeMake = (name) => {
    dispatch(keepVibeAnch(false));
    dispatch(keepVibe(name));
  };

  return (
    <div>
      <IconButton
        ref={vibeButn}
        size="large"
        aria-controls="vibe-select"
        aria-haspopup="true"
        onClick={vibeOpen}
        color="inherit"
        sx={{ padding: 0, marginRight: "20px" }}
      >
        <Palette />
      </IconButton>
      <Menu
        id="vibe-select"
        anchorEl={vibeButn.current}
        keepMounted
        open={vibeAnch}
        onClose={vibeShut}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        {Object.entries(vibeList).map(([name, color]) => (
          <PickButton
            icon={
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  backgroundColor: color,
                  border: "1px solid rgba(0,0,0,0.23)",
                }}
              />
            }
            func={() => vibeMake(color)}
            name={name}
          />
        ))}
      </Menu>
      <IconButton
        ref={modeButn}
        size="large"
        aria-controls="mode-select"
        aria-haspopup="true"
        onClick={modeOpen}
        color="inherit"
        sx={{ padding: 0 }}
      >
        <BrightnessAuto />
      </IconButton>
      <Menu
        id="mode-select"
        anchorEl={modeButn.current}
        keepMounted
        open={modeAnch}
        onClose={modeShut}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <PickButton icon={<BrightnessAuto />} func={() => modeMake("system")} name="System" />
        <PickButton icon={<BrightnessHigh />} func={() => modeMake("light")} name="Light" />
        <PickButton icon={<BrightnessLow />} func={() => modeMake("dark")} name="Dark" />
      </Menu>
    </div>
  );
}
