import "./styles/core.css";

import { data } from "./features/data.jsx";
import MainMenu from "./components/menu.jsx";
import Accolade from "./components/lade.jsx";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router";
import { ThemeProvider } from "@mui/material";
import { scheme } from "./config/base.js";
import AccoList from "./components/list.jsx";
import Mistaken from "./components/flaw.jsx";

createRoot(document.getElementById("root")).render(
  <Provider store={data}>
    <ThemeProvider theme={scheme}>
      <BrowserRouter>
        <Routes>
          <Route element={<MainMenu />} path="/">
            <Route element="" index />
            <Route element="" path="/rankings" />
            <Route element="" path="/profiles" />
            <Route element="" path="/userdata" />
            <Route element="" path="/operator" />
            <Route element="" path="/database" />
            <Route element="" path="/settings" />
            <Route path="/discover">
              <Route element={<AccoList />} index />
              <Route element={<Accolade />} path="accolade/:slugdata" />
            </Route>
            <Route element={<Mistaken />} path="*" />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </Provider>
);
