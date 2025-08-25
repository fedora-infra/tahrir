import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router";
import DrawList from "./draw.jsx";
import { Backdrop, CircularProgress } from "@mui/material";
import { BrightnessAuto, BrightnessHigh, BrightnessLow, Palette } from "@mui/icons-material";
import { MenuItem, Menu } from "@mui/material";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { keepAnch, makeHand, makeShut, keepVibe, keepVibeAnch, keepModeAnch } from "../features/part.jsx";
import { useColorScheme } from "@mui/material";
import { vibeList } from "../config/base.js";

export default function ResponsiveDrawer() {
  const dispatch = useDispatch();
  const drawerWidth = 240;
  const vibe = useSelector((area) => area.area.vibe);
  const head = useSelector((area) => area.area.head);
  const load = useSelector((area) => area.area.load);
  const hand = useSelector((area) => area.area.hand);
  const shut = useSelector((area) => area.area.shut);
  const vibeAnch = useSelector((area) => area.area.vibeAnch);
  const modeAnch = useSelector((area) => area.area.modeAnch);
  const { mode, setMode } = useColorScheme();
  const vibeButn = React.useRef(null);
  const modeButn = React.useRef(null);

  if (!mode) {
    return null;
  }

  const drawerShut = () => {
    dispatch(makeShut(true));
    dispatch(makeHand(false));
  };

  const drawerStop = () => {
    dispatch(makeShut(false));
  };

  const drawerOpen = () => {
    if (!shut) {
      dispatch(makeHand(!hand));
    }
  };

  const vibeOpen = (event) => {
    dispatch(keepVibeAnch(true));
  };

  const vibeShut = () => {
    dispatch(keepVibeAnch(false));
  };

  const modeOpen = (event) => {
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
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          color: { vibe },
        }}
        color="default"
      >
        <Toolbar variant="dense">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={drawerOpen}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography className="headelem" component="div" sx={{ flexGrow: 1 }}>
            {head}
          </Typography>
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
                <MenuItem key={name} onClick={() => vibeMake(color)} sx={{ padding: "5px 7.5px" }}>
                  <ListItemIcon>
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        backgroundColor: color,
                        border: "1px solid rgba(0,0,0,0.23)",
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText>{name}</ListItemText>
                </MenuItem>
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
              <MenuItem onClick={() => modeMake("system")} sx={{ padding: "5px 7.5px" }}>
                <ListItemIcon>
                  <BrightnessAuto />
                </ListItemIcon>
                <ListItemText>System</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => modeMake("light")} sx={{ padding: "5px 7.5px" }}>
                <ListItemIcon>
                  <BrightnessHigh />
                </ListItemIcon>
                <ListItemText>Light</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => modeMake("dark")} sx={{ padding: "5px 7.5px" }}>
                <ListItemIcon>
                  <BrightnessLow />
                </ListItemIcon>
                <ListItemText>Dark</ListItemText>
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }} aria-label="mailbox folders">
        <Drawer
          variant="temporary"
          open={hand}
          onTransitionEnd={drawerStop}
          onClose={drawerShut}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
          }}
        >
          <DrawList vibe={vibe} />
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
          }}
          open
        >
          <DrawList vibe={vibe} />
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar variant="dense" />
        <Outlet />
      </Box>
      <Backdrop sx={(theme) => ({ color: vibe, zIndex: theme.zIndex.drawer + 1 })} open={load}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
}
