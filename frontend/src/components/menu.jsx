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
import { Menu } from "@mui/material";
import { makeHand, makeShut } from "../features/part.jsx";
import IconTool from "./tool.jsx";

export default function ResponsiveDrawer() {
  const dispatch = useDispatch();
  const drawerWidth = 240;
  const vibe = useSelector((area) => area.area.vibe);
  const head = useSelector((area) => area.area.head);
  const load = useSelector((area) => area.area.load);
  const hand = useSelector((area) => area.area.hand);
  const shut = useSelector((area) => area.area.shut);

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
          <IconTool />
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
